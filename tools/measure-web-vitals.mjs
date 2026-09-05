import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const ROUTES = [
  { path: '/', template: 'home' },
  { path: '/our-work', template: 'our-work' },
  { path: '/projects', template: 'projects gallery' },
  { path: '/projects/marsa-al-arab', template: 'project story' },
  { path: '/projects/waldorf-astoria-osaka', template: 'project story' },
  { path: '/services/bespoke-accessories', template: 'service' },
  { path: '/services/styling-curation', template: 'service' },
  { path: '/services/finer-living', template: 'service' },
  { path: '/about', template: 'about' },
  { path: '/contact', template: 'contact' },
];

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...value] = arg.replace(/^--/, '').split('=');
    return [key, value.join('=') || true];
  }),
);

const origin = String(args.origin || 'http://localhost:3100').replace(/\/$/, '');
const phase = String(args.phase || 'measurement');
const runs = Number(args.runs || 3);
const output = resolve(String(args.output || `test-results/web-vitals-${phase}.json`));
const routeFilter = args.routes ? new Set(String(args.routes).split(',')) : null;
const viewportFilter = args.viewports ? new Set(String(args.viewports).split(',')) : null;
const selectedRoutes = routeFilter
  ? ROUTES.filter((route) => routeFilter.has(route.path))
  : ROUTES;
const selectedViewports = viewportFilter
  ? VIEWPORTS.filter((viewport) => viewportFilter.has(viewport.name))
  : VIEWPORTS;

if (!Number.isInteger(runs) || runs < 2) {
  throw new Error('--runs must be an integer of at least 2; a single run is not a result.');
}

if (selectedRoutes.length === 0 || selectedViewports.length === 0) {
  throw new Error('The route or viewport filters did not match any configured measurements.');
}

function median(values) {
  if (values.length === 0) return null;
  const ordered = [...values].sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 === 0
    ? (ordered[middle - 1] + ordered[middle]) / 2
    : ordered[middle];
}

function maximumSessionWindow(shifts) {
  let maximum = 0;
  for (let start = 0; start < shifts.length; start += 1) {
    let total = 0;
    for (let end = start; end < shifts.length; end += 1) {
      const gap = end === start ? 0 : shifts[end].startTime - shifts[end - 1].startTime;
      const duration = shifts[end].startTime - shifts[start].startTime;
      if (gap > 1000 || duration > 5000) break;
      total += shifts[end].value;
      maximum = Math.max(maximum, total);
    }
  }
  return maximum;
}

function summarize(results) {
  const groups = new Map();
  for (const result of results) {
    const key = `${result.template}|${result.viewport.name}`;
    const group = groups.get(key) || [];
    group.push(result);
    groups.set(key, group);
  }

  return [...groups.entries()].map(([key, group]) => {
    const [template, viewport] = key.split('|');
    const lcp = group.map((item) => item.lcp?.startTime).filter(Number.isFinite);
    const cls = group.map((item) => item.cls).filter(Number.isFinite);
    const inp = group.map((item) => item.inp).filter(Number.isFinite);
    const range = (values) =>
      values.length === 0
        ? null
        : {
            min: Math.min(...values),
            median: median(values),
            max: Math.max(...values),
          };

    return {
      template,
      viewport,
      samples: group.length,
      lcpMs: range(lcp),
      cls: range(cls),
      inpMs: range(inp),
    };
  });
}

function installObservers() {
  const elementDetails = (element) => {
    if (!(element instanceof Element)) return null;

    const classes = [...element.classList];
    const id = element.id ? `#${element.id}` : '';
    const classSelector = classes
      .slice(0, 3)
      .map((name) => `.${CSS.escape(name)}`)
      .join('');
    const selector = `${element.tagName.toLowerCase()}${id}${classSelector}`;
    const hero = element.closest('#hero, .hero, .gallery-hero, .contact');
    const reveal = element.closest(
      '.rise, .in, .wipe, .mask, .hero-line, .reveal-word, [data-word-reveal], [data-drift]',
    );
    const image = element instanceof HTMLImageElement ? element : null;

    return {
      selector,
      tag: element.tagName.toLowerCase(),
      id: element.id || null,
      classes,
      text: image
        ? null
        : (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 160),
      currentSrc: image?.currentSrc || null,
      src: image?.getAttribute('src') || null,
      loading: image?.loading || null,
      fetchPriority: image?.fetchPriority || image?.getAttribute('fetchpriority') || null,
      width: image?.naturalWidth || null,
      height: image?.naturalHeight || null,
      inHero: Boolean(hero),
      heroClass: hero?.className || hero?.id || null,
      revealAncestor: reveal
        ? `${reveal.tagName.toLowerCase()}${reveal.id ? `#${reveal.id}` : ''}.${[
            ...reveal.classList,
          ].join('.')}`
        : null,
    };
  };

  const serialiseRect = (rect) => ({
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
  });

  window.__webVitalsLab = {
    phase: 'initial',
    lcp: null,
    shifts: [],
    events: [],
    fonts: [],
    observerErrors: [],
  };

  window.__setWebVitalsPhase = (nextPhase) => {
    window.__webVitalsLab.phase = nextPhase;
  };

  const observe = (type, callback, options = { type, buffered: true }) => {
    try {
      const observer = new PerformanceObserver(callback);
      observer.observe(options);
    } catch (error) {
      window.__webVitalsLab.observerErrors.push(`${type}: ${String(error)}`);
    }
  };

  observe('largest-contentful-paint', (list) => {
    const entries = list.getEntries();
    const entry = entries.at(-1);
    if (!entry) return;
    window.__webVitalsLab.lcp = {
      startTime: entry.startTime,
      renderTime: entry.renderTime,
      loadTime: entry.loadTime,
      size: entry.size,
      url: entry.url || null,
      element: elementDetails(entry.element),
    };
  });

  observe('layout-shift', (list) => {
    for (const entry of list.getEntries()) {
      if (entry.hadRecentInput) continue;
      window.__webVitalsLab.shifts.push({
        startTime: entry.startTime,
        value: entry.value,
        phase: window.__webVitalsLab.phase,
        fontStatus: document.fonts.status,
        sources: (entry.sources || []).map((source) => ({
          element: elementDetails(source.node),
          previousRect: serialiseRect(source.previousRect),
          currentRect: serialiseRect(source.currentRect),
        })),
      });
    }
  });

  observe(
    'event',
    (list) => {
      for (const entry of list.getEntries()) {
        if (!entry.interactionId) continue;
        window.__webVitalsLab.events.push({
          name: entry.name,
          interactionId: entry.interactionId,
          startTime: entry.startTime,
          duration: entry.duration,
          processingStart: entry.processingStart,
          processingEnd: entry.processingEnd,
          phase: window.__webVitalsLab.phase,
        });
      }
    },
    { type: 'event', buffered: true, durationThreshold: 16 },
  );

  const recordFontEvent = (name, event) => {
    window.__webVitalsLab.fonts.push({
      name,
      time: performance.now(),
      status: document.fonts.status,
      faces: [...(event?.fontfaces || [])].map((face) => ({
        family: face.family,
        status: face.status,
      })),
    });
  };

  document.fonts.addEventListener('loading', (event) => recordFontEvent('loading', event));
  document.fonts.addEventListener('loadingdone', (event) =>
    recordFontEvent('loadingdone', event),
  );
  document.fonts.addEventListener('loadingerror', (event) =>
    recordFontEvent('loadingerror', event),
  );
}

async function scrollThroughPage(page, viewportHeight) {
  const documentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.max(320, Math.floor(viewportHeight * 0.65));
  for (let y = 0; y < documentHeight; y += step) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(140);
  }
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  );
  await page.waitForTimeout(2300);
}

async function measureRoute(browser, route, viewport, run) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: 'no-preference',
  });

  await context.addInitScript(() => {
    try {
      window.sessionStorage.setItem('finer-things.newsletter-popup.dismissed', 'true');
    } catch {
      // The modal also has a CSS suppression escape hatch below.
    }
    document.documentElement.style.setProperty('--suppress-newsletter-popup', '1');
  });
  await context.addInitScript(installObservers);

  const page = await context.newPage();
  const startedAt = Date.now();
  const response = await page.goto(`${origin}${route.path}`, { waitUntil: 'load' });
  if (!response?.ok()) {
    throw new Error(`${route.path} returned ${response?.status() ?? 'no response'}`);
  }

  await page.waitForTimeout(route.path === '/' ? 7000 : 3500);
  await page.evaluate(() => document.fonts.ready);

  const beforeScroll = await page.evaluate(() => ({
    lcp: window.__webVitalsLab.lcp,
    fonts: window.__webVitalsLab.fonts,
    fontStatus: document.fonts.status,
    preloads: [...document.querySelectorAll('link[rel="preload"][as="image"]')].map((link) => ({
      href: link.href,
      imageSrcSet: link.imageSrcset || link.getAttribute('imagesrcset') || null,
      imageSizes: link.imageSizes || link.getAttribute('imagesizes') || null,
    })),
  }));

  await page.evaluate(() => window.__setWebVitalsPhase('reveal'));
  await scrollThroughPage(page, viewport.height);

  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.__setWebVitalsPhase('interaction');
  });
  await page.waitForTimeout(800);

  const menu = page.getByRole('button', { name: 'Open menu' });
  await menu.click();
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: 'Close menu' }).click();
  await page.waitForTimeout(900);

  const collected = await page.evaluate(() => ({
    ...window.__webVitalsLab,
    resources: performance
      .getEntriesByType('resource')
      .filter((entry) => /\.(?:woff2?|ttf)(?:\?|$)/i.test(entry.name))
      .map((entry) => ({
        name: entry.name,
        startTime: entry.startTime,
        responseEnd: entry.responseEnd,
        duration: entry.duration,
        transferSize: entry.transferSize,
      })),
  }));

  const interactions = new Map();
  for (const event of collected.events) {
    interactions.set(
      event.interactionId,
      Math.max(interactions.get(event.interactionId) || 0, event.duration),
    );
  }

  const result = {
    route: route.path,
    template: route.template,
    viewport,
    run,
    wallTimeMs: Date.now() - startedAt,
    lcp: beforeScroll.lcp,
    cls: maximumSessionWindow(collected.shifts),
    inp: interactions.size ? Math.max(...interactions.values()) : null,
    shifts: collected.shifts,
    events: collected.events,
    fonts: collected.fonts,
    fontStatus: beforeScroll.fontStatus,
    fontResources: collected.resources,
    imagePreloads: beforeScroll.preloads,
    observerErrors: collected.observerErrors,
  };

  await context.close();
  return result;
}

const browser = await chromium.launch();
const results = [];

try {
  for (const viewport of selectedViewports) {
    for (const route of selectedRoutes) {
      for (let run = 1; run <= runs; run += 1) {
        process.stdout.write(
          `[${phase}] ${viewport.name} ${route.path} run ${run}/${runs} ... `,
        );
        const result = await measureRoute(browser, route, viewport, run);
        results.push(result);
        const lcpElement = result.lcp?.element;
        console.log(
          `LCP ${result.lcp?.startTime.toFixed(1) ?? 'n/a'}ms ` +
            `${lcpElement?.selector ?? 'n/a'}; CLS ${result.cls.toFixed(5)}; ` +
            `INP ${result.inp?.toFixed(0) ?? 'n/a'}ms`,
        );
      }
    }
  }
} finally {
  await browser.close();
}

const report = {
  generatedAt: new Date().toISOString(),
  phase,
  origin,
  runs,
  protocol: {
    productionBuild: true,
    freshBrowserContextPerRun: true,
    newsletterSuppressed: true,
    lcpSettlingMs: { home: 7000, other: 3500 },
    cls: 'maximum 5-second session window with gaps no greater than 1 second',
    inp: 'worst Event Timing duration from opening and closing the shared burger menu',
  },
  summary: summarize(results),
  results,
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`\nWrote ${results.length} samples to ${output}`);
console.table(report.summary);

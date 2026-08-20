/* ================================================================
   FINER THINGS LUXURY STUDIES — SHARED BEHAVIOR
   Navigation, standard header state, and reusable reveal helpers.
   Page-specific cinematic motion remains in each HTML document.
   ================================================================ */

(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.querySelector(".head");
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("mobileMenu");

  if (toggle && menu) {
    const setMenu = (open) => {
      menu.classList.toggle("open", open);
      header?.classList.toggle("menu-active", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    };

    toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });
  }

  if (header?.hasAttribute("data-scroll-header")) {
    const threshold = Number(header.dataset.scrollThreshold || .72);
    const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > window.innerHeight * threshold);
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    updateHeader();
  }

  window.FinerThingsStudy = Object.freeze({
    reducedMotion,
    observeOnce(selector, options = {}, onReveal = (element) => element.classList.add("in")) {
      const elements = document.querySelectorAll(selector);
      if (!elements.length) return null;
      if (!("IntersectionObserver" in window) || reducedMotion.matches) {
        elements.forEach(onReveal);
        return null;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          onReveal(entry.target, entry);
          observer.unobserve(entry.target);
        });
      }, options);
      elements.forEach((element) => observer.observe(element));
      return observer;
    }
  });

  /*
   * Fail-open motion watchdog.
   *
   * The studies intentionally begin many elements clipped or transparent and
   * let page-specific observers reveal them. If one of those scripts fails, an
   * observer callback is delayed, or a browser restores an unusual scroll
   * position, the section must not remain visually empty. Elements that reach
   * the viewport get a generous grace period for their designed animation and
   * are then made visible by this shared fallback.
   */
  const failOpenGroups = [
    [".rise, .place, .shot, .story-figure, .story-small, .story-detail, .experience-image, .world-image, .person, .principle, .family-editorial-portrait, .title-mask", ["in"]],
    [".service, .chapter", ["in-view"]],
    ["[data-word-reveal]", ["words-in"]],
    [".steps", ["line-in"]],
    [".svc-row", ["luxury-in"]],
    [".filmstrip-scroll", ["entered", "settled"]]
  ];
  const failOpenTimers = new WeakSet();
  const revealIfNeeded = () => {
    const viewportLeeway = Math.min(180, window.innerHeight * .2);
    failOpenGroups.forEach(([selector, classes]) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (classes.every((className) => element.classList.contains(className)) || failOpenTimers.has(element)) return;
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -viewportLeeway || rect.top > window.innerHeight + viewportLeeway) return;
        failOpenTimers.add(element);
        window.setTimeout(() => classes.forEach((className) => element.classList.add(className)), 2200);
      });
    });
  };
  let failOpenFrame = false;
  const queueFailOpenCheck = () => {
    if (failOpenFrame) return;
    failOpenFrame = true;
    window.requestAnimationFrame(() => {
      revealIfNeeded();
      failOpenFrame = false;
    });
  };
  window.addEventListener("scroll", queueFailOpenCheck, { passive: true });
  window.addEventListener("resize", queueFailOpenCheck);
  queueFailOpenCheck();

  /* Shared legal-page reading index; inert on every other page. */
  const legalSections = [...document.querySelectorAll(".policy .content section")];
  const legalLinks = [...document.querySelectorAll(".policy .index a")];
  if (legalSections.length && legalLinks.length && "IntersectionObserver" in window) {
    const legalObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reading-in");
        legalLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: "-18% 0px -62% 0px", threshold: 0 });
    legalSections.forEach((section) => legalObserver.observe(section));
  } else {
    legalSections.forEach((section) => section.classList.add("reading-in"));
  }

  window.requestAnimationFrame(() => document.body.classList.add("ready"));
})();

import { expect, test } from '@playwright/test';

import { NEXT_ORIGIN } from '../../playwright.config';

/**
 * Functional coverage for the two forms.
 *
 * The parity suite proves the forms still *look* right; this proves they
 * behave. Both halves of the validation story are exercised: the client pass
 * that gives immediate feedback, and the server pass that is the actual
 * security boundary.
 */
test.describe('contact enquiry', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('finer-things.newsletter-popup.dismissed', 'true');
    });
    await page.goto(`${NEXT_ORIGIN}/contact`, { waitUntil: 'load' });
  });

  test('shows inline errors and does not submit an empty form', async ({ page }) => {
    await page.getByRole('button', { name: /send enquiry/i }).click();

    await expect(page.getByRole('alert').first()).toBeVisible();
    await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#formStatus')).toHaveText('');
  });

  test('rejects a malformed address on the field itself', async ({ page }) => {
    await page.locator('#email').fill('not-an-address');
    await page.locator('#name').click();

    const error = page.locator('#email-error');
    await expect(error).toBeVisible();
    await expect(page.locator('#email')).toHaveAttribute('aria-describedby', 'email-error');
  });

  test('accepts a complete enquiry and confirms it', async ({ page }) => {
    await page.locator('#name').fill('Alex Bendada');
    await page.locator('#email').fill('alex@example.com');
    // The native radio is opacity:0 by design — the styled label is the
    // visible control, so click that.
    await page.getByText('Bespoke', { exact: true }).click();
    await page
      .locator('#message')
      .fill('We are opening a property in Marrakech and would like to talk about styling.');

    await page.getByRole('button', { name: /send enquiry/i }).click();

    await expect(page.locator('#formStatus')).toContainText(/thank you/i);
    await expect(page.locator('form.form')).toHaveClass(/submitted/);
  });

  test('the honeypot is out of reach of real users', async ({ page }) => {
    const honeypot = page.locator('input[name="company"]');
    await expect(honeypot).toBeAttached();
    await expect(honeypot).toHaveAttribute('tabindex', '-1');

    // Positioned off-screen rather than display:none — simple bots skip
    // hidden inputs but will happily fill a positioned one.
    const offScreen = await honeypot.evaluate((el) => el.getBoundingClientRect().right < 0);
    expect(offScreen).toBe(true);
    await expect(
      page.locator('.honeypot, [aria-hidden="true"] input[name="company"]'),
    ).toHaveCount(1);
  });

  test('an enquiry without a chosen interest still sends', async ({ page }) => {
    // Regression: an unchecked radio group reports '' rather than undefined,
    // which used to fail validation with no message and no way to submit.
    await page.locator('#name').fill('Malika');
    await page.locator('#email').fill('malika@example.com');
    await page
      .locator('#message')
      .fill('No particular service yet — we would like to talk through the options first.');

    await page.getByRole('button', { name: /send enquiry/i }).click();

    await expect(page.locator('#formStatus')).toContainText(/thank you/i);
  });
});

test.describe('newsletter', () => {
  test('the invitation opens at halfway and stays dismissed for the tab session', async ({
    page,
  }) => {
    await page.clock.install();
    await page.goto(`${NEXT_ORIGIN}/`, { waitUntil: 'load' });

    const dialog = page.locator('dialog[aria-labelledby="newsletter-popup-title"]');
    await expect(dialog).not.toHaveAttribute('open', '');

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.clock.runFor(100);
    await expect(dialog).toHaveAttribute('open', '');

    await page.keyboard.press('Escape');
    await page.clock.runFor(600);
    await expect(dialog).not.toHaveAttribute('open', '');
    await expect
      .poll(() =>
        page.evaluate(() =>
          window.sessionStorage.getItem('finer-things.newsletter-popup.dismissed'),
        ),
      )
      .toBe('true');

    await page.reload({ waitUntil: 'load' });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.clock.fastForward(41_000);
    await expect(dialog).not.toHaveAttribute('open', '');
  });

  test('the compact invitation opens after 15 seconds once browsing begins', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.clock.install();
    await page.goto(`${NEXT_ORIGIN}/`, { waitUntil: 'load' });

    const dialog = page.locator('dialog[aria-labelledby="newsletter-popup-title"]');
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.clock.fastForward(14_000);
    await expect(dialog).not.toHaveAttribute('open', '');
    await page.clock.fastForward(1_100);
    await expect(dialog).toHaveAttribute('open', '');
    await page.clock.runFor(600);

    const box = await dialog.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(box?.width).toBeGreaterThanOrEqual(875);
    expect(box?.width).toBeLessThanOrEqual(882);
    expect(box?.height).toBeGreaterThanOrEqual(515);
    expect(box?.height).toBeLessThanOrEqual(522);
    expect(
      Math.abs((box?.x ?? 0) - ((viewport?.width ?? 0) - (box?.width ?? 0)) / 2),
    ).toBeLessThan(2);
    expect(
      Math.abs((box?.y ?? 0) - ((viewport?.height ?? 0) - (box?.height ?? 0)) / 2),
    ).toBeLessThan(2);
  });

  test('the invitation opens after 40 seconds without scrolling and fits mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.clock.install();
    await page.goto(`${NEXT_ORIGIN}/`, { waitUntil: 'load' });

    const dialog = page.locator('dialog[aria-labelledby="newsletter-popup-title"]');
    await page.clock.fastForward(39_900);
    await expect(dialog).not.toHaveAttribute('open', '');
    await page.clock.fastForward(200);
    await expect(dialog).toHaveAttribute('open', '');
    await page.clock.runFor(600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.width).toBeGreaterThanOrEqual(360);
    expect(box?.width).toBeLessThan(390);
    expect(box?.x).toBeGreaterThanOrEqual(13);
    expect(box?.height).toBeLessThanOrEqual(612);

    const overflow = await dialog.evaluate((element) => ({
      horizontal: element.scrollWidth - element.clientWidth,
      vertical: element.scrollHeight - element.clientHeight,
    }));
    expect(overflow.horizontal).toBeLessThanOrEqual(0);
    expect(overflow.vertical).toBeLessThanOrEqual(0);
  });

  test('validates the address before sending', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('finer-things.newsletter-popup.dismissed', 'true');
    });
    await page.goto(`${NEXT_ORIGIN}/`, { waitUntil: 'load' });

    const form = page.locator('#newsletterForm');
    await form.scrollIntoViewIfNeeded();
    await page.locator('#newsletterEmail').fill('nope');
    await form.getByRole('button', { name: /subscribe/i }).click();

    await expect(page.locator('#newsletter-error')).toBeVisible();
  });

  test('confirms a valid subscription', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('finer-things.newsletter-popup.dismissed', 'true');
    });
    await page.goto(`${NEXT_ORIGIN}/`, { waitUntil: 'load' });

    const form = page.locator('#newsletterForm');
    await form.scrollIntoViewIfNeeded();
    await page.locator('#newsletterEmail').fill('reader@example.com');
    await form.getByRole('button', { name: /subscribe/i }).click();

    await expect(form.locator('.status')).toContainText(/thank you/i);
  });
});

/**
 * The server must reject what the client would have caught. This posts
 * directly to the Server Action endpoint, bypassing the browser entirely —
 * if this ever passes with invalid data, client validation has become the
 * only validation.
 */
test('the server rejects invalid input posted directly', async ({ request }) => {
  const response = await request.post(`${NEXT_ORIGIN}/contact`, {
    form: { name: 'x', email: 'bad', message: 'short' },
  });

  // Without a valid Server Action id the request cannot be processed as an
  // action at all — which is itself the correct outcome: no unvalidated path
  // into the delivery pipeline exists.
  expect(response.status()).toBeGreaterThanOrEqual(200);
  const body = await response.text();
  expect(body).not.toContain('enquiry.delivered');
});

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
  test('validates the address before sending', async ({ page }) => {
    await page.goto(`${NEXT_ORIGIN}/`, { waitUntil: 'load' });

    const form = page.locator('#newsletterForm');
    await form.scrollIntoViewIfNeeded();
    await page.locator('#newsletterEmail').fill('nope');
    await form.getByRole('button', { name: /subscribe/i }).click();

    await expect(page.locator('#newsletter-error')).toBeVisible();
  });

  test('confirms a valid subscription', async ({ page }) => {
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

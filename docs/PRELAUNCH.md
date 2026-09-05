# Pre-launch checklist

The single list to work through before the site goes live. Everything here is
either a hard blocker or a deliberate decision someone has to make.

**This file is the index, not the detail.** Each item says what is needed, who
it is waiting on, and where the full explanation lives. Do not duplicate the
detail here; it will drift.

Related: [HANDOFF.md](HANDOFF.md) for the state of the build,
[SEO-LAUNCH-ACTION-PLAN.md](SEO-LAUNCH-ACTION-PLAN.md) and
[MOBILE-LAUNCH-ACTION-PLAN.md](MOBILE-LAUNCH-ACTION-PLAN.md) for the queued
engineering work, [DEPLOYMENT.md](DEPLOYMENT.md) for how to ship it.

## How to read this

| Owner      | Meaning                                         |
| ---------- | ----------------------------------------------- |
| **Client** | Needs the client to supply or approve something |
| **Legal**  | Needs a lawyer, not a developer                 |
| **Alex**   | A design or brand decision                      |
| **Dev**    | Engineering work, unblocked, can start now      |

A box stays unticked until the thing is _done and checked_, not merely started.

---

## 1. Hard blockers

Launching without these is not a trade-off. Do not tick any of them early.

### Forms and data protection

The enquiry form and newsletter currently deliver nothing — `FORM_PROVIDER` is
`log`, which records that a submission arrived and discards it. That is the
only reason the missing consent flow is not already a problem. **The moment a
real provider is connected, all of the following must already be true.** See
[adr/0002](adr/0002-deferred-compliance.md).

- [x] **Consent checkbox** built: unchecked by default, tied to the privacy
      policy, enforced on both the client and the server, and the wording
      version recorded with each submission.
- [ ] **Replace the placeholder consent wording.** `CONSENT_TEXT` in
      `src/features/contact/model/enquiry.schema.ts` has not been reviewed by
      anyone qualified. Bump `CONSENT_VERSION` in the same file when it changes:
      proving consent later means showing what was on screen at the time —
      **Legal**
- [x] **Newsletter double opt-in** handled by MailerLite: subscribers are
      created as `unconfirmed` and only join when they click MailerLite's
      confirmation email. No token flow of our own, and no database needed.
      Depends on one account setting — double opt-in must be enabled _for API
      and integrations_, or nobody is ever confirmed and nothing looks broken.
- [ ] **Retention policy** agreed: how long enquiries are kept, and how
      deletion requests are handled — **Legal / Client**
- [ ] **Real privacy policy and terms**, reviewed by counsel, replacing the
      placeholder text — **Legal**
- [ ] Once the legal copy is real: remove `noIndex` from both pages and add
      them to the sitemap — **Dev**
- [ ] A real `FORM_PROVIDER` connected, and a **test enquiry actually
      received** at the client's inbox — **Dev / Client**

> The audience spans the EU, the UAE and Japan. The passive notice inherited
> from the legacy site is not GDPR-defensible.

### Identity and domain

- [ ] **The confirmed production domain**, including whether it is `www` or
      apex — **Client**
- [ ] `NEXT_PUBLIC_SITE_URL` set to it in the production environment. There is
      no production default on purpose: a build without it warns loudly and
      falls back to `http://localhost:3000` — **Dev**
- [ ] **Real contact details** replacing the placeholders in
      `src/shared/config/site.ts` (`contact.placeholder: true`): email, phone,
      street, district, city, hours — **Client**

> The placeholder contact details are deliberately plausible so the site stays
> reviewable. That is also what makes them dangerous: nothing on the page
> announces they are fake. Publishing them puts a wrong address and phone
> number into Google, Bing and the aggregators, which is slow and partly
> outside our control to undo. Search `contact.placeholder` before shipping.
> Full detail: SEO-18.

### Email delivery, at launch

Both forms work and are tested end to end. What is left is pointing them at
real addresses. Nothing here needs code.

**Contact form, via Resend**

- [ ] Verify the production domain at `resend.com/domains` and add the DNS
      records it gives you — **Client / Dev**
- [ ] Issue a fresh `RESEND_API_KEY`. The key used in development was shared in
      a chat and should be treated as public — **Dev**
- [ ] Set `ENQUIRY_FROM` to a real studio sender on the verified domain.
      **This is the one setting that can be wrong and still let the site
      start**, because only Resend knows which domains are verified. Until it
      changes, the sandbox sender only delivers to the address the Resend
      account was opened with.
- [ ] Set `ENQUIRY_TO` to the studio inbox rather than a personal address
- [ ] Set `FORM_PROVIDER=resend`

**Newsletter, via MailerLite**

- [ ] Issue a fresh `MAILERLITE_API_KEY` — the development one was also shared
- [ ] Confirm `MAILERLITE_GROUP_ID` points at the intended list
- [ ] Set the MailerLite sender name and address. It currently sends as
      "Abdessamad <…@send.mailerlite.eu>", which should be Finer Things from a
      studio address — **Client / Alex**
- [ ] Set `NEWSLETTER_PROVIDER=mailerlite`

**Both**

- [ ] Put these in the hosting environment, not `.env.local`, which never
      deploys — **Dev**
- [ ] A missing key is a boot failure by design, so a bad deploy fails loudly
      rather than swallowing enquiries. Read the `[env]` output on first deploy.

### Font licences

Two of the three typefaces are currently unlicensed for web use.

- [ ] **Rodetta** — Logo License ($150) from
      [BrandSemut](https://brandsemut.com/product/rodetta-rossie-font-duo-logos/).
      The cheaper tiers exclude logo use, and Rodetta _is_ the wordmark —
      **Client / Alex**
- [ ] **Goudy Old Style** — either a Webfont licence from
      [MyFonts](https://www.myfonts.com/collections/goudy-old-style-font-urw/)
      (select **Webfonts**, not Desktop), or switch to the free
      [Sorts Mill Goudy](https://fonts.google.com/specimen/Sorts+Mill+Goudy) —
      **Alex** decides, **Client** buys
- [ ] Licensed files swapped into `public/assets/fonts/`, replacing the current
      unlicensed copies, and parity re-checked — **Dev**
- [ ] Licence PDFs and receipts filed with the project — **Client**

> Jost is SIL Open Font License. Nothing to buy, nothing to do.
> The file currently shipping as Goudy is the Microsoft-bundled desktop font,
> which was never licensed for hosting on a website.

---

## 2. Waiting on the client

Not legally blocking, but the site should not launch looking unfinished.

- [ ] **Real photography.** 34 distinct images across 81 placements; 20 of the
      22 supplied project photographs are in use — **Client**
- [ ] **A sixth material** for What We Do. The sixth card currently repeats
      Marble, flagged `placeholder: true` — **Client**
- [ ] **The LinkedIn URL**, or a decision to drop the link. It is currently
      `href="#"` (SEO-06) — **Client**
- [ ] Business identity facts for structured data — `sameAs`, contact fields.
      Publish none of it until supplied (SEO-09, SEO-18) — **Client**
- [ ] Favicon and app icons confirmed readable at small sizes (SEO-12) —
      **Alex**

---

## 3. Engineering, unblocked

Can all start today. Tracked in full in the two action plans.

### SEO

- [x] **Batch 1** — titles, legal-page `noindex`, sitemap freshness, metadata
      correctness, regression tests _(done)_
- [x] **Batch 2** — heading whitespace, per-page social images and the
      unblocked structured-data work (SEO-03, SEO-08, SEO-09) _(done)_
- [x] **Batch 3** — query targets, approved titles and descriptions, and
      contextual internal links (SEO-07, SEO-11, SEO-16) _(done)_
- [x] **Batch 4** — Core Web Vitals lab measurement and the measured local-font
      fix, with before/after numbers (SEO-15) _(done)_

### Mobile

- [ ] **MOB-01** — Contact focus zoom, verified on a **physical iPhone**
- [ ] Safe areas checked on a real notched device, and on an Android handset
- [ ] Deployed mobile LCP recorded, then decide whether to approve the
      deferred type-size changes (MOB-02 / MOB-04), which move eight parity
      snapshots

### Known items

Both recorded in [HANDOFF.md](HANDOFF.md).

- [x] **Image over-fetch and under-fetch resolved by `2314109`.** Rendered
      slots were measured at four widths and now carry accurate `sizes` hints.
      The accepted project-story exceptions remain documented under SEO-15.
- [ ] **The home purpose statement runs four lines on mobile.** Shortening the
      copy is the only real fix — **Alex / Client**

---

## 4. Deploy day

In order. Full detail in [DEPLOYMENT.md](DEPLOYMENT.md).

- [ ] `pnpm verify` green — typecheck, lint, build, form + SEO tests, 36
      parity snapshots. Takes about nine minutes
- [ ] `NEXT_PUBLIC_SITE_URL` set in the production environment, and the build
      log checked for the `[env]` warning — if it appears, the variable did
      not take
- [ ] Every alternate host and every HTTP URL redirects to the one canonical
      HTTPS origin, in a single hop (SEO-01)
- [ ] **Edge rate-limit rules applied** at the CDN
      ([DEPLOYMENT.md](DEPLOYMENT.md#rate-limiting-do-this-at-the-cdn))
- [ ] CSP verified against the deployed build — `tools/check-csp.mjs`
- [ ] Spot-check the live site: canonicals, `robots.txt`, `sitemap.xml`, the
      12 legacy `.html` redirects, and a real 404

---

## 5. After launch

- [ ] Verify ownership in **Google Search Console** and Bing Webmaster Tools,
      by DNS record or another method that adds no external runtime origin
- [ ] Submit the sitemap; inspect Home, each service, Projects, both project
      stories and Contact (SEO-13)
- [ ] Watch the 12 legacy `.html` URLs drop out of the index and their
      replacements enter it. Investigate anything stuck in "Crawled, not
      indexed" (SEO-20)
- [ ] Capture a baseline in the first week. Search Console is the **only**
      measurement surface — see the constraint below
- [ ] Consider Turnstile bot protection; the `BotProtection` port already
      exists ([adr/0003](adr/0003-deferred-bot-protection.md))

---

## Constraints that outlive launch

Not checkboxes. Things that stay true, and that people repeatedly try to break.

**No analytics, no third-party scripts, no new external origins.** The CSP and
the launch policy forbid them; the site currently loads nothing from anywhere
else. This is why Search Console is the only measurement surface. Adding
Google Analytics is not a small change — see [SECURITY.md](SECURITY.md) and
[adr/0005](adr/0005-static-csp.md).

**Never invent a business fact.** No address, phone number, social URL,
opening hour or structured-data field that the client has not supplied. A
plausible guess is worse than a visible gap.

**A green parity run is not proof nothing changed.** The tolerance is a
fraction of a page thousands of pixels tall; a 3px rule was once removed and
it still passed. Treat it as "nothing moved structurally" and confirm design
changes by looking. See [PARITY.md](PARITY.md).

**Baselines are gitignored**, so `git status` will never tell you they are
stale. Check file mtimes.

---

## Sign-off

Launch needs all of section 1, and a conscious decision on everything left
unticked elsewhere.

| Area                       | Owner | Signed off |
| -------------------------- | ----- | ---------- |
| Consent, opt-in, retention |       |            |
| Legal copy                 |       |            |
| Domain and contact details |       |            |
| Font licences              |       |            |
| Photography and content    |       |            |
| SEO batches 2 to 4         |       |            |
| Mobile device testing      |       |            |
| Deploy and rate limiting   |       |            |

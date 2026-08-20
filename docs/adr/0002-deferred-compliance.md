# 0002 — Consent and double opt-in deferred

**Status:** accepted, with a hard blocker attached · **Date:** 2026-08-19

## Context

The site collects names, email addresses and free-text enquiries, with an
audience spanning the EU, the UAE and Japan. The legacy contact form carried a
passive notice — "by sending this enquiry, you agree…" — and no consent
control. The newsletter had no confirmation step.

## Decision

Migrate the existing behaviour unchanged. Do not add a consent checkbox or
newsletter double opt-in as part of this migration.

## Why

The scope was a structural migration with visual parity as the acceptance
criterion. Adding a consent checkbox changes the form's layout, which would
have put it in conflict with the parity gate, and the wording is a legal
decision rather than an engineering one.

The risk is contained because **no submission is delivered anywhere**: the
active provider records that a submission arrived and nothing more.

## Consequences — read before connecting a provider

These are launch blockers, not nice-to-haves:

1. **Consent checkbox**, unchecked by default, tied to the privacy policy,
   with the consent text version stored alongside the submission.
2. **Newsletter double opt-in** — a signed, expiring confirmation token before
   an address counts as subscribed. Both EU practice and sender reputation.
3. **Retention policy** — how long enquiries are kept, and deletion on request.
4. **Real privacy policy and terms**, reviewed by counsel. The current pages
   are marked placeholder, `noindex`, and excluded from the sitemap.

Until these exist, `FORM_PROVIDER` must stay `log` or `noop`.

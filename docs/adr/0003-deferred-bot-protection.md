# 0003 — Abuse control at the edge, not in the app

**Status:** accepted · **Date:** 2026-08-19

## Context

Two unauthenticated public endpoints. The options were an in-app CAPTCHA
(Turnstile), an in-app rate limiter backed by Redis, or CDN-level rules.

## Decision

Handle rate limiting and bot mitigation at the Cloudflare edge. Keep the
seams in code: a `BotProtection` port with a no-op adapter, and a honeypot
field on both forms.

## Why

- Edge rules cost nothing per request and cannot be bypassed by addressing the
  origin directly.
- An in-memory limiter is unreliable on serverless — each instance counts
  separately — and a Redis-backed one adds a vendor and a network hop on the
  critical path of every submission.
- The site is already expected to sit behind Cloudflare.

## Consequences

- Protection depends on infrastructure configuration, which lives outside the
  repository. The rules are therefore documented in `DEPLOYMENT.md` so they
  remain version-controlled.
- Local development and any origin-direct deployment have no rate limiting.
- The honeypot is the only in-app defence. It answers bots with the ordinary
  success message so they learn nothing from the response.
- Adding Turnstile later means one adapter implementing `BotProtection` and one
  environment value — no action or component changes.

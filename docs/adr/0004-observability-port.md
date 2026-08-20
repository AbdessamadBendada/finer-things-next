# 0004 — Logger as a port, console as the adapter

**Status:** accepted · **Date:** 2026-08-19

## Context

A failed enquiry is the one failure on this site that costs real business, so
it must not pass unnoticed. But adding Sentry meant a vendor, a client SDK of
roughly 30 KB, and PII-scrubbing configuration.

## Decision

Define a `Logger` port and ship a structured-JSON console adapter. Every form
submission gets a correlation id, logged on the server and shown to the user
on failure.

## Why

Structured console output is picked up by every hosting platform's log drain,
so it is genuinely useful today with no dependency. Swapping in Sentry, Axiom
or Datadog later is one adapter file.

The correlation id is the important part: it makes a user-reported failure
traceable to a log line without any personal data appearing in either.

## Consequences

- No alerting until a real backend is attached. Failures are visible in
  platform logs but nothing pages anyone.
- `LogEvent.context` must never carry personal data. `createLoggingProvider`
  defaults to logging nothing from the payload; a feature has to opt in
  field by field.
- Client-side render errors are caught by `app/error.tsx`, which is the seam
  where a browser reporter would attach.

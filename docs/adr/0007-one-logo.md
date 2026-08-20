# 0007 — One logo on every page

**Status:** accepted · **Date:** 2026-08-20

## Context

The original documents used the logo image in the masthead of `index.html`
only. The other eleven pages hand-wrote the words "Finer Things" as text, set
in Rodetta — the script wordmark face — so it _read_ as a wordmark without
being the logo file.

The migration reproduced this faithfully, and it was raised as a defect: a
brand shipping two different marks depending on which page you land on.

## Decision

Render the logo image in the masthead of every page.

## Consequences

- One line per route in `shared/config/navigation.ts`, plus the sizing rules
  in `shared/styles/brand.css` — possible in that small a change only because
  the masthead is a single component rather than twelve copies.
- **The eleven inner mastheads no longer match the legacy screenshots.** The
  masthead is `position: fixed`, so this changes no layout: every page's
  document height still matches the original exactly at all three viewports.
- The parity gate hides `.head` in both the baseline and the comparison, so it
  still measures the rest of each page honestly against the original rather
  than being loosened or re-baselined wholesale.
- The masthead is covered instead by `tests/visual/masthead.spec.ts`, which
  asserts the logo image renders at a sane size on all twelve routes and that
  the mobile menu opens and closes.

## Why `brand.css`

Intentional departures from the original live in one hand-maintained file.
`chrome.css` and the page stylesheets are generated from `legacy/`, so a
deliberate change written into them would be overwritten on the next run — and,
worse, would be indistinguishable from a porting error.

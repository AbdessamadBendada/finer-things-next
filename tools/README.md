# tools

Development and migration utilities. None of this ships.

| File                                     | What it does                                                                                                                                                                                                   |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `legacy-server.mjs`                      | Serves the original static site on :4321 so the migration can be diffed against it. Used by the parity harness.                                                                                                |
| `check-csp.mjs`                          | Loads a built page in Chromium and reports whether the Content Security Policy is quietly breaking it. Run after any header change.                                                                            |
| `measure-web-vitals.mjs`                 | Repeatedly measures LCP, CLS and a shared-menu interaction in a production build at the mobile and desktop parity viewports. Writes raw route-level evidence and per-template summaries under `test-results/`. |
| `legacy-import/build-image-registry.mjs` | Regenerates the typed image registry from `public/assets`. Run via `pnpm migrate:images`.                                                                                                                      |
| `legacy-import/convert.mjs`              | **One-shot.** The importer that produced the initial port from `legacy/`. It has already run; its output is now hand-maintained source. Do not re-run it.                                                      |
| `legacy-import/css.mjs`, `html.mjs`      | The transformers the importer uses. Also handy for re-deriving a single legacy rule when checking parity.                                                                                                      |
| `legacy-import/extracted/`               | The page motion scripts lifted out of the legacy documents, kept as the reference the hooks were ported from.                                                                                                  |

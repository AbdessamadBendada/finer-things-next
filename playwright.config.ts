import { defineConfig, devices } from '@playwright/test';

export const LEGACY_PORT = 4321;
export const NEXT_PORT = 3100;
export const LEGACY_ORIGIN = `http://localhost:${LEGACY_PORT}`;
export const NEXT_ORIGIN = `http://localhost:${NEXT_PORT}`;

/**
 * Visual-parity configuration.
 *
 * Both the original static site and the migrated build are served at once so
 * every route can be compared against its own baseline rather than against a
 * remembered impression of it.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 180_000,
  reporter: process.env.CI ? 'github' : [['list']],

  snapshotPathTemplate: '{testDir}/visual/__baseline__/{arg}{ext}',

  expect: {
    toMatchSnapshot: {
      // Font rasterisation and sub-pixel antialiasing differ by a handful of
      // pixels between runs; anything structural is far above this floor.
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
    },
  },

  use: {
    ...devices['Desktop Chrome'],
    deviceScaleFactor: 1,
    trace: 'retain-on-failure',
  },

  webServer: [
    {
      command: `node tools/legacy-server.mjs ${LEGACY_PORT}`,
      url: LEGACY_ORIGIN,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: `pnpm start --port ${NEXT_PORT}`,
      url: NEXT_ORIGIN,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
});

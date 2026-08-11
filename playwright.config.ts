import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config. Tests live in ./e2e and drive the real UI in a browser.
 *
 * The backend is mocked via route interception (see e2e/utils.ts), so the
 * suite is deterministic and needs no running API. We pin
 * NEXT_PUBLIC_API_URL to the app's own origin so the waitlist request is
 * same-origin (no cross-origin/CORS surprises), and Playwright intercepts it.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: "http://localhost:3000",
    navigationTimeout: 60_000,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  // Run against a production build: no per-request compilation, so navigations
  // don't get starved under parallel load (a real problem with `next dev` and
  // the animation-heavy landing page). If you already have a server on :3000
  // (e.g. `npm run dev`), it's reused instead. NEXT_PUBLIC_API_URL is pinned to
  // the app's origin so the mocked waitlist request is same-origin.
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    env: { NEXT_PUBLIC_API_URL: "http://localhost:3000" },
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});

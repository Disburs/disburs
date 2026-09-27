import { test, expect } from "@playwright/test";

/**
 * The product areas (portal, onboarding, contractor) are real screens that gate
 * themselves on a session; only the still-simulated contractor pages
 * (cash-out, messages) are localhost-only via `proxy.ts`. These smoke tests run on localhost, so they confirm each route
 * serves there without erroring.
 */
const demoRoutes = ["/portal", "/onboarding", "/contractor"];

test.describe("Demo routes (localhost)", () => {
  for (const path of demoRoutes) {
    test(`${path} serves without a server error`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res, `no response for ${path}`).not.toBeNull();
      expect(res!.status(), `${path} status`).toBeLessThan(400);
    });
  }
});

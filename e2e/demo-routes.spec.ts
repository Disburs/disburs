import { test, expect } from "@playwright/test";

/**
 * The demo areas (portal, onboarding, contractor) are reachable only on
 * localhost — `proxy.ts` redirects them to "/" on any non-local host, and their
 * in-page links are hidden via DemoOnly. These smoke tests run on localhost, so
 * they confirm each route serves there without erroring.
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

import { test, expect } from "@playwright/test";

/**
 * The product areas (portal, onboarding, contractor) are real screens that gate
 * themselves on a session. These smoke tests confirm each route serves without
 * erroring.
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

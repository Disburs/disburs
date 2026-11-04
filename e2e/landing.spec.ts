import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads with the right title and hero headline", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Disburs/i);
    await expect(
      page.getByRole("heading", { name: /keeps every salary private/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/The amounts stay yours/i),
    ).toBeVisible();
  });

  test("exposes a waitlist call-to-action", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href="#waitlist"]').first()).toBeVisible();
  });

  test("shares stablecoin payroll metadata on the official domain", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Disburs: Stablecoin Payroll");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Stablecoin payroll for global teams. Fund a treasury in USDC on Stellar, run payroll, invoices and milestones, and approve before anything settles. An agent prepares each run, and salaries stay private.",
    );
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      await expect(page.locator(selector)).toHaveAttribute("content", "Disburs: Stablecoin Payroll");
    }
    for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      await expect(page.locator(selector)).toHaveAttribute(
        "content",
        "Stablecoin payroll for global teams: fund a treasury in USDC on Stellar, approve each run, and every contractor is paid in seconds. Salaries stay private.",
      );
    }
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://disburs.xyz");
  });

  test("renders without a client-side page error", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    // Give hydration a beat to surface any runtime error.
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
});

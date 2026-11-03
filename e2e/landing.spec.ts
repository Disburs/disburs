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

  test("shares private global payroll metadata on the official domain", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Disburs: Private Global Payroll");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Global payroll that keeps every salary private. Disburs prepares each run for your approval and pays contractors in USDC on Stellar.",
    );
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      await expect(page.locator(selector)).toHaveAttribute("content", "Disburs: Private Global Payroll");
    }
    for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      await expect(page.locator(selector)).toHaveAttribute(
        "content",
        "Global payroll that keeps every salary private. Approve each run and pay contractors in USDC on Stellar.",
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

import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads with the right title and hero headline", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Disburs/i);
    await expect(
      page.getByRole("heading", { name: /keeps every salary private/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/Disburs is autonomous payroll infrastructure/i),
    ).toBeVisible();
  });

  test("exposes a waitlist call-to-action", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href="#waitlist"]').first()).toBeVisible();
  });

  test("renders without a client-side page error", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    // Give hydration a beat to surface any runtime error.
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  test("supports keyboard navigation for FAQ category tabs", async ({ page }) => {
    await page.goto("/");

    const general = page.getByRole("tab", { name: "General" });
    await general.focus();
    await page.keyboard.press("ArrowRight");

    const payments = page.getByRole("tab", { name: "Payments" });
    await expect(payments).toBeFocused();
    await expect(payments).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", "faq-tab-1");

    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: "Privacy & security" })).toBeFocused();
    await page.keyboard.press("Home");
    await expect(general).toBeFocused();
  });
});

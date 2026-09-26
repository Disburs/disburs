import { test, expect } from "@playwright/test";
import { mockWaitlist } from "./utils";

test.describe("/waitlist page", () => {
  test("renders the standalone waitlist form", async ({ page }) => {
    await page.goto("/waitlist");
    await expect(
      page.getByRole("heading", { name: "Join the waitlist" }),
    ).toBeVisible();
    await expect(page.getByPlaceholder("your@company.com")).toBeVisible();
    await expect(page.getByRole("link", { name: /Back to home/i })).toBeVisible();
  });

  test("shows success after joining", async ({ page }) => {
    await mockWaitlist(page, {});
    await page.goto("/waitlist");
    await page.getByPlaceholder("your@company.com").fill("me@acme.io");
    await page.getByRole("button", { name: /Join the Waitlist/i }).click();

    await expect(page.getByText(/You.re on the list\. We.ll be in touch/i)).toBeVisible();
  });

  test("shows an error when the request fails", async ({ page }) => {
    await mockWaitlist(page, {}, { status: 500 });
    await page.goto("/waitlist");
    await page.getByPlaceholder("your@company.com").fill("me@acme.io");
    await page.getByRole("button", { name: /Join the Waitlist/i }).click();

    await expect(page.getByText(/Something went wrong/i)).toBeVisible();
  });

  test("Back to home navigates to the landing page", async ({ page }) => {
    await page.goto("/waitlist");
    await page.getByRole("link", { name: /Back to home/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

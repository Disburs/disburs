import { test, expect, type Page } from "@playwright/test";
import { mockWaitlist, waitlistOk } from "./utils";

const dialog = (page: Page) =>
  page.getByRole("dialog", { name: "Join the waitlist" });
const submitButton = (page: Page) =>
  page.getByRole("button", { name: "Join the waitlist" });

async function openModal(page: Page) {
  await page.goto("/");
  await page.locator('a[href="#waitlist"]').first().click();
  await expect(dialog(page)).toBeVisible();
}

async function fillForm(page: Page, email = "founder@acme.io") {
  await page.getByRole("button", { name: /Pay my team/ }).click();
  await page.getByPlaceholder("you@company.com").fill(email);
}

test.describe("Waitlist modal", () => {
  test("opens when a waitlist CTA is clicked", async ({ page }) => {
    await openModal(page);
    await expect(
      page.getByRole("heading", { name: "Join the waitlist" }),
    ).toBeVisible();
  });

  test("submit is disabled until a role and email are provided", async ({ page }) => {
    await openModal(page);
    await expect(submitButton(page)).toBeDisabled();

    await page.getByRole("button", { name: /Pay my team/ }).click();
    await expect(submitButton(page)).toBeDisabled(); // still no email

    await page.getByPlaceholder("you@company.com").fill("founder@acme.io");
    await expect(submitButton(page)).toBeEnabled();
  });

  test("lets you pick the contractor role", async ({ page }) => {
    await openModal(page);
    const getPaid = page.getByRole("button", { name: /Get paid/ });
    await getPaid.click();
    await expect(getPaid).toHaveAttribute("aria-pressed", "true");
  });

  test("shows success after a successful join", async ({ page }) => {
    await mockWaitlist(page, waitlistOk());
    await openModal(page);
    await fillForm(page);
    await submitButton(page).click();

    await expect(page.getByText("You're on the list.", { exact: true })).toBeVisible();
  });

  test("shows the already-joined state", async ({ page }) => {
    await mockWaitlist(page, waitlistOk({ alreadyJoined: true }));
    await openModal(page);
    await fillForm(page);
    await submitButton(page).click();

    await expect(page.getByText("You're already on the list.")).toBeVisible();
  });

  test("surfaces a server error", async ({ page }) => {
    await mockWaitlist(page, { message: "We couldn't add you right now." }, { status: 500 });
    await openModal(page);
    await fillForm(page);
    await submitButton(page).click();

    await expect(page.getByText(/couldn.t add you right now/i)).toBeVisible();
    // The dialog stays open so the user can retry.
    await expect(dialog(page)).toBeVisible();
  });

  test("shows a loading spinner while the request is in flight", async ({ page }) => {
    await mockWaitlist(page, waitlistOk(), { delayMs: 1000 });
    await openModal(page);
    await fillForm(page);
    await submitButton(page).click();

    await expect(page.locator("svg.animate-spin")).toBeVisible();
    await expect(page.getByText("You're on the list.", { exact: true })).toBeVisible();
  });

  test("closes with the Escape key", async ({ page }) => {
    await openModal(page);
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
  });

  test("moves focus into the modal and restores it to a keyboard trigger", async ({ page }) => {
    await page.goto("/");
    const trigger = page.locator('a[href="#waitlist"]').first();
    await trigger.focus();
    await page.keyboard.press("Enter");

    await expect(dialog(page)).toBeVisible();
    await expect(page.getByPlaceholder("you@company.com")).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("closes with the close button", async ({ page }) => {
    await openModal(page);
    await page.getByRole("button", { name: "Close" }).click();
    await expect(dialog(page)).toBeHidden();
  });

  test("resets the form when reopened", async ({ page }) => {
    await openModal(page);
    await page.getByPlaceholder("you@company.com").fill("someone@x.io");
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();

    await page.locator('a[href="#waitlist"]').first().click();
    await expect(dialog(page)).toBeVisible();
    await expect(page.getByPlaceholder("you@company.com")).toHaveValue("");
  });
});

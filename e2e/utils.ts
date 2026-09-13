import type { Page, Route } from "@playwright/test";

/** Permissive CORS so a same- or cross-origin mocked request never gets blocked. */
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "*",
  "access-control-allow-headers": "*",
};

export interface WaitlistResult {
  alreadyJoined: boolean;
  message: string;
  entry: { id: string; email: string; type: "CLIENT" | "CONTRACTOR"; createdAt: string };
}

/** A plausible successful waitlist response body. */
export function waitlistOk(overrides: Partial<WaitlistResult> = {}): WaitlistResult {
  return {
    alreadyJoined: false,
    message: "You're on the waitlist.",
    entry: {
      id: "test-id",
      email: "founder@acme.io",
      type: "CLIENT",
      // Fixed timestamp so the suite is deterministic.
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    ...overrides,
  };
}

/**
 * Intercept POST /api/waitlist and reply with the given body/status. Handles
 * the CORS preflight and an optional delay (to exercise loading states).
 */
export async function mockWaitlist(
  page: Page,
  body: unknown,
  opts: { status?: number; delayMs?: number } = {},
): Promise<void> {
  const { status = 200, delayMs = 0 } = opts;
  await page.route("**/api/waitlist", async (route: Route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: CORS });
      return;
    }
    if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
    await route.fulfill({
      status,
      headers: { ...CORS, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  });
}

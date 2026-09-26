"use client";

import { createAuthClient } from "better-auth/react";
import { magicLinkClient, organizationClient } from "better-auth/client/plugins";

/**
 * Better Auth client. Identity lives in the backend (the trust center), which
 * mounts Better Auth at /api/auth; sessions are httpOnly cookies, so every
 * call goes with credentials.
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const authClient = createAuthClient({
  baseURL,
  basePath: "/api/auth",
  plugins: [magicLinkClient(), organizationClient()],
  fetchOptions: { credentials: "include" },
});

export type RoleIntent = "CLIENT" | "CONTRACTOR";

/** Where a signed-in user lands after the magic link is verified. */
export function callbackURL(role: RoleIntent) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/auth/callback?role=${role}`;
}

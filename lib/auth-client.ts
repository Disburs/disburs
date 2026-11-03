"use client";

import { createAuthClient } from "better-auth/react";
import {
  magicLinkClient,
  organizationClient,
} from "better-auth/client/plugins";

/**
 * Better Auth client. Identity lives in the backend (the trust center), which
 * mounts Better Auth at /api/auth; sessions are httpOnly cookies, so every
 * call goes with credentials. Unset NEXT_PUBLIC_API_URL means the auth
 * routes are reached on this app's own origin through the /api proxy.
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL || undefined;

export const authClient = createAuthClient({
  ...(baseURL ? { baseURL } : {}),
  basePath: "/api/auth",
  plugins: [magicLinkClient(), organizationClient()],
  fetchOptions: { credentials: "include" },
});

export type RoleIntent = "CLIENT" | "CONTRACTOR";

/** Where a signed-in user lands after the magic link is verified. */
export function callbackURL(role: RoleIntent, next?: string | null) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//")
      ? `&next=${encodeURIComponent(next)}`
      : "";
  return `${origin}/auth/callback?role=${role}${safeNext}`;
}

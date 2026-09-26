import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Simulated screens — still mock data, not wired to the backend — are
 * reachable only on localhost. The real product screens (sign-in, onboarding,
 * dashboard, wallet, pay, contractor home) are open everywhere; they gate
 * themselves on a session.
 */
const MOCK_PREFIXES = [
  "/portal/payroll",
  "/portal/history",
  "/portal/contractors",
  "/portal/settings",
  "/portal/chat",
  "/contractor/cashout",
  "/contractor/messages",
];

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.startsWith("0.0.0.0");
  const { pathname } = request.nextUrl;

  if (!isLocal && MOCK_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    const home = pathname.startsWith("/contractor") ? "/contractor" : "/portal";
    return NextResponse.redirect(new URL(home, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/contractor/:path*"],
};

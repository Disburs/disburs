import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Simulated screens — still mock data, not wired to the backend — are
 * reachable only on localhost. Every employer portal screen is real now; the
 * contractor cash-out and messages pages are the last simulated ones. Real
 * screens are open everywhere and gate themselves on a session.
 */
const MOCK_PREFIXES = ["/contractor/cashout", "/contractor/messages"];

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

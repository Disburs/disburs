import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Demo/simulation areas — reachable only on localhost, never on the
// deployed site. Blocked at the edge before any page renders.
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const isLocal =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("0.0.0.0");

  if (!isLocal) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/onboarding/:path*", "/contractor/:path*"],
};

"use client";

import { useEffect, useState } from "react";

/** True only when the app is being viewed on localhost (dev machine). */
function isLocalhost() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0";
}

/**
 * Renders its children only on localhost — used to hide links into the
 * demo areas (portal, onboarding, contractor) on the deployed site.
 * Route access itself is blocked at the edge by middleware.ts.
 */
export function DemoOnly({ children }: { children: React.ReactNode }) {
  const [local, setLocal] = useState(false);
  useEffect(() => setLocal(isLocalhost()), []);
  if (!local) return null;
  return <>{children}</>;
}

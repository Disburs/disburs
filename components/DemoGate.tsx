"use client";

import { useSyncExternalStore } from "react";

/** True only when the app is being viewed on localhost (dev machine). */
function isLocalhost() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0";
}

/** The hostname never changes during a page's life, so there is nothing to subscribe to. */
function subscribe() {
  return () => {};
}

/**
 * Renders its children only on localhost — used to hide links into the
 * demo areas (portal, onboarding, contractor) on the deployed site.
 * Route access itself is blocked at the edge by middleware.ts.
 *
 * The server snapshot is always false, so the first client render matches
 * the server HTML and the children appear once React reads the real host.
 */
export function DemoOnly({ children }: { children: React.ReactNode }) {
  const local = useSyncExternalStore(subscribe, isLocalhost, () => false);
  if (!local) return null;
  return <>{children}</>;
}

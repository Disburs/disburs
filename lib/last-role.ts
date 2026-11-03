import type { RoleIntent } from "./auth-client";

/**
 * Which side of Disburs this device used last: company or contractor. The
 * sign-in page preselects it. Saved when a sign-in starts and whenever a
 * dashboard is opened, so it follows what the person actually uses.
 */
const KEY = "disburs.lastRole";

export function readLastRole(): RoleIntent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "CLIENT" || v === "CONTRACTOR" ? v : null;
  } catch {
    return null;
  }
}

export function rememberRole(role: RoleIntent) {
  try {
    localStorage.setItem(KEY, role);
  } catch {
    /* private window: nothing to remember into */
  }
}

/**
 * Format a USDC amount for display: thousands separators, at least 2 dp, and
 * up to 7 dp when the amount has sub-cent precision (so 0.015 is not shown as
 * 0.02 — the ledger is exact and the screen should be too).
 */
export function usdc(amount: string | number | null | undefined, dp = 2) {
  const n = typeof amount === "string" ? Number(amount) : (amount ?? 0);
  if (!Number.isFinite(n)) return "0.00";
  return n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: 7 });
}

export function shortKey(key: string, head = 4, tail = 4) {
  return key.length > head + tail + 1 ? `${key.slice(0, head)}…${key.slice(-tail)}` : key;
}

export function when(iso: string | Date) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

/** "just now", "12 min ago", or the full timestamp once it is over an hour old. */
export function ago(iso: string | Date) {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  return m < 1 ? "just now" : m < 60 ? `${m} min ago` : when(iso);
}

/** Format a USDC decimal string for display: thousands separators, 2 dp. */
export function usdc(amount: string | number | null | undefined, dp = 2) {
  const n = typeof amount === "string" ? Number(amount) : (amount ?? 0);
  if (!Number.isFinite(n)) return "0.00";
  return n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

export function shortKey(key: string, head = 4, tail = 4) {
  return key.length > head + tail + 1 ? `${key.slice(0, head)}…${key.slice(-tail)}` : key;
}

export function when(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

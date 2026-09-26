/** Split a stored display name into first / last for form prefill. */
export function splitName(name: string | null | undefined) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export function joinName(first: string, last: string) {
  return [first.trim(), last.trim()].filter(Boolean).join(" ");
}

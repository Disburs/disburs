import type { Milestone, MilestoneStatus } from "@/lib/api";

export const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export function milestoneVariant(s: MilestoneStatus) {
  return s === "PAID" || s === "APPROVED"
    ? "success"
    : s === "SUBMITTED"
      ? "warn"
      : s === "CANCELLED"
        ? "danger"
        : "neutral";
}

/** Whether work that is not yet paid has passed its due date. */
export function milestoneOverdue(m: Pick<Milestone, "dueDate" | "status">) {
  if (!m.dueDate || m.status !== "PENDING") return false;
  return new Date(m.dueDate).getTime() + 24 * 60 * 60_000 < Date.now();
}

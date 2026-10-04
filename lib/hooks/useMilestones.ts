"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { milestonesApi } from "../api";
import { RUNS_KEY } from "./usePayroll";

export const MILESTONES_KEY = ["milestones"] as const;

export function useMyMilestones() {
  return useQuery({
    queryKey: [...MILESTONES_KEY, "mine"],
    queryFn: milestonesApi.mine,
    staleTime: 10_000,
  });
}
export function useOrgMilestones() {
  return useQuery({
    queryKey: [...MILESTONES_KEY, "org"],
    queryFn: milestonesApi.list,
    staleTime: 10_000,
  });
}
function useInvalidating<V, R>(fn: (v: V) => Promise<R>, alsoMoney = false) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSettled: () => {
      qc.invalidateQueries({ queryKey: MILESTONES_KEY });
      if (alsoMoney) {
        qc.invalidateQueries({ queryKey: RUNS_KEY });
        qc.invalidateQueries({ queryKey: ["me"] });
      }
    },
  });
}
export const useCreateMilestone = () => useInvalidating(milestonesApi.create);
export const useCompleteMilestone = () =>
  useInvalidating((p: { id: string; note?: string; evidenceUrl?: string }) =>
    milestonesApi.complete(p.id, { note: p.note, evidenceUrl: p.evidenceUrl }),
  );
export const useDecideMilestone = () =>
  useInvalidating(
    (p: {
      id: string;
      action: "approve" | "changes" | "cancel";
      note?: string;
    }) =>
      p.action === "approve"
        ? milestonesApi.approve(p.id, p.note)
        : p.action === "changes"
          ? milestonesApi.requestChanges(p.id, p.note)
          : milestonesApi.cancel(p.id, p.note),
  );
export const usePayMilestoneNow = () =>
  useInvalidating((id: string) => milestonesApi.payNow(id), true);

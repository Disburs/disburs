"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rulesApi } from "../api";

export const RULES_KEY = ["rules"] as const;

export function useRules() {
  return useQuery({
    queryKey: RULES_KEY,
    queryFn: rulesApi.get,
    staleTime: 15_000,
  });
}
export function useUpdateRules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rulesApi.update,
    onSuccess: (data) => qc.setQueryData(RULES_KEY, data),
  });
}

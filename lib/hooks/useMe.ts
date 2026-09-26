"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activateWallets, getMe, onboardClient, onboardContractor, type Me } from "../api";

export const ME_KEY = ["me"] as const;

/** The signed-in user's profile; `null` data means there is no session. */
export function useMe() {
  return useQuery({ queryKey: ME_KEY, queryFn: getMe, staleTime: 15_000, retry: false });
}

/**
 * Gate a screen on the account's state. Redirects when there is no session,
 * or when the required profile is missing / already present. Returns the
 * profile once it is safe to render.
 */
export function useRequireProfile(opts: {
  need?: "organization" | "contractor";
  /** Where to send a signed-in user who lacks the needed profile. */
  onboarding?: string;
}) {
  const router = useRouter();
  const q = useMe();
  const me = q.data;
  const ready = !q.isPending;
  const missing = ready && me !== undefined && me !== null && opts.need && !me[opts.need];

  useEffect(() => {
    if (!ready) return;
    if (me === null) router.replace("/sign-in");
    else if (missing && opts.onboarding) router.replace(opts.onboarding);
  }, [ready, me, missing, opts.onboarding, router]);

  return { me: me ?? null, ready: ready && me !== null && !missing, refetch: q.refetch };
}

export function useOnboardClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: onboardClient,
    onSuccess: () => qc.invalidateQueries({ queryKey: ME_KEY }),
  });
}

export function useOnboardContractor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: onboardContractor,
    onSuccess: () => qc.invalidateQueries({ queryKey: ME_KEY }),
  });
}

export function useActivateWallets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: activateWallets,
    onSuccess: (me: Me) => qc.setQueryData(ME_KEY, me),
  });
}

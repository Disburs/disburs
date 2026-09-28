"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activateWallets, createOrganization, getMe, onboardClient, onboardContractor, updateOrganization, type Me } from "../api";
import { authClient } from "../auth-client";

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
  /**
   * Also require a display name. Invited teammates arrive with none; they are
   * sent to /welcome to add it and then come back here.
   */
  needName?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const q = useMe();
  const me = q.data;
  const ready = !q.isPending;
  const missing = ready && me !== undefined && me !== null && opts.need && !me[opts.need];
  const nameless = ready && !!me && !missing && !!opts.needName && !(me.user.name ?? "").trim();

  useEffect(() => {
    if (!ready) return;
    if (me === null) router.replace("/sign-in");
    else if (missing && opts.onboarding) router.replace(opts.onboarding);
    else if (nameless) router.replace(`/welcome?next=${encodeURIComponent(pathname || "/portal")}`);
  }, [ready, me, missing, nameless, opts.onboarding, pathname, router]);

  return { me: me ?? null, ready: ready && me !== null && !missing && !nameless, refetch: q.refetch };
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

/** Save the signed-in user's display name (Better Auth `updateUser`). */
export function useUpdateName() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await authClient.updateUser({ name });
      if (error) throw new Error(error.message ?? "Could not save your name.");
      return name;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ME_KEY }),
  });
}

/** Create another organization; it becomes the active one. */
export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => qc.invalidateQueries(),
  });
}

/** Edit the active organization's name, logo, country or team size (owner/admin). */
export function useUpdateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateOrganization,
    onSuccess: () => qc.invalidateQueries({ queryKey: ME_KEY }),
  });
}

/** Switch the session's active organization; every org-scoped query refetches. */
export function useSetActiveOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (organizationId: string) => {
      const { error } = await authClient.organization.setActive({ organizationId });
      if (error) throw new Error(error.message ?? "Could not switch organization.");
      return organizationId;
    },
    onSuccess: () => qc.invalidateQueries(),
  });
}

export function useActivateWallets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: activateWallets,
    onSuccess: (me: Me) => qc.setQueryData(ME_KEY, me),
  });
}

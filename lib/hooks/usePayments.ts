"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addContractor,
  addExternalPayee,
  externalPayeeUsage,
  fundWallet,
  listExternalPayees,
  removeExternalPayee,
  listContractors,
  listLedger,
  lookupContractor,
  payContractor,
  removeContractor,
} from "../api";
import { ME_KEY } from "./useMe";

export const LEDGER_KEY = ["ledger"] as const;

export function useLedger() {
  return useQuery({
    queryKey: LEDGER_KEY,
    queryFn: listLedger,
    staleTime: 10_000,
  });
}

export const CONTRACTORS_KEY = ["contractors"] as const;

/** Contractors the active organization works with (on a roster or paid before). */
export function useContractors() {
  return useQuery({
    queryKey: CONTRACTORS_KEY,
    queryFn: listContractors,
    staleTime: 10_000,
  });
}

export function useAddContractor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addContractor,
    onSuccess: () => qc.invalidateQueries({ queryKey: CONTRACTORS_KEY }),
  });
}
export function useRemoveContractor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeContractor,
    onSuccess: () => qc.invalidateQueries({ queryKey: CONTRACTORS_KEY }),
  });
}

export function useLookupContractor() {
  return useMutation({ mutationFn: lookupContractor });
}

/**
 * Look a contractor up as the email is typed. Runs only for a well-formed
 * email; a 404 is a normal answer ("nobody with that email"), so no retries.
 */
export function useContractorSearch(email: string) {
  const key = email.trim().toLowerCase();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key);
  return useQuery({
    queryKey: ["contractor-lookup", key],
    queryFn: () => lookupContractor(key),
    enabled: valid,
    retry: false,
    staleTime: 30_000,
  });
}

export function usePayContractor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: payContractor,
    onSettled: () => {
      qc.invalidateQueries({ queryKey: LEDGER_KEY });
      qc.invalidateQueries({ queryKey: ME_KEY });
      qc.invalidateQueries({ queryKey: CONTRACTORS_KEY });
    },
  });
}

export function useFundWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fundWallet,
    onSuccess: () => qc.invalidateQueries({ queryKey: ME_KEY }),
  });
}

export const EXTERNAL_PAYEES_KEY = ["external-payees"] as const;
export const EXTERNAL_PAYEE_USAGE_KEY = ["external-payees", "usage"] as const;

/** The address book: people paid at a Stellar address without a Disburs account. */
export function useExternalPayees() {
  return useQuery({
    queryKey: EXTERNAL_PAYEES_KEY,
    queryFn: listExternalPayees,
    staleTime: 10_000,
  });
}

export function useExternalPayeeUsage() {
  return useQuery({
    queryKey: EXTERNAL_PAYEE_USAGE_KEY,
    queryFn: externalPayeeUsage,
    staleTime: 10_000,
  });
}

export function useAddExternalPayee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addExternalPayee,
    onSuccess: () => qc.invalidateQueries({ queryKey: EXTERNAL_PAYEES_KEY }),
  });
}

export function useRemoveExternalPayee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeExternalPayee,
    onSuccess: () => qc.invalidateQueries({ queryKey: EXTERNAL_PAYEES_KEY }),
  });
}

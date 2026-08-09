import { useMutation } from "@tanstack/react-query";
import { onboardClient, onboardContractor } from "../api";

export function useOnboardClient() {
  return useMutation({ mutationFn: onboardClient });
}

export function useOnboardContractor() {
  return useMutation({ mutationFn: onboardContractor });
}

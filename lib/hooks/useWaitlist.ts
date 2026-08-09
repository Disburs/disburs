import { useMutation } from "@tanstack/react-query";
import { joinWaitlist } from "../api";

/** Join the waitlist. Returns the React Query mutation. */
export function useJoinWaitlist() {
  return useMutation({ mutationFn: joinWaitlist });
}

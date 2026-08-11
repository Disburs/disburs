import createClient from "openapi-fetch";
import type { paths, components } from "./api-types";

/**
 * Central API layer. Every backend call lives here (typed against the OpenAPI
 * spec); components consume these through the React Query hooks in lib/hooks.
 * The /api prefix is part of each path in the spec, so it's not in baseUrl.
 */
const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const client = createClient<paths>({ baseUrl });

/** Turn an openapi-fetch error body into an Error with a readable message. */
function toError(error: unknown): Error {
  const raw =
    typeof error === "object" && error && "message" in error
      ? (error as { message?: unknown }).message
      : undefined;
  const text = Array.isArray(raw)
    ? raw.join(", ")
    : raw
      ? String(raw)
      : "Something went wrong. Please try again.";
  return new Error(text);
}

/* ------------------------------ Waitlist ------------------------------ */
export type AccountType = components["schemas"]["AccountType"];
export type JoinWaitlistBody = components["schemas"]["JoinWaitlistDto"];
export interface JoinWaitlistResult {
  alreadyJoined: boolean;
  message: string;
  entry: { id: string; email: string; type: AccountType; createdAt: string };
}

export async function joinWaitlist(body: JoinWaitlistBody): Promise<JoinWaitlistResult> {
  const { data, error } = await client.POST("/api/waitlist", { body });
  if (error) throw toError(error);
  return data as unknown as JoinWaitlistResult;
}

/* ----------------------------- Onboarding ----------------------------- */
export type OnboardClientBody = components["schemas"]["OnboardClientDto"];
export async function onboardClient(body: OnboardClientBody) {
  const { data, error } = await client.POST("/api/onboarding/client", { body });
  if (error) throw toError(error);
  return data;
}

export type OnboardContractorBody = components["schemas"]["OnboardContractorDto"];
export async function onboardContractor(body: OnboardContractorBody) {
  const { data, error } = await client.POST("/api/onboarding/contractor", { body });
  if (error) throw toError(error);
  return data;
}

import createClient from "openapi-fetch";
import type { paths, components } from "./api-types";

/**
 * Central API layer. Every backend call lives here (typed against the OpenAPI
 * spec); components consume these through the React Query hooks in lib/hooks.
 * The /api prefix is part of each path in the spec, so it's not in baseUrl.
 *
 * NEXT_PUBLIC_API_URL unset means same origin: `/api/*` on this app is
 * proxied to the backend (next.config.mjs, API_PROXY_TARGET), which keeps the
 * session cookie first-party. Set it only to talk to the API directly.
 */
const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

// Sessions are httpOnly cookies set by the backend, so requests must carry credentials.
export const client = createClient<paths>({ baseUrl, credentials: "include" });

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

export async function joinWaitlist(
  body: JoinWaitlistBody,
): Promise<JoinWaitlistResult> {
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

export type OnboardContractorBody =
  components["schemas"]["OnboardContractorDto"];
export async function onboardContractor(body: OnboardContractorBody) {
  const { data, error } = await client.POST("/api/onboarding/contractor", {
    body,
  });
  if (error) throw toError(error);
  return data;
}

/* -------------------------------- Me ---------------------------------- */
/** The signed-in user with their org / contractor profile and wallet state. */
export type OrgRole = "owner" | "admin" | "member";
export const MONEY_ROLES: OrgRole[] = ["owner", "admin"];

export interface WalletState {
  publicKey: string;
  isActivated: boolean;
  balances?: { xlm?: string; usdc?: string } | null;
  /** When the reconciler last compared this wallet with the chain. */
  reconciledAt?: string | null;
}
export interface Me {
  user: { id: string; email: string; name: string | null; role: string };
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    country: string | null;
    teamSize: number | null;
    /** The caller's role in the active organization. */
    role: OrgRole | null;
    /** The organization's own payroll contract on Soroban, once deployed. */
    payrollContractId?: string | null;
    treasuryWallet: WalletState | null;
  } | null;
  /** Every organization the caller belongs to (for the switcher). */
  organizations: {
    id: string;
    name: string;
    logo: string | null;
    role: OrgRole;
  }[];
  contractor: {
    id: string;
    name: string;
    country: string;
    payoutCurrency: string;
    type: "INDIVIDUAL" | "BUSINESS";
    wallet: WalletState | null;
  } | null;
  network: string;
  canMint: boolean;
  activationErrors?: string[];
  /** Operator settings the product reflects in its copy. */
  settings?: { archiveRetentionDays: number };
  /** Product features staff can switch off in the admin console. Missing = on. */
  features?: Partial<Record<Feature, boolean>>;
}

export type Feature =
  "payroll" | "oneOffPay" | "cashouts" | "clientSignup" | "testnetFunding";

export async function getMe(): Promise<Me | null> {
  const { data, error, response } = await client.GET("/api/me");
  if (response.status === 401) return null;
  if (error) throw toError(error);
  return data as unknown as Me;
}

/** Retry on-chain activation for the signed-in user's wallet(s). Idempotent. */
export async function activateWallets(): Promise<Me> {
  const { data, error } = await client.POST("/api/me/activate");
  if (error) throw toError(error);
  return data as unknown as Me;
}

/* --------------------------- Auth providers ---------------------------- */
export type SocialProvider = "google";
export interface AuthProviders {
  magicLink: boolean;
  social: SocialProvider[];
}

/** Which sign-in methods the backend has configured. Public. */
export async function getAuthProviders(): Promise<AuthProviders> {
  const { data, error } = await client.GET("/api/auth-providers");
  if (error) throw toError(error);
  return data as unknown as AuthProviders;
}

/* ------------------------------ Payments ------------------------------ */
export type LedgerStatus = "PENDING" | "SETTLED" | "FAILED";
export interface LedgerEntry {
  id: string;
  /** FUND entries are deposits the reconciler recorded from the chain. */
  type: "PAYOUT" | "SEND" | "FUND";
  status: LedgerStatus;
  amount: string;
  assetCode: string;
  source: string | null;
  destination: string | null;
  memo: string | null;
  txHash: string | null;
  error: string | null;
  /** Set once the reconciler confirmed this entry against the chain. */
  reconciledAt: string | null;
  userId: string | null;
  organizationId: string | null;
  contractorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function listLedger(): Promise<LedgerEntry[]> {
  const { data, error } = await client.GET("/api/payments");
  if (error) throw toError(error);
  return (data ?? []) as unknown as LedgerEntry[];
}

export interface ContractorLookup {
  id: string;
  name: string;
  country: string;
  payoutCurrency: string;
  type: "INDIVIDUAL" | "BUSINESS";
  walletActivated: boolean;
}

/** A contractor the active organization works with, as listed on /portal/contractors. */
export interface OrgContractor {
  id: string;
  name: string;
  email: string;
  country: string;
  payoutCurrency: string;
  type: "INDIVIDUAL" | "BUSINESS";
  createdAt: string;
  wallet: { publicKey: string; isActivated: boolean } | null;
  payrolls: { id: string; name: string; amount: string; active: boolean }[];
  lastPaidAt: string | null;
  lastTxHash: string | null;
  totalPaid: string;
  paymentCount: number;
  /** Settled payments the reconciler has confirmed on chain. */
  confirmedCount: number;
}

export async function listContractors(): Promise<OrgContractor[]> {
  const { data, error } = await client.GET("/api/contractors");
  if (error) throw toError(error);
  return (data ?? []) as unknown as OrgContractor[];
}

export async function lookupContractor(
  email: string,
): Promise<ContractorLookup> {
  const { data, error } = await client.GET("/api/contractors/lookup", {
    params: { query: { email } },
  });
  if (error) throw toError(error);
  return data as unknown as ContractorLookup;
}

export type PayContractorBody = components["schemas"]["PayContractorDto"];
export async function payContractor(
  body: PayContractorBody,
): Promise<LedgerEntry> {
  const { data, error } = await client.POST("/api/payments/pay", { body });
  if (error) throw toError(error);
  return data as unknown as LedgerEntry;
}

export type FundBody = components["schemas"]["FundDto"];
export async function fundWallet(body: FundBody) {
  const { data, error } = await client.POST("/api/me/fund", { body });
  if (error) throw toError(error);
  return data;
}

/** Explorer link for a transaction or account on the configured network. */
export function explorerUrl(
  network: string,
  kind: "tx" | "account" | "contract",
  id: string,
) {
  const net = network === "mainnet" ? "public" : "testnet";
  return `https://stellar.expert/explorer/${net}/${kind}/${id}`;
}

/* ------------------------------- Uploads ------------------------------ */
export type UploadKind = "org-logo" | "avatar";
export interface UploadSignature {
  cloudName: string;
  apiKey: string;
  uploadUrl: string;
  fields: Record<string, string | number>;
}

export async function getUploadConfig(): Promise<{ enabled: boolean }> {
  const { data, error } = await client.GET("/api/uploads/config");
  if (error) throw toError(error);
  return data as unknown as { enabled: boolean };
}

export async function signUpload(kind: UploadKind): Promise<UploadSignature> {
  const { data, error } = await client.POST("/api/uploads/sign", {
    body: { kind },
  });
  if (error) throw toError(error);
  return data as unknown as UploadSignature;
}

/* ---------------------------- Organizations --------------------------- */
export type CreateOrganizationBody =
  components["schemas"]["CreateOrganizationDto"];
export async function createOrganization(body: CreateOrganizationBody) {
  const { data, error } = await client.POST("/api/organizations", { body });
  if (error) throw toError(error);
  return data as unknown as {
    role: OrgRole;
    organization: { id: string; name: string };
  };
}

export type UpdateOrganizationBody =
  components["schemas"]["UpdateOrganizationDto"];
/** Edit the active organization's profile (owner/admin). */
export async function updateOrganization(body: UpdateOrganizationBody) {
  const { data, error } = await client.PATCH("/api/organizations/current", {
    body,
  });
  if (error) throw toError(error);
  return data;
}

/* ------------------------------- Payroll ------------------------------ */
export type PayrollCadence = "MONTHLY" | "BIWEEKLY" | "WEEKLY" | "MANUAL";
export type RunStatus =
  "DRAFT" | "APPROVED" | "EXECUTING" | "SETTLED" | "PARTIAL" | "FAILED";
export type LineStatus = "PENDING" | "SETTLED" | "FAILED";

export interface PayrollItem {
  id: string;
  contractorId: string;
  amount: string;
  note: string | null;
  active: boolean;
  createdAt: string;
  contractor?: { id: string; name: string; email: string };
}
export interface PayrollDefinition {
  id: string;
  organizationId: string;
  name: string;
  cadence: PayrollCadence;
  memo: string | null;
  /** Set while archived; restorable until `purgeAt`, then deleted for good. */
  archivedAt: string | null;
  purgeAt: string | null;
  createdAt: string;
  items: PayrollItem[];
}
export interface RunLine {
  id: string;
  contractorId: string;
  payeeName: string;
  destination: string;
  amount: string;
  status: LineStatus;
  txHash: string | null;
  error: string | null;
  attempts: number;
  reconciledAt: string | null;
}
export interface PayrollRun {
  id: string;
  label: string;
  memo: string | null;
  status: RunStatus;
  totalAmount: string;
  lineCount: number;
  definitionId: string | null;
  approvedAt: string | null;
  executedAt: string | null;
  createdAt: string;
  lines: RunLine[];
}

const unwrap = <T>(r: { data?: unknown; error?: unknown }): T => {
  if (r.error) throw toError(r.error);
  return r.data as T;
};

export const payrollApi = {
  definitions: (archived = false) =>
    client
      .GET("/api/payroll/definitions", { params: { query: { archived } } })
      .then((r) => unwrap<PayrollDefinition[]>(r)),
  archiveDefinition: (id: string) =>
    client
      .POST("/api/payroll/definitions/{id}/archive", {
        params: { path: { id } },
      })
      .then((r) => unwrap<PayrollDefinition>(r)),
  restoreDefinition: (id: string) =>
    client
      .POST("/api/payroll/definitions/{id}/restore", {
        params: { path: { id } },
      })
      .then((r) => unwrap<PayrollDefinition>(r)),
  sendDeleteCode: (id: string) =>
    client
      .POST("/api/payroll/definitions/{id}/delete-code", {
        params: { path: { id } },
      })
      .then((r) =>
        unwrap<{
          sentTo: string;
          expiresAt: string;
          minutes: number;
          code?: string;
        }>(r),
      ),
  checkDeleteCode: (id: string, code: string) =>
    client
      .POST("/api/payroll/definitions/{id}/delete-code/check", {
        params: { path: { id } },
        body: { code },
      })
      .then((r) => unwrap<{ valid: boolean }>(r)),
  createDefinition: (body: components["schemas"]["CreateDefinitionDto"]) =>
    client
      .POST("/api/payroll/definitions", { body })
      .then((r) => unwrap<PayrollDefinition>(r)),
  updateDefinition: (
    id: string,
    body: components["schemas"]["UpdateDefinitionDto"],
  ) =>
    client
      .PATCH("/api/payroll/definitions/{id}", {
        params: { path: { id } },
        body,
      })
      .then((r) => unwrap<PayrollDefinition>(r)),
  deleteDefinition: (id: string, code: string) =>
    client
      .DELETE("/api/payroll/definitions/{id}", {
        params: { path: { id } },
        body: { code },
      })
      .then((r) => unwrap<{ deleted: boolean }>(r)),
  upsertItem: (id: string, body: components["schemas"]["UpsertItemDto"]) =>
    client
      .POST("/api/payroll/definitions/{id}/items", {
        params: { path: { id } },
        body,
      })
      .then((r) => unwrap<PayrollItem>(r)),
  removeItem: (id: string, itemId: string) =>
    client
      .DELETE("/api/payroll/definitions/{id}/items/{itemId}", {
        params: { path: { id, itemId } },
      })
      .then((r) => unwrap<{ deleted: boolean }>(r)),
  runs: () =>
    client.GET("/api/payroll/runs").then((r) => unwrap<PayrollRun[]>(r)),
  run: (id: string) =>
    client
      .GET("/api/payroll/runs/{id}", { params: { path: { id } } })
      .then((r) => unwrap<PayrollRun>(r)),
  createRun: (body: components["schemas"]["CreateRunDto"]) =>
    client
      .POST("/api/payroll/runs", { body })
      .then((r) => unwrap<PayrollRun>(r)),
  discard: (id: string) =>
    client
      .DELETE("/api/payroll/runs/{id}", { params: { path: { id } } })
      .then((r) => unwrap<{ deleted: boolean }>(r)),
  approve: (id: string) =>
    client
      .POST("/api/payroll/runs/{id}/approve", { params: { path: { id } } })
      .then((r) => unwrap<PayrollRun>(r)),
  execute: (id: string) =>
    client
      .POST("/api/payroll/runs/{id}/execute", { params: { path: { id } } })
      .then((r) => unwrap<PayrollRun>(r)),
};

/* ---------------------------- Reconciliation --------------------------- */
export type DiscrepancyKind =
  "UNRECORDED_OUTFLOW" | "MISSING_ON_CHAIN" | "RECOVERED" | "TIMED_OUT";
export interface Discrepancy {
  id: string;
  kind: DiscrepancyKind;
  ledgerEntryId: string | null;
  txHash: string | null;
  source: string | null;
  destination: string | null;
  amount: string | null;
  note: string;
  resolvedAt: string | null;
  createdAt: string;
}
export interface ReconciliationStatus {
  treasury: {
    publicKey: string;
    reconciledAt: string | null;
    scanned: boolean;
  } | null;
  discrepancies: Discrepancy[];
}
export interface ReconciliationRun extends ReconciliationStatus {
  summary: {
    scanned: number;
    matched: number;
    recovered: number;
    recorded: number;
    flagged: number;
  };
  sweep: { timedOut: number; missing: number };
}

export const reconciliationApi = {
  status: () =>
    client
      .GET("/api/reconciliation/status")
      .then((r) => unwrap<ReconciliationStatus>(r)),
  run: () =>
    client
      .POST("/api/reconciliation/run")
      .then((r) => unwrap<ReconciliationRun>(r)),
  resolve: (id: string) =>
    client
      .POST("/api/reconciliation/discrepancies/{id}/resolve", {
        params: { path: { id } },
      })
      .then((r) => unwrap<{ resolved: boolean }>(r)),
};

/* ------------------------------- Cash-outs ----------------------------- */
export type CashoutStatus = "REQUESTED" | "CANCELLED" | "PAID";
export interface CashoutRequest {
  id: string;
  contractorId: string;
  amount: string;
  currency: string;
  destination: string;
  note: string | null;
  status: CashoutStatus;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
export type CreateCashoutBody = components["schemas"]["CreateCashoutDto"];

export const cashoutsApi = {
  list: () =>
    client.GET("/api/cashouts").then((r) => unwrap<CashoutRequest[]>(r)),
  create: (body: CreateCashoutBody) =>
    client
      .POST("/api/cashouts", { body })
      .then((r) => unwrap<CashoutRequest>(r)),
  cancel: (id: string) =>
    client
      .POST("/api/cashouts/{id}/cancel", { params: { path: { id } } })
      .then((r) => unwrap<CashoutRequest>(r)),
};

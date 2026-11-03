/**
 * A money action needs a fresh code. The API client asks for one here, and
 * the ConfirmationDialog (mounted once in Providers) answers. Kept outside
 * React so plain fetch code can await a person.
 */
export type ConfirmationMethod = "totp" | "email";

export interface ConfirmationRequest {
  method: ConfirmationMethod;
  /** Set when the previous attempt was refused. */
  error?: string;
}

type Asker = (req: ConfirmationRequest) => Promise<string | null>;

let asker: Asker | null = null;

/** Called by the dialog when it mounts. */
export function setConfirmationAsker(fn: Asker | null) {
  asker = fn;
}

/** Resolves to the code the person typed, or null if they cancelled. */
export function requestConfirmation(
  req: ConfirmationRequest,
): Promise<string | null> {
  if (!asker) return Promise.resolve(null);
  return asker(req);
}

export const CONFIRMATION_HEADER = "x-confirmation-code";

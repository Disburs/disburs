"use client";

import { PageTitle } from "@/components/portal/ui";
import AuthenticatorSetup from "@/components/two-factor/AuthenticatorSetup";

/** The contractor's authenticator app: protects cash-outs and sign-in. */
export default function ContractorSecurityPage() {
  return (
    <div className="flex max-w-[760px] flex-col gap-5">
      <PageTitle sub="Codes from an authenticator app protect your cash-outs and your sign-in.">
        Security
      </PageTitle>
      <AuthenticatorSetup />
    </div>
  );
}

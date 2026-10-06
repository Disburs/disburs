"use client";

import { PageTitle } from "@/components/portal/ui";
import AuthenticatorSetup from "@/components/two-factor/AuthenticatorSetup";

/** Settings → Security: the authenticator app for your own sign-in and payments. */
export default function SecurityPage() {
  return (
    <div className="flex max-w-[760px] flex-col gap-5">
      <PageTitle sub="Codes from an authenticator app protect your payments and your sign-in. This is about your own account, not the whole organization.">
        Security
      </PageTitle>
      <AuthenticatorSetup />
    </div>
  );
}

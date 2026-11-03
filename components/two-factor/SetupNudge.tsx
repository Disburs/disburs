"use client";

import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMe } from "@/lib/hooks/useMe";
import { MONEY_ROLES } from "@/lib/api";

/**
 * Shown to people who move money (owners, admins, contractors) until they set
 * up an authenticator app. Members who only view are not asked.
 */
export default function SetupNudge({ href }: { href: string }) {
  const { data: me } = useMe();
  if (!me || me.twoFactor?.enabled !== false) return null;
  const movesMoney = me.contractor
    ? true
    : Boolean(
        me.organization?.role && MONEY_ROLES.includes(me.organization.role),
      );
  if (!movesMoney) return null;
  return (
    <div
      role="status"
      className="flex flex-col gap-4 rounded-[20px] border border-line bg-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <KeyRound size={18} className="mt-0.5 shrink-0 text-muted" />
        <div>
          <div className="text-[15px] font-medium text-ink">
            Set up your authenticator app
          </div>
          <div className="mt-0.5 text-[14px] text-muted">
            Payments then ask for a code from the app instead of one emailed to
            you. It takes a minute.
          </div>
        </div>
      </div>
      <Button asChild className="shrink-0">
        <Link href={href}>Set up</Link>
      </Button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Card, Field, PageTitle, inputClass } from "@/components/portal/ui";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/upload/ImageUpload";
import {
  useCreateOrganization,
  useFeature,
  useOrgAllowance,
} from "@/lib/hooks/useMe";
import { usdc } from "@/lib/format";
import FeaturePaused from "@/components/FeaturePaused";

const COUNTRIES = [
  "Kenya",
  "Ghana",
  "South Africa",
  "Nigeria",
  "United Kingdom",
  "United States",
  "Other",
];

/** Create another organization. It gets its own treasury and becomes the active one. */
export default function NewOrganizationPage() {
  const router = useRouter();
  const create = useCreateOrganization();
  const signupOn = useFeature("clientSignup");
  const allowance = useOrgAllowance().data;
  const [name, setName] = useState("");
  const [country, setCountry] = useState("Kenya");
  const [teamSize, setTeamSize] = useState("");
  const [logo, setLogo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || create.isPending) return;
    const res = await create
      .mutateAsync({
        name: name.trim(),
        country,
        ...(teamSize ? { teamSize: Number(teamSize) } : {}),
        ...(logo ? { logo } : {}),
      })
      .catch(() => null);
    if (res) router.push("/portal/wallet");
  };

  return (
    <div className="mx-auto max-w-[680px]">
      <PageTitle sub="A separate treasury, roster and team. You become its owner and it becomes your active organization.">
        New organization
      </PageTitle>
      {!signupOn ? (
        <FeaturePaused title="New organizations are paused">
          Disburs has paused setting up new organizations for now. Your existing
          organizations are not affected.
        </FeaturePaused>
      ) : allowance && !allowance.canCreate ? (
        <Card>
          <div className="text-[17px] font-medium text-ink">
            {allowance.reason === "unlock"
              ? "A second organization unlocks with use"
              : "Your account is at its limit"}
          </div>
          <p className="mt-2 text-[14.5px] leading-[1.55] text-muted">
            {allowance.reason === "unlock"
              ? `Once ${allowance.leader?.name ?? "your organization"} has paid out $${usdc(allowance.unlockUsdc)} USDC in total, you can open another organization here. It has paid out $${usdc(allowance.paidOutUsdc)} so far.`
              : `Accounts may create ${allowance.limit} ${allowance.limit === 1 ? "organization" : "organizations"}. If you run more entities, contact Disburs and we will raise it for you.`}
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/portal">Back to the dashboard</Link>
          </Button>
        </Card>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-5">
          <Card>
            <div className="mb-5">
              <span className="mb-2 block text-[14px] font-medium text-ink">
                Logo
              </span>
              <ImageUpload
                kind="org-logo"
                value={logo}
                onChange={setLogo}
                label="Upload logo"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Organization name">
                  <input
                    className={inputClass}
                    required
                    maxLength={120}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Acme Studio"
                    autoFocus
                  />
                </Field>
              </div>
              <Field label="Country">
                <select
                  className={inputClass}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Team size" hint="Optional.">
                <input
                  className={inputClass}
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  placeholder="8"
                />
              </Field>
            </div>
          </Card>
          {create.isError && (
            <p className="text-[14px] text-[#A32D1C]">
              {(create.error as Error).message}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button asChild variant="outline">
              <Link href="/portal">Cancel</Link>
            </Button>
            <Button type="submit" disabled={!name.trim() || create.isPending}>
              {create.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Creating…
                </>
              ) : (
                <>
                  Create organization <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

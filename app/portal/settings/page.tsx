"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import {
  Button,
  Card,
  Field,
  PageTitle,
  SectionHeading,
  inputClass,
} from "@/components/portal/ui";
import ImageUpload from "@/components/upload/ImageUpload";
import { useMe, useUpdateName, useUpdateOrganization } from "@/lib/hooks/useMe";
import { MONEY_ROLES, type Me } from "@/lib/api";
import { joinName, splitName } from "@/lib/name";
import { shortKey } from "@/lib/format";

const COUNTRIES = [
  "Kenya",
  "Ghana",
  "South Africa",
  "Nigeria",
  "United Kingdom",
  "United States",
  "Other",
];

function Saved({ show }: { show: boolean }) {
  return show ? (
    <span className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent">
      <Check size={14} /> Saved
    </span>
  ) : null;
}

type Org = NonNullable<Me["organization"]>;

/** Organization profile. Editable by owners and admins, read-only for members. */
function OrgForm({ org, saved, onSaved }: { org: Org; saved: boolean; onSaved: () => void }) {
  const canManage = Boolean(org.role && MONEY_ROLES.includes(org.role));
  const updateOrg = useUpdateOrganization();
  const [name, setName] = useState(org.name);
  const [country, setCountry] = useState(org.country ?? "");
  const [teamSize, setTeamSize] = useState(
    org.teamSize ? String(org.teamSize) : "",
  );
  const [logo, setLogo] = useState<string | null>(org.logo);

  const orgDirty =
    name.trim() !== org.name ||
    (country || "") !== (org.country ?? "") ||
    (teamSize ? Number(teamSize) : null) !== org.teamSize ||
    logo !== org.logo;

  const saveOrg = () => {
    if (!name.trim()) return;
    updateOrg.mutate(
      {
        name: name.trim(),
        ...(country ? { country } : {}),
        ...(teamSize ? { teamSize: Number(teamSize) } : {}),
        ...(logo ? { logo } : {}),
      },
      {
        onSuccess: onSaved,
      },
    );
  };

  return (
    <Card>
      <SectionHeading title="Organization" action={<Saved show={saved} />} />
      {!canManage && (
        <p className="mb-4 text-[13.5px] text-muted">
          Only owners and admins can edit the organization. You can view it
          here.
        </p>
      )}
      <div className="mb-5">
        <ImageUpload
          kind="org-logo"
          value={logo}
          onChange={setLogo}
          label="Upload logo"
          disabled={!canManage}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Company name">
            <input
              className={inputClass}
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!canManage}
            />
          </Field>
        </div>
        <Field label="Country">
          <select
            className={inputClass}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={!canManage}
          >
            <option value="">Not set</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Team size">
          <input
            className={inputClass}
            type="number"
            min={1}
            inputMode="numeric"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            disabled={!canManage}
          />
        </Field>
      </div>
      {canManage && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            variant="ink"
            onClick={saveOrg}
            disabled={!orgDirty || !name.trim() || updateOrg.isPending}
          >
            {updateOrg.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : null}{" "}
            Save organization
          </Button>
          {updateOrg.isError && (
            <span className="text-[13.5px] text-[#A32D1C]">
              {(updateOrg.error as Error).message}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}

/** The signed-in user's own name; email and role are shown read-only. */
function YouForm({ me }: { me: Me }) {
  const updateName = useUpdateName();
  const initial = splitName(me.user.name);
  const [first, setFirst] = useState(initial.first);
  const [last, setLast] = useState(initial.last);
  const [nameSaved, setNameSaved] = useState(false);

  const nameDirty = joinName(first, last) !== (me.user.name ?? "");

  const saveName = () => {
    if (!first.trim()) return;
    updateName.mutate(joinName(first, last), {
      onSuccess: () => {
        setNameSaved(true);
        window.setTimeout(() => setNameSaved(false), 2000);
      },
    });
  };

  return (
    <Card>
      <SectionHeading title="You" action={<Saved show={nameSaved} />} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name">
          <input
            className={inputClass}
            required
            maxLength={60}
            value={first}
            onChange={(e) => setFirst(e.target.value)}
          />
        </Field>
        <Field label="Last name">
          <input
            className={inputClass}
            maxLength={60}
            value={last}
            onChange={(e) => setLast(e.target.value)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Email" hint="Sign-in email. It cannot be changed here.">
            <input
              className={inputClass}
              value={me.user.email}
              disabled
              readOnly
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Role in this organization">
            <input
              className={inputClass}
              value={me.organization?.role ?? ""}
              disabled
              readOnly
            />
          </Field>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          variant="ink"
          onClick={saveName}
          disabled={!nameDirty || !first.trim() || updateName.isPending}
        >
          {updateName.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : null}{" "}
          Save your details
        </Button>
        {updateName.isError && (
          <span className="text-[13.5px] text-[#A32D1C]">
            {(updateName.error as Error).message}
          </span>
        )}
      </div>
    </Card>
  );
}

/** Organization profile (owner/admin), treasury facts, and the signed-in user's own details. */
export default function SettingsPage() {
  const { data: me } = useMe();
  const org = me?.organization ?? null;
  // Lives here, not in the form, because a save reseeds (remounts) the form.
  const [orgSaved, setOrgSaved] = useState(false);
  const flagSaved = () => {
    setOrgSaved(true);
    window.setTimeout(() => setOrgSaved(false), 2000);
  };

  return (
    <div className="mx-auto flex max-w-[820px] flex-col gap-5">
      <PageTitle sub="Your organization's profile and your own details.">
        Settings
      </PageTitle>

      {/* Keyed on the server values so a save (or an org switch) reseeds the form. */}
      {org && (
        <OrgForm
          key={`${org.id}:${org.name}:${org.country}:${org.teamSize}:${org.logo}`}
          org={org}
          saved={orgSaved}
          onSaved={flagSaved}
        />
      )}

      <Card>
        <SectionHeading title="Treasury" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="text-[13px] text-muted">Wallet</div>
            <div className="mt-1 font-mono text-[14px] text-ink">
              {org?.treasuryWallet
                ? shortKey(org.treasuryWallet.publicKey, 8, 8)
                : "—"}
            </div>
          </div>
          <div>
            <div className="text-[13px] text-muted">Network</div>
            <div className="mt-1 text-[14px] text-ink">
              Stellar {me?.network ?? "testnet"} ·{" "}
              {org?.treasuryWallet?.isActivated ? "activated" : "not activated"}
            </div>
          </div>
        </div>
        <p className="mt-4 text-[13.5px] text-muted">
          Fund it, mint test USDC, and see every outgoing payment on the Wallet
          page.
        </p>
      </Card>

      {me && <YouForm key={me.user.name ?? ""} me={me} />}
    </div>
  );
}

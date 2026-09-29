"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, Trash2, X } from "lucide-react";
import { Avatar, Badge, Button, Card, Field, PageTitle, inputClass } from "@/components/portal/ui";
import { authClient } from "@/lib/auth-client";
import { useMe } from "@/lib/hooks/useMe";
import { MONEY_ROLES, type OrgRole } from "@/lib/api";
import { when } from "@/lib/format";

const ROLES: { value: OrgRole; label: string; desc: string }[] = [
  { value: "admin", label: "Admin", desc: "Can fund, pay, and manage the team." },
  { value: "member", label: "Member", desc: "Can view balances and history." },
];

const initials = (s: string) =>
  s
    .split(/[\s@]+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

type Member = { id: string; role: string; createdAt: string | Date; user: { id: string; name: string; email: string; image?: string | null } };
type Invitation = { id: string; email: string; role: string; status: string; expiresAt: string | Date };

/**
 * The organization's people: members with roles, pending invitations, and an
 * invite form. Owners and admins manage; members only see the list. The
 * backend and Better Auth enforce every action server-side.
 */
export default function TeamPage() {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const org = me?.organization;
  const orgId = org?.id;
  const canManage = Boolean(org?.role && MONEY_ROLES.includes(org.role));

  const members = useQuery({
    queryKey: ["org-members", orgId],
    enabled: Boolean(orgId),
    queryFn: async () => {
      const { data, error } = await authClient.organization.listMembers({ query: { organizationId: orgId!, limit: 100 } });
      if (error) throw new Error(error.message ?? "Could not load members.");
      return (data?.members ?? []) as unknown as Member[];
    },
  });
  const invitations = useQuery({
    queryKey: ["org-invitations", orgId],
    enabled: Boolean(orgId),
    queryFn: async () => {
      const { data, error } = await authClient.organization.listInvitations({ query: { organizationId: orgId! } });
      if (error) throw new Error(error.message ?? "Could not load invitations.");
      return ((data ?? []) as unknown as Invitation[]).filter((i) => i.status === "pending");
    },
  });
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["org-members", orgId] });
    qc.invalidateQueries({ queryKey: ["org-invitations", orgId] });
  };

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrgRole>("member");
  const invite = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.organization.inviteMember({ email: email.trim(), role, organizationId: orgId! });
      if (error) throw new Error(error.message ?? "Could not send the invitation.");
    },
    onSuccess: () => {
      setEmail("");
      refresh();
    },
  });
  const cancel = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await authClient.organization.cancelInvitation({ invitationId });
      if (error) throw new Error(error.message ?? "Could not cancel.");
    },
    onSuccess: refresh,
  });
  const changeRole = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: OrgRole }) => {
      const { error } = await authClient.organization.updateMemberRole({ memberId, role, organizationId: orgId! });
      if (error) throw new Error(error.message ?? "Could not change the role.");
    },
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: async (memberIdOrEmail: string) => {
      const { error } = await authClient.organization.removeMember({ memberIdOrEmail, organizationId: orgId! });
      if (error) throw new Error(error.message ?? "Could not remove the member.");
    },
    onSuccess: refresh,
  });

  return (
    <div className="flex flex-col gap-5">
      <PageTitle sub={org ? <>People who can act for <b className="font-medium text-ink">{org.name}</b>. Roles are enforced on every request.</> : null}>Team</PageTitle>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card padding={0}>
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h3 className="text-[16px] font-medium text-ink">Members</h3>
              <span className="text-[13px] text-muted">{members.data?.length ?? "—"}</span>
            </div>
            {members.isPending ? (
              <div className="px-6 py-6 text-[14px] text-muted">Loading…</div>
            ) : members.isError ? (
              <div className="px-6 py-6 text-[14px] text-[#A32D1C]">{(members.error as Error).message}</div>
            ) : (
              <ul className="divide-y divide-line">
                {members.data?.map((m) => {
                  const isYou = m.user.id === me?.user.id;
                  const isOwner = m.role === "owner";
                  return (
                    <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar initials={initials(m.user.name || m.user.email)} size={36} src={m.user.image} />
                        <div className="min-w-0">
                          <div className="truncate text-[14.5px] text-ink">
                            {m.user.name || m.user.email}
                            {isYou && <span className="ml-2 text-[12.5px] text-muted">you</span>}
                          </div>
                          <div className="truncate text-[13px] text-muted">{m.user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {canManage && !isOwner && !isYou ? (
                          <select
                            className="h-9 rounded-none border border-line bg-canvas px-3 text-[13.5px] text-ink focus:border-ink focus:outline-none"
                            value={m.role}
                            disabled={changeRole.isPending}
                            onChange={(e) => changeRole.mutate({ memberId: m.id, role: e.target.value as OrgRole })}
                          >
                            {ROLES.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <Badge variant={isOwner ? "success" : "neutral"}>{m.role}</Badge>
                        )}
                        {canManage && !isOwner && !isYou && (
                          <button type="button" aria-label={`Remove ${m.user.email}`} onClick={() => remove.mutate(m.id)} disabled={remove.isPending} className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:text-[#A32D1C]">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {(changeRole.isError || remove.isError) && (
              <div className="border-t border-line px-6 py-3 text-[13.5px] text-[#A32D1C]">{((changeRole.error ?? remove.error) as Error).message}</div>
            )}
          </Card>

          <Card padding={0}>
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h3 className="text-[16px] font-medium text-ink">Pending invitations</h3>
              <span className="text-[13px] text-muted">{invitations.data?.length ?? "—"}</span>
            </div>
            {invitations.isPending ? (
              <div className="px-6 py-6 text-[14px] text-muted">Loading…</div>
            ) : invitations.data?.length === 0 ? (
              <div className="px-6 py-6 text-[14px] text-muted">No open invitations.</div>
            ) : (
              <ul className="divide-y divide-line">
                {invitations.data?.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-subtle text-muted">
                        <Mail size={15} />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-[14.5px] text-ink">{i.email}</div>
                        <div className="text-[13px] text-muted">Expires {when(i.expiresAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="neutral">{i.role}</Badge>
                      {canManage && (
                        <button type="button" aria-label={`Cancel invitation to ${i.email}`} onClick={() => cancel.mutate(i.id)} disabled={cancel.isPending} className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:text-ink">
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div>
          {canManage ? (
            <Card>
              <h3 className="text-[16px] font-medium text-ink">Invite a teammate</h3>
              <p className="mt-1 text-[14px] leading-[1.5] text-muted">They get an email with a link. It expires in 7 days.</p>
              <form
                className="mt-5 flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) invite.mutate();
                }}
              >
                <Field label="Email">
                  <input type="email" required className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="finance@company.com" />
                </Field>
                <fieldset>
                  <legend className="mb-2 text-[14px] font-medium text-ink">Role</legend>
                  <div className="flex flex-col gap-2">
                    {ROLES.map((r) => (
                      <label key={r.value} className={`flex cursor-pointer items-start gap-3 rounded-[16px] border p-3 ${role === r.value ? "border-ink bg-subtle" : "border-line"}`}>
                        <input type="radio" name="role" className="mt-1 accent-ink" checked={role === r.value} onChange={() => setRole(r.value)} />
                        <span>
                          <span className="block text-[14px] font-medium text-ink">{r.label}</span>
                          <span className="block text-[13px] text-muted">{r.desc}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {invite.isError && <p className="text-[13.5px] text-[#A32D1C]">{(invite.error as Error).message}</p>}
                {invite.isSuccess && <p className="text-[13.5px] text-accent">Invitation sent.</p>}
                <Button type="submit" disabled={!email.trim() || invite.isPending} full>
                  {invite.isPending ? <Loader2 size={15} className="animate-spin" /> : null} Send invitation
                </Button>
              </form>
            </Card>
          ) : (
            <Card tone="subtle">
              <h3 className="text-[16px] font-medium text-ink">Your role: {org?.role}</h3>
              <p className="mt-1 text-[14px] leading-[1.5] text-muted">Members can view the treasury and history. Ask an owner or admin to change roles or invite people.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

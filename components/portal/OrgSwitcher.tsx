"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { Avatar } from "./ui";
import { useMe, useSetActiveOrganization } from "@/lib/hooks/useMe";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Which organization the portal is acting for. Lives in the sidebar. */
export default function OrgSwitcher() {
  const { data: me } = useMe();
  const setActive = useSetActiveOrganization();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) =>
      ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const org = me?.organization;
  const orgs = me?.organizations ?? [];
  if (!org) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-[16px] border border-line bg-canvas px-3 py-2.5 text-left transition-colors hover:border-ink"
      >
        <Avatar initials={initials(org.name)} size={32} src={org.logo} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium text-ink">
            {org.name}
          </span>
          <span className="block text-[12px] capitalize text-muted">
            {org.role}
          </span>
        </span>
        {setActive.isPending ? (
          <Loader2 size={16} className="animate-spin text-accent" />
        ) : (
          <ChevronsUpDown size={16} className="text-faint" />
        )}
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Organizations"
          className="absolute left-0 right-0 top-full z-40 mt-2 rounded-[20px] border border-line bg-canvas p-1.5"
        >
          {orgs.map((o) => {
            const on = o.id === org.id;
            return (
              <button
                key={o.id}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => {
                  setOpen(false);
                  if (!on) setActive.mutate(o.id);
                }}
                className="flex w-full items-center gap-3 rounded-[14px] px-2.5 py-2 text-left transition-colors hover:bg-subtle"
              >
                <Avatar initials={initials(o.name)} size={28} src={o.logo} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] text-ink">
                    {o.name}
                  </span>
                  <span className="block text-[12px] capitalize text-muted">
                    {o.role}
                  </span>
                </span>
                {on && <Check size={15} className="text-accent" />}
              </button>
            );
          })}
          <Link
            href="/portal/organizations/new"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-3 rounded-[14px] border-t border-line px-2.5 py-2.5 text-[14px] text-ink hover:bg-subtle"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line">
              <Plus size={14} />
            </span>
            New organization
          </Link>
        </div>
      )}
    </div>
  );
}

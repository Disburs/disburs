"use client";

import { useState } from "react";
import {
  Check,
  Sparkles,
  Sheet,
  StickyNote,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react";
import { Card, Button, Badge, PageTitle, SectionHeading, inputClass } from "@/components/portal/ui";

function Toggle({
  on,
  onClick,
}: {
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`flex h-[26px] w-[44px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-150 ${
        on ? "bg-ink-deep" : "bg-line"
      }`}
    >
      <span
        className={`block h-5 w-5 rounded-full bg-canvas transition-transform duration-150 ${
          on ? "translate-x-[18px]" : ""
        }`}
      />
    </button>
  );
}

function SettingRow({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-4 last:border-0">
      <div className="max-w-[420px]">
        <div className="text-[14.5px] font-medium text-ink">{title}</div>
        <div className="mt-0.5 text-[13px] text-muted">{desc}</div>
      </div>
      {children}
    </div>
  );
}

const SENSITIVITY = ["Conservative", "Standard", "Relaxed"];

const NOTIF_EVENTS = [
  { label: "Payroll ready for approval", channels: ["email", "whatsapp"] },
  { label: "Low balance warning", channels: ["email", "sms"] },
  { label: "Dispute raised", channels: ["email"] },
];

const AUDIT = [
  { time: "Nov 1, 09:00", text: "Executed December payroll: 7 contractors, $7,180, tx GADT…K39P.", reason: "Within your $15,000 auto-run threshold." },
  { time: "Nov 1, 08:58", text: "Resolved Bola's overtime dispute, paid +$360.", reason: "$360 is below the $500 auto-resolve limit; evidence verified on ticket #2847." },
  { time: "Oct 29, 14:12", text: "Paused and asked you to confirm Amara's wallet change.", reason: "Wallet changes always require confirmation under standard sensitivity." },
  { time: "Oct 28, 09:30", text: "Sent a low-balance alert recommending a $2,600 top-up.", reason: "Projected payroll exceeded balance by more than 10%." },
];

export default function SettingsPage() {
  const [autoRun, setAutoRun] = useState(true);
  const [sheets, setSheets] = useState(true);
  const [notion, setNotion] = useState(false);
  const [sensitivity, setSensitivity] = useState("Standard");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto flex max-w-[920px] flex-col gap-5">
      <PageTitle sub="How the agent runs payroll, what it asks you about, and how it reaches you.">
        Settings
      </PageTitle>

      {/* Risk & approvals */}
      <Card>
        <SectionHeading title="Approvals & risk" />
        <div>
          <SettingRow
            title="Approval threshold"
            desc="The agent always pauses for your confirmation on runs above this amount."
          >
            <div className="flex items-center gap-2">
              <span className="text-[15px] text-muted">$</span>
              <div className="w-[140px]">
                <input defaultValue="15,000" className={`${inputClass} tabular`} />
              </div>
            </div>
          </SettingRow>
          <SettingRow
            title="Dispute auto-resolve limit"
            desc="Below this amount, the agent resolves disputes without asking you."
          >
            <div className="flex items-center gap-2">
              <span className="text-[15px] text-muted">$</span>
              <div className="w-[140px]">
                <input defaultValue="500" className={`${inputClass} tabular`} />
              </div>
            </div>
          </SettingRow>
          <SettingRow
            title="Anomaly sensitivity"
            desc="How aggressively the agent flags unusual amounts or changes."
          >
            <div className="flex flex-wrap gap-2">
              {SENSITIVITY.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={sensitivity === s ? "ink" : "secondary"}
                  onClick={() => setSensitivity(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </SettingRow>
          <SettingRow
            title="Auto-run schedule"
            desc="Run payroll automatically each cycle when nothing is flagged."
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-[200px]">
                <select
                  disabled={!autoRun}
                  defaultValue="1st, 09:00"
                  className={`${inputClass} disabled:text-muted`}
                >
                  <option>1st, 09:00</option>
                  <option>15th &amp; 30th, 09:00</option>
                  <option>Every Friday, 17:00</option>
                </select>
              </div>
              <Toggle on={autoRun} onClick={() => setAutoRun((v) => !v)} />
            </div>
          </SettingRow>
        </div>
      </Card>

      {/* Integrations */}
      <Card>
        <SectionHeading title="Connected timesheet tools" />
        <div>
          <SettingRow title="Google Sheets" desc="Pull hours and timesheets from connected sheets.">
            <div className="flex items-center gap-3">
              {sheets && <Badge variant="success" dot>Connected</Badge>}
              <Button size="sm" variant={sheets ? "secondary" : "ink"} onClick={() => setSheets((v) => !v)}>
                <Sheet size={14} /> {sheets ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </SettingRow>
          <SettingRow title="Notion" desc="Read timesheet databases and contractor pages.">
            <div className="flex items-center gap-3">
              {notion && <Badge variant="success" dot>Connected</Badge>}
              <Button size="sm" variant={notion ? "secondary" : "ink"} onClick={() => setNotion((v) => !v)}>
                <StickyNote size={14} /> {notion ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </SettingRow>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <SectionHeading title="Notifications" />
        <p className="-mt-2 text-[13px] text-muted">
          Choose how the agent reaches you for each event.
        </p>
        <div className="mt-2 divide-y divide-line">
          {NOTIF_EVENTS.map((e) => (
            <div
              key={e.label}
              className="flex flex-wrap items-center justify-between gap-2 py-4"
            >
              <span className="text-[14.5px] text-ink">{e.label}</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "email", icon: Mail, label: "Email" },
                  { key: "sms", icon: Smartphone, label: "SMS" },
                  { key: "whatsapp", icon: MessageSquare, label: "WhatsApp" },
                ].map((ch) => {
                  const on = e.channels.includes(ch.key);
                  const Icon = ch.icon;
                  return (
                    <Badge key={ch.key} variant={on ? "success" : "neutral"}>
                      <Icon size={13} /> {ch.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Audit log */}
      <Card padding={0}>
        <div className="flex items-center gap-2 border-b border-line px-6 py-5">
          <Sparkles size={16} className="text-accent" />
          <h3 className="text-[16px] font-medium text-ink">Agent audit log</h3>
        </div>
        <div className="px-6 pb-5 pt-2">
          {AUDIT.map((a, i) => (
            <div key={i} className="flex gap-3 py-3">
              <div className="flex flex-col items-center">
                <span className="mt-[5px] inline-block h-2 w-2 rounded-full bg-accent" />
                {i < AUDIT.length - 1 && (
                  <span className="mt-1 w-0 flex-1 border-l border-line" />
                )}
              </div>
              <div className="pb-1">
                <div className="text-[13px] text-muted">{a.time}</div>
                <div className="mt-0.5 text-[14.5px] text-ink">{a.text}</div>
                <div className="mt-1.5 flex items-start gap-1.5 text-[13px] text-muted">
                  <Sparkles size={12} className="mt-0.5 shrink-0 text-accent" />
                  {a.reason}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Save bar */}
      <div className="flex justify-end">
        <Button onClick={save}>
          {saved ? (
            <>
              <Check size={16} /> Saved
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </div>
  );
}

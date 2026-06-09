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
import { Card, Button, Badge } from "@/components/portal/ui";

function Toggle({
  on,
  onClick,
}: {
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      style={{
        width: "44px",
        height: "26px",
        borderRadius: "9999px",
        background: on ? "#12FF80" : "#D7DADF",
        padding: "3px",
        transition: "background 150ms",
      }}
    >
      <span
        className="block rounded-full bg-white"
        style={{
          width: "20px",
          height: "20px",
          transform: on ? "translateX(18px)" : "none",
          transition: "transform 150ms",
          boxShadow: "rgba(0,0,0,0.15) 0px 1px 2px",
        }}
      />
    </button>
  );
}

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3"
      style={{ padding: "16px 0", borderBottom: "1px solid #F0F1F3" }}
    >
      <div style={{ maxWidth: "420px" }}>
        <div className="font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
          {title}
        </div>
        <div style={{ fontSize: "13px", color: "#8A8F98", marginTop: "2px" }}>
          {desc}
        </div>
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
    <div className="mx-auto flex flex-col gap-5" style={{ maxWidth: "920px" }}>
      {/* Risk & approvals */}
      <Card>
        <h3 className="font-medium" style={{ fontSize: "15px", color: "#1A1A1A" }}>
          Approvals &amp; risk
        </h3>
        <div className="mt-2">
          <Row
            title="Approval threshold"
            desc="The agent always pauses for your confirmation on runs above this amount."
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "15px", color: "#8A8F98" }}>$</span>
              <input
                defaultValue="15,000"
                style={{ width: "120px", height: "40px", borderRadius: "8px", border: "1px solid #E8E8E8", padding: "0 12px", fontSize: "14px" }}
              />
            </div>
          </Row>
          <Row
            title="Dispute auto-resolve limit"
            desc="Below this amount, the agent resolves disputes without asking you."
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "15px", color: "#8A8F98" }}>$</span>
              <input
                defaultValue="500"
                style={{ width: "120px", height: "40px", borderRadius: "8px", border: "1px solid #E8E8E8", padding: "0 12px", fontSize: "14px" }}
              />
            </div>
          </Row>
          <Row
            title="Anomaly sensitivity"
            desc="How aggressively the agent flags unusual amounts or changes."
          >
            <div className="flex gap-1" style={{ background: "#F0F1F3", borderRadius: "9px", padding: "3px" }}>
              {SENSITIVITY.map((s) => (
                <button
                  key={s}
                  onClick={() => setSensitivity(s)}
                  style={{
                    borderRadius: "7px",
                    padding: "6px 12px",
                    fontSize: "13px",
                    fontWeight: 500,
                    background: sensitivity === s ? "#FFFFFF" : "transparent",
                    color: sensitivity === s ? "#1A1A1A" : "#8A8F98",
                    boxShadow: sensitivity === s ? "rgba(0,0,0,0.05) 0px 1px 2px" : "none",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </Row>
          <div
            className="flex flex-wrap items-center justify-between gap-3"
            style={{ padding: "16px 0 0" }}
          >
            <div>
              <div className="font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
                Auto-run schedule
              </div>
              <div style={{ fontSize: "13px", color: "#8A8F98", marginTop: "2px" }}>
                Run payroll automatically each cycle when nothing is flagged.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                disabled={!autoRun}
                defaultValue="1st, 09:00"
                style={{ height: "40px", borderRadius: "8px", border: "1px solid #E8E8E8", padding: "0 12px", fontSize: "14px", opacity: autoRun ? 1 : 0.5 }}
              >
                <option>1st, 09:00</option>
                <option>15th &amp; 30th, 09:00</option>
                <option>Every Friday, 17:00</option>
              </select>
              <Toggle on={autoRun} onClick={() => setAutoRun((v) => !v)} />
            </div>
          </div>
        </div>
      </Card>

      {/* Integrations */}
      <Card>
        <h3 className="font-medium" style={{ fontSize: "15px", color: "#1A1A1A" }}>
          Connected timesheet tools
        </h3>
        <div className="mt-2">
          <Row title="Google Sheets" desc="Pull hours and timesheets from connected sheets.">
            <div className="flex items-center gap-3">
              {sheets && <Badge variant="success" dot>Connected</Badge>}
              <Button size="sm" variant={sheets ? "secondary" : "primary"} onClick={() => setSheets((v) => !v)}>
                <Sheet size={14} /> {sheets ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </Row>
          <Row title="Notion" desc="Read timesheet databases and contractor pages.">
            <div className="flex items-center gap-3">
              {notion && <Badge variant="success" dot>Connected</Badge>}
              <Button size="sm" variant={notion ? "secondary" : "primary"} onClick={() => setNotion((v) => !v)}>
                <StickyNote size={14} /> {notion ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </Row>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <h3 className="font-medium" style={{ fontSize: "15px", color: "#1A1A1A" }}>
          Notifications
        </h3>
        <p style={{ fontSize: "13px", color: "#8A8F98", marginTop: "2px" }}>
          Choose how the agent reaches you for each event.
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {NOTIF_EVENTS.map((e) => (
            <div
              key={e.label}
              className="flex flex-wrap items-center justify-between gap-2"
              style={{ padding: "10px 0", borderBottom: "1px solid #F0F1F3" }}
            >
              <span style={{ fontSize: "14px", color: "#1A1A1A" }}>{e.label}</span>
              <div className="flex gap-2">
                {[
                  { key: "email", icon: Mail, label: "Email" },
                  { key: "sms", icon: Smartphone, label: "SMS" },
                  { key: "whatsapp", icon: MessageSquare, label: "WhatsApp" },
                ].map((ch) => {
                  const on = e.channels.includes(ch.key);
                  const Icon = ch.icon;
                  return (
                    <span
                      key={ch.key}
                      className="inline-flex items-center gap-1.5"
                      style={{
                        borderRadius: "7px",
                        padding: "6px 10px",
                        fontSize: "12.5px",
                        fontWeight: 500,
                        background: on ? "#DEF6E9" : "#F5F5F5",
                        color: on ? "#0A7A1E" : "#A4A8AE",
                        border: "1px solid " + (on ? "#BFEBD0" : "#E8E8E8"),
                      }}
                    >
                      <Icon size={13} /> {ch.label}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Audit log */}
      <Card padding={0}>
        <div className="flex items-center gap-2" style={{ padding: "18px 24px", borderBottom: "1px solid #F0F1F3" }}>
          <Sparkles size={16} color="#0A9200" />
          <h3 className="font-medium" style={{ fontSize: "15px", color: "#1A1A1A" }}>
            Agent audit log
          </h3>
        </div>
        <div style={{ padding: "8px 24px 18px" }}>
          {AUDIT.map((a, i) => (
            <div key={i} className="flex gap-3" style={{ padding: "12px 0" }}>
              <div className="flex flex-col items-center">
                <span className="inline-block rounded-full" style={{ width: "8px", height: "8px", background: "#12FF80", marginTop: "5px" }} />
                {i < AUDIT.length - 1 && (
                  <span style={{ flex: 1, width: 0, borderLeft: "1px solid #E8E8E8", marginTop: "4px" }} />
                )}
              </div>
              <div className="pb-1">
                <div style={{ fontSize: "12px", color: "#8A8F98" }}>{a.time}</div>
                <div style={{ fontSize: "14px", color: "#1A1A1A", marginTop: "2px" }}>{a.text}</div>
                <div
                  className="mt-1.5 inline-flex items-start gap-1.5"
                  style={{ fontSize: "12.5px", color: "#5C6068", background: "#F7F8F9", borderRadius: "6px", padding: "4px 9px" }}
                >
                  <Sparkles size={12} color="#0A9200" className="mt-0.5 shrink-0" />
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

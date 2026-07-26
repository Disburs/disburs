"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Check, X, ChevronDown } from "lucide-react";
import { companies } from "@/lib/contractor";

type Msg = {
  id: number;
  role: "user" | "agent";
  text: string;
  resolution?: { amount: string } | null;
  done?: boolean;
};

const STARTERS = [
  "I think my payment is wrong",
  "I have a question about my amount",
  "I haven't received my payment",
];

let counter = 50;

const INTRO: Msg[] = [
  {
    id: 1,
    role: "agent",
    text: "Hi Laycon 👋 I'm the Disburs agent for Northwind Studios. You were paid $1,200 on Nov 1, which included your $300 milestone bonus. How can I help?",
  },
];

function reply(text: string): Msg[] {
  const t = text.toLowerCase();
  counter += 1;
  if (t.includes("wrong") || t.includes("amount") || t.includes("less") || t.includes("short")) {
    return [
      {
        id: counter,
        role: "agent",
        text: "Happy to check. Which payment period are you asking about — November or an earlier month?",
      },
    ];
  }
  if (t.includes("haven't") || t.includes("not received") || t.includes("missing")) {
    return [
      {
        id: counter,
        role: "agent",
        text: "Let me look. Your Nov 1 payment of $1,200 settled to your wallet in 4 seconds (tx GADT…K39P). It may not have been converted to naira yet — want me to start a cash-out?",
      },
    ];
  }
  if (t.includes("november") || t.includes("overtime") || t.includes("hours") || t.includes("nov")) {
    counter += 1;
    return [
      {
        id: counter,
        role: "agent",
        text: "I see it. You logged 4 hours of overtime on ticket #2847 that weren't in the November run. I've verified them and they qualify.",
      },
      {
        id: counter + 1,
        role: "agent",
        text: "I've sent the difference to your wallet.",
        resolution: { amount: "$360" },
      },
    ];
  }
  return [
    {
      id: counter,
      role: "agent",
      text: "Got it. I can explain any amount, check a missing payment, or start a cash-out. Tell me a bit more and I'll sort it.",
    },
  ];
}

export default function MessagesPage() {
  const [company, setCompany] = useState(companies[0]);
  const [showCompanies, setShowCompanies] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(INTRO);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    counter += 1;
    setMessages((m) => [...m, { id: counter, role: "user", text: value }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, ...reply(value)]);
    }, 1100);
  };

  const resolve = (id: number, ok: boolean) => {
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, done: true } : x)));
    counter += 1;
    const note: Msg = ok
      ? { id: counter, role: "agent", text: "Wonderful. Glad that's sorted — the $360 will show in your balance right away. Anything else?" }
      : { id: counter, role: "agent", text: "No problem, I'll flag this for a human at Northwind Studios to review and get back to you." };
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, note]);
    }, 900);
  };

  return (
    <div className="mx-auto flex flex-col" style={{ maxWidth: "760px", height: "calc(100vh - 64px - 110px)", minHeight: "500px" }}>
      {/* Company switcher */}
      <div className="relative mb-2">
        <button
          onClick={() => setShowCompanies((v) => !v)}
          className="flex w-full items-center justify-between"
          style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", borderRadius: "12px", padding: "11px 14px" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={15} color="#0A9200" />
            <span className="font-medium" style={{ fontSize: "14px", color: "#1A1A1A" }}>
              {company}
            </span>
          </div>
          <ChevronDown size={16} color="#8A8F98" style={{ transform: showCompanies ? "rotate(180deg)" : "none" }} />
        </button>
        {showCompanies && (
          <div
            className="absolute left-0 right-0 z-10 mt-1"
            style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", borderRadius: "12px", padding: "4px", boxShadow: "rgba(0,0,0,0.08) 0px 6px 18px" }}
          >
            {companies.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCompany(c);
                  setShowCompanies(false);
                  setMessages(INTRO);
                }}
                className="flex w-full items-center justify-between"
                style={{ padding: "10px 12px", borderRadius: "8px", fontSize: "14px", color: "#1A1A1A" }}
              >
                {c}
                {c === company && <Check size={15} color="#0A9200" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 pb-3">
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div
                  style={{ background: "#12FF80", color: "#1A1A1A", borderRadius: "16px 16px 4px 16px", padding: "10px 14px", fontSize: "14.5px", maxWidth: "82%", lineHeight: 1.45 }}
                >
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex gap-2">
                <span
                  className="flex shrink-0 items-center justify-center self-end"
                  style={{ width: "28px", height: "28px", borderRadius: "9999px", background: "#DEF6E9" }}
                >
                  <Sparkles size={14} color="#0A9200" />
                </span>
                <div style={{ maxWidth: "84%" }}>
                  <div
                    style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", color: "#1A1A1A", borderRadius: "16px 16px 16px 4px", padding: "11px 14px", fontSize: "14.5px", lineHeight: 1.5 }}
                  >
                    {m.text}
                  </div>
                  {m.resolution && (
                    <div
                      className="mt-2"
                      style={{ background: "#F7FBF8", border: "1px solid #DEF6E9", borderRadius: "14px", padding: "14px" }}
                    >
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: "13px", color: "#1A5028" }}>Added to your wallet</span>
                        <span className="font-medium" style={{ fontSize: "17px", color: "#0A9200" }}>
                          +{m.resolution.amount}
                        </span>
                      </div>
                      <div className="mt-2" style={{ fontSize: "13px", color: "#1A5028" }}>
                        Does this resolve your query?
                      </div>
                      {m.done ? (
                        <div className="mt-2 flex items-center gap-1.5 font-medium" style={{ fontSize: "13px", color: "#0A9200" }}>
                          <Check size={15} /> Thanks for confirming
                        </div>
                      ) : (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => resolve(m.id, true)}
                            className="flex items-center gap-1.5 font-medium active:scale-[0.98]"
                            style={{ background: "#12FF80", color: "#1A1A1A", borderRadius: "9px", padding: "8px 14px", fontSize: "13px" }}
                          >
                            <Check size={15} /> Yes, resolved
                          </button>
                          <button
                            onClick={() => resolve(m.id, false)}
                            className="flex items-center gap-1.5 font-medium active:scale-[0.98]"
                            style={{ background: "#FFFFFF", color: "#5C6068", border: "1px solid #E2E4E7", borderRadius: "9px", padding: "8px 14px", fontSize: "13px" }}
                          >
                            <X size={15} /> Not yet
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {typing && (
            <div className="flex gap-2">
              <span
                className="flex shrink-0 items-center justify-center self-end"
                style={{ width: "28px", height: "28px", borderRadius: "9999px", background: "#DEF6E9" }}
              >
                <Sparkles size={14} color="#0A9200" />
              </span>
              <div className="flex items-center gap-1" style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", borderRadius: "16px 16px 16px 4px", padding: "13px 14px" }}>
                {[0, 1, 2].map((d) => (
                  <span key={d} className="inline-block rounded-full" style={{ width: "6px", height: "6px", background: "#C2C6CC", animation: `blink 1s ${d * 0.15}s infinite` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Starters + composer */}
      <div>
        {messages.length <= 1 && (
          <div className="mb-2 flex flex-col gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-left"
                style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", borderRadius: "12px", padding: "11px 14px", fontSize: "13.5px", color: "#1A1A1A" }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
          style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", borderRadius: "14px", padding: "7px 7px 7px 14px" }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: "14.5px", color: "#1A1A1A" }}
          />
          <button
            type="submit"
            aria-label="Send"
            className="flex items-center justify-center active:scale-95"
            style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#12FF80" }}
          >
            <Send size={17} color="#1A1A1A" />
          </button>
        </form>
      </div>
    </div>
  );
}

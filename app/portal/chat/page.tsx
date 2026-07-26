"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Sparkles, Check, X } from "lucide-react";

type Action = { label: string; total?: string } | null;
type Msg = {
  id: number;
  role: "user" | "agent";
  text: string;
  action?: Action;
  done?: boolean;
};

const CHIPS = [
  "Pay everyone for December",
  "Check Amara's payment status",
  "What's my balance?",
  "Who hasn't uploaded a contract?",
];

const INTRO: Msg[] = [
  {
    id: 1,
    role: "agent",
    text: "Morning. Everything is on track for the Dec 1 run. One thing to flag: your balance is $9,800 and the run needs about $12,180, so you'll want to top up $2,600 beforehand. Want me to prep anything?",
  },
];

let counter = 100;

function reply(input: string): Msg {
  const t = input.toLowerCase();
  counter += 1;
  const id = counter;

  if (t.includes("balance")) {
    return {
      id,
      role: "agent",
      text: "Your USDC balance is $9,800. The next payroll (Dec 1) is estimated at $12,180, so I'd recommend topping up $2,600. I can draft a funding link if helpful.",
    };
  }
  if (t.includes("amara")) {
    return {
      id,
      role: "agent",
      text: "Amara Njoroge was paid $1,200 on Nov 1 to her verified wallet (GBQW…3LMN). It settled in 4 seconds at 129 KES/USDC. No issues, no open disputes.",
    };
  }
  if (t.includes("contract")) {
    return {
      id,
      role: "agent",
      text: "Two contractors are missing a contract on file: Wanjiru Kamau (using last cycle's amount) and Zanele Dlamini (still in KYC). I've already nudged both. Want me to send a firmer reminder?",
    };
  }
  if (t.includes("pay")) {
    return {
      id,
      role: "agent",
      text: "I've read all 9 contracts and timesheets. Laycon has a $300 milestone bonus that qualifies, and Kwame is capped at 40 hrs/week. Ready to pay 9 contractors for December at 1,618 NGN/USDC.",
      action: { label: "Approve & Execute", total: "$12,180 USDC" },
    };
  }
  return {
    id,
    role: "agent",
    text: "Got it. I can prepare the payroll, check a contractor's status, pull your balance, or chase missing documents. Tell me what you'd like and I'll handle it.",
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(INTRO);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
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
      setMessages((m) => [...m, reply(value)]);
    }, 1100);
  };

  const resolveAction = (id: number, approved: boolean) => {
    setMessages((m) =>
      m.map((msg) => (msg.id === id ? { ...msg, done: true } : msg))
    );
    counter += 1;
    const note: Msg = approved
      ? {
        id: counter,
        role: "agent",
        text: "Done. 9 contractors paid in one Stellar transaction (tx GADT…K39P) in 4 seconds. I've logged the run and notified everyone. Receipts are in Payment History.",
      }
      : {
        id: counter,
        role: "agent",
        text: "No problem, I've cancelled that run. Nothing was sent. Let me know when you'd like to revisit it.",
      };
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, note]);
    }, 900);
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 68px - 92px)", minHeight: "520px" }}>
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ paddingRight: "4px" }}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-4 pb-4">
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div
                  style={{
                    background: "#1A1A1A",
                    color: "#FFFFFF",
                    borderRadius: "16px 16px 4px 16px",
                    padding: "11px 15px",
                    fontSize: "14.5px",
                    maxWidth: "78%",
                    lineHeight: 1.5,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex gap-3">
                <span
                  className="flex shrink-0 items-center justify-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "9999px",
                    background: "#DEF6E9",
                  }}
                >
                  <Sparkles size={16} color="#0A9200" />
                </span>
                <div style={{ maxWidth: "82%" }}>
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E8E8E8",
                      color: "#1A1A1A",
                      borderRadius: "4px 16px 16px 16px",
                      padding: "12px 16px",
                      fontSize: "14.5px",
                      lineHeight: 1.55,
                    }}
                  >
                    {m.text}
                  </div>
                  {m.action && (
                    <div
                      className="mt-2"
                      style={{
                        background: "#F7FBF8",
                        border: "1px solid #DEF6E9",
                        borderRadius: "12px",
                        padding: "14px 16px",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: "13px", color: "#8A8F98" }}>
                          December payroll
                        </span>
                        <span
                          className="font-medium"
                          style={{ fontSize: "15px", color: "#1A1A1A" }}
                        >
                          {m.action.total}
                        </span>
                      </div>
                      {m.done ? (
                        <div
                          className="mt-3 flex items-center gap-2 font-medium"
                          style={{ fontSize: "13px", color: "#0A9200" }}
                        >
                          <Check size={15} /> Handled
                        </div>
                      ) : (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => resolveAction(m.id, true)}
                            className="flex items-center gap-1.5 font-medium active:scale-[0.99]"
                            style={{
                              background: "#12FF80",
                              color: "#1A1A1A",
                              borderRadius: "8px",
                              padding: "8px 14px",
                              fontSize: "13px",
                            }}
                          >
                            <Check size={15} /> {m.action.label}
                          </button>
                          <button
                            onClick={() => resolveAction(m.id, false)}
                            className="flex items-center gap-1.5 font-medium active:scale-[0.99]"
                            style={{
                              background: "#FFFFFF",
                              color: "#5C6068",
                              border: "1px solid #E8E8E8",
                              borderRadius: "8px",
                              padding: "8px 14px",
                              fontSize: "13px",
                            }}
                          >
                            <X size={15} /> Cancel
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
            <div className="flex gap-3">
              <span
                className="flex shrink-0 items-center justify-center"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "9999px",
                  background: "#DEF6E9",
                }}
              >
                <Sparkles size={16} color="#0A9200" />
              </span>
              <div
                className="flex items-center gap-1"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E8E8E8",
                  borderRadius: "4px 16px 16px 16px",
                  padding: "14px 16px",
                }}
              >
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="inline-block rounded-full"
                    style={{
                      width: "6px",
                      height: "6px",
                      background: "#C2C6CC",
                      animation: `blink 1s ${d * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-3 flex flex-wrap gap-2">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => send(c)}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8E8",
                borderRadius: "9999px",
                padding: "7px 14px",
                fontSize: "13px",
                color: "#5C6068",
              }}
              className="hover:border-[#12FF80]"
            >
              {c}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E8E8",
            borderRadius: "14px",
            padding: "8px 8px 8px 14px",
          }}
        >
          <button type="button" aria-label="Attach file" title="Attach contract or timesheet">
            <Paperclip size={20} color="#8A8F98" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message your agent…"
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: "14.5px", color: "#1A1A1A" }}
          />
          <button
            type="submit"
            aria-label="Send"
            className="flex items-center justify-center active:scale-95"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "#12FF80",
            }}
          >
            <Send size={17} color="#1A1A1A" />
          </button>
        </form>
      </div>
    </div>
  );
}

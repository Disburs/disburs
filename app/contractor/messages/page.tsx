"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/portal/ui";
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

const bubbleIn = "rounded-[20px] border border-line bg-subtle px-4 py-3 text-[14.5px] leading-[1.5] text-ink";
const bubbleOut = "rounded-[20px] bg-ink-deep px-4 py-3 text-[14.5px] leading-[1.5] text-white";

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
    <div className="mx-auto flex h-[calc(100vh-72px-110px)] min-h-[500px] max-w-[760px] flex-col">
      {/* Company switcher */}
      <div className="relative mb-3">
        <button
          type="button"
          onClick={() => setShowCompanies((v) => !v)}
          aria-expanded={showCompanies}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-canvas pl-4 pr-3 text-[14.5px] font-medium text-ink transition-colors hover:border-ink"
        >
          <span className="text-[12.5px] font-normal text-muted">Agent for</span>
          {company}
          <ChevronDown size={16} className={`text-muted transition-transform ${showCompanies ? "rotate-180" : ""}`} />
        </button>
        {showCompanies && (
          <div className="absolute left-0 z-10 mt-2 w-[260px] rounded-[16px] border border-line bg-canvas p-2">
            {companies.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCompany(c);
                  setShowCompanies(false);
                  setMessages(INTRO);
                }}
                className="flex w-full items-center justify-between rounded-full px-3 py-2.5 text-left text-[14px] text-ink hover:bg-subtle"
              >
                {c}
                {c === company && <Check size={15} className="text-accent" />}
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
                <div className={`max-w-[82%] ${bubbleOut}`}>{m.text}</div>
              </div>
            ) : (
              <div key={m.id} className="flex">
                <div className="max-w-[84%]">
                  <div className={bubbleIn}>{m.text}</div>
                  {m.resolution && (
                    <div className="mt-2 rounded-[20px] bg-accent-soft p-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[13px] text-accent">Added to your wallet</span>
                        <span className="tabular font-display text-[22px] font-semibold tracking-[-0.03em] text-accent">+{m.resolution.amount}</span>
                      </div>
                      <div className="mt-2 text-[13px] text-accent">Does this resolve your query?</div>
                      {m.done ? (
                        <div className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-accent">
                          <Check size={15} /> Thanks for confirming
                        </div>
                      ) : (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button size="sm" variant="ink" onClick={() => resolve(m.id, true)}>
                            <Check size={15} /> Yes, resolved
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => resolve(m.id, false)}>
                            <X size={15} /> Not yet
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {typing && (
            <div className="flex">
              <div className={`flex items-center gap-1 ${bubbleIn}`} aria-label="Agent is typing">
                {["[animation-delay:0ms]", "[animation-delay:150ms]", "[animation-delay:300ms]"].map((delay) => (
                  <span key={delay} className={`inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-faint ${delay}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Starters + composer */}
      <div>
        {messages.length <= 1 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="inline-flex h-10 items-center rounded-full border border-line bg-canvas px-4 text-left text-[13.5px] text-ink transition-colors hover:border-ink"
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
          className="flex items-center gap-2 border border-line bg-canvas py-1.5 pl-4 pr-1.5 focus-within:border-ink"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="h-10 flex-1 bg-transparent text-[14.5px] text-ink outline-none placeholder:text-faint"
          />
          <button
            type="submit"
            aria-label="Send"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint text-ink-deep transition-[opacity,transform] hover:opacity-[0.88] active:scale-[0.98]"
          >
            <Send size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}

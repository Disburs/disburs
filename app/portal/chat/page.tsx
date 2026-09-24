"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Sparkles, Check, X } from "lucide-react";
import { Button } from "@/components/portal/ui";

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

function AgentLabel() {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 text-[12.5px] text-muted">
      <Sparkles size={12} className="text-accent" /> Agent
    </div>
  );
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
    <div className="flex h-[calc(100dvh-184px)] min-h-[520px] flex-col md:h-[calc(100dvh-192px)]">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pr-1">
        <div className="mx-auto flex max-w-3xl flex-col gap-5 pb-4">
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[78%] rounded-[20px] bg-ink-deep px-4 py-3 text-[14.5px] leading-[1.5] text-white">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="max-w-[82%]">
                <AgentLabel />
                <div className="rounded-[20px] border border-line bg-subtle px-4 py-3 text-[14.5px] leading-[1.55] text-ink">
                  {m.text}
                </div>
                {m.action && (
                  <div className="mt-2 rounded-[20px] border border-line bg-canvas p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[13px] text-muted">December payroll</span>
                      <span className="tabular font-display text-[22px] font-semibold leading-none tracking-[-0.03em] text-ink">
                        {m.action.total}
                      </span>
                    </div>
                    {m.done ? (
                      <div className="mt-4 flex items-center gap-2 text-[13.5px] font-medium text-accent">
                        <Check size={15} /> Handled
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => resolveAction(m.id, true)}>
                          <Check size={15} /> {m.action.label}
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => resolveAction(m.id, false)}>
                          <X size={15} /> Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          )}

          {typing && (
            <div className="max-w-[82%]">
              <AgentLabel />
              <div className="inline-flex items-center gap-1 rounded-[20px] border border-line bg-subtle px-4 py-4">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className={`inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-faint ${
                      d === 1 ? "[animation-delay:150ms]" : d === 2 ? "[animation-delay:300ms]" : ""
                    }`}
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
            <Button key={c} size="sm" variant="secondary" onClick={() => send(c)}>
              {c}
            </Button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex h-14 items-center gap-2 rounded-full border border-line bg-canvas py-2 pl-4 pr-2 focus-within:border-ink"
        >
          <button
            type="button"
            aria-label="Attach file"
            title="Attach contract or timesheet"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted hover:text-ink"
          >
            <Paperclip size={20} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message your agent…"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
          />
          <button
            type="submit"
            aria-label="Send"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint text-ink-deep active:scale-95"
          >
            <Send size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}

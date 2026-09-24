import { Check, Lock } from "lucide-react";
import { Avatar, Kicker, Pill, TEAM } from "./mock";

/** Four tilted tiles: the product, in fragments. */
export default function Tiles() {
  const tile = "tile-in aspect-square w-full overflow-hidden rounded-tile";
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6" aria-hidden>
      {/* 1 — protected amount, on dark */}
      <div className={`${tile} flex flex-col justify-between bg-ink-deep p-6 md:[--r:-6deg] [--d:0s] md:p-8`}>
        <span className="text-[13px] text-white/50">Salary</span>
        <div>
          <div className="flex items-center gap-3 text-white">
            <Lock size={26} className="text-mint" />
            <span className="font-mono text-[28px] tracking-[0.04em] md:text-[34px]">••••••</span>
          </div>
          <div className="mt-2 text-[14px] text-white/55">Verified by proof. Never revealed.</div>
        </div>
      </div>
      {/* 2 — approve, on mint */}
      <div className={`${tile} flex items-center justify-center bg-mint p-6 md:[--r:3deg] [--d:0.12s]`}>
        <span className="inline-flex h-14 items-center gap-3 rounded-full bg-canvas px-6 text-[18px] font-medium text-ink md:text-[22px]">
          <Check size={22} strokeWidth={2.5} className="text-accent" />
          Approve payroll
        </span>
      </div>
      {/* 3 — payees paid, on dark */}
      <div className={`${tile} flex flex-col justify-center gap-3 bg-ink-deep p-6 md:[--r:-3deg] [--d:0.24s] md:p-8`}>
        {TEAM.slice(0, 3).map((m) => (
          <div key={m.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar m={m} size={40} />
              <span className="hidden text-[14px] text-white md:block">{m.name.split(" ")[0]}</span>
            </div>
            <span className="inline-flex h-9 items-center whitespace-nowrap rounded-full bg-canvas px-3 text-[13px] font-medium text-ink md:h-10 md:px-4 md:text-[15px]">
              Paid <span className="ml-1 hidden md:inline">· 4s</span>
            </span>
          </div>
        ))}
      </div>
      {/* 4 — run card, on subtle */}
      <div className={`${tile} flex flex-col justify-between border border-line bg-subtle p-6 md:[--r:6deg] [--d:0.36s] md:p-8`}>
        <div>
          <Kicker>March payroll</Kicker>
          <div className="tabular mt-2 text-[32px] font-semibold leading-none tracking-[-0.03em] text-ink md:text-[40px]">$12,840</div>
          <div className="mt-2 text-[14px] text-muted">18 contractors · 3 countries</div>
        </div>
        <Pill tone="accent">Ready for approval</Pill>
      </div>
    </div>
  );
}


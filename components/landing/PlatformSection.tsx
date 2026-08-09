import { ArrowRight } from "lucide-react";
import FadeIn from "./FadeIn";

const DISPLAY = "var(--font-display)";
const MONO = "var(--font-mono)";
const INK = "#0E1A14";
const MUT = "#5B6B62";
const DEEP = "#0A9200";
const MINT = "#12FF80";

const AUDIENCES = ["Fintech platforms", "HR portals", "Contractor management"];

/* dark code-editor mock */
function CodeMock() {
  const line = (n: number, children: React.ReactNode) => (
    <div className="flex" style={{ lineHeight: "22px" }}>
      <span style={{ width: 26, flexShrink: 0, color: "#3F5750", textAlign: "right", paddingRight: 14, userSelect: "none" }}>{n}</span>
      <span className="min-w-0">{children}</span>
    </div>
  );
  const kw = { color: "#5BE39A" };
  const str = { color: "#EFC07A" };
  const com = { color: "#5E7A6F" };
  const fn = { color: "#EAF4EF" };
  const punc = { color: "#8FA398" };

  return (
    <div className="overflow-hidden" style={{ background: "#0B1512", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 80px -40px rgba(6,35,26,0.6)" }}>
      <div className="flex items-center gap-2" style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span style={{ width: 11, height: 11, borderRadius: 999, background: "#FF5F57" }} />
        <span style={{ width: 11, height: 11, borderRadius: 999, background: "#FEBC2E" }} />
        <span style={{ width: 11, height: 11, borderRadius: 999, background: "#28C840" }} />
        <span className="ml-3" style={{ fontFamily: MONO, fontSize: 12, color: "#7C9488" }}>payroll.ts</span>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 13, padding: "16px 18px", color: "#D6E4DC", overflowX: "auto" }}>
        {line(1, <><span style={kw}>import</span> <span style={punc}>{"{ "}</span><span style={fn}>Disburs</span><span style={punc}>{" }"}</span> <span style={kw}>from</span> <span style={str}>&quot;@disburs/sdk&quot;</span><span style={punc}>;</span></>)}
        {line(2, <>&nbsp;</>)}
        {line(3, <><span style={kw}>const</span> <span style={fn}>disburs</span> <span style={punc}>=</span> <span style={kw}>new</span> <span style={fn}>Disburs</span><span style={punc}>(</span><span style={fn}>process</span><span style={punc}>.</span><span style={fn}>env</span><span style={punc}>.</span><span style={fn}>DISBURS_KEY</span><span style={punc}>);</span></>)}
        {line(4, <>&nbsp;</>)}
        {line(5, <span style={com}>{"// Run a private payroll for your users"}</span>)}
        {line(6, <><span style={kw}>await</span> <span style={fn}>disburs</span><span style={punc}>.</span><span style={fn}>payroll</span><span style={punc}>.</span><span style={fn}>run</span><span style={punc}>({"{"}</span></>)}
        {line(7, <>&nbsp;&nbsp;<span style={fn}>contractors</span><span style={punc}>:</span> <span style={fn}>team</span><span style={punc}>,</span> &nbsp;&nbsp;&nbsp;&nbsp;<span style={com}>{"// reads contracts, times FX"}</span></>)}
        {line(8, <>&nbsp;&nbsp;<span style={fn}>settle</span><span style={punc}>:</span> <span style={str}>&quot;stellar&quot;</span><span style={punc}>,</span> &nbsp;&nbsp;&nbsp;<span style={com}>{"// USDC, ~4s"}</span></>)}
        {line(9, <>&nbsp;&nbsp;<span style={fn}>privacy</span><span style={punc}>:</span> <span style={str}>&quot;zero-knowledge&quot;</span><span style={punc}>,</span> <span style={com}>{"// amounts stay hidden"}</span></>)}
        {line(10, <><span style={punc}>{"});"}</span></>)}
      </div>
    </div>
  );
}

export default function PlatformSection() {
  return (
    <section id="platform" className="bg-white px-6 md:px-12" style={{ paddingTop: "96px", paddingBottom: "100px" }}>
      <div className="mx-auto max-w-container">
        <FadeIn>
          <span className="block text-center font-semibold uppercase" style={{ color: DEEP, fontSize: 13, letterSpacing: "0.12em" }}>
            Platform &amp; APIs
          </span>
          <h2 className="mx-auto mt-4 text-center font-semibold" style={{ fontFamily: DISPLAY, color: INK, maxWidth: 720, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            Embedded payroll for modern platforms
          </h2>
          <p className="mx-auto mt-5 text-center" style={{ color: MUT, fontSize: 18, maxWidth: 620, lineHeight: 1.55 }}>
            Disburs is modular payroll infrastructure. Fintech platforms, HR
            portals and contractor systems can embed our autonomous settlement
            and zero-knowledge verification engine straight into their own
            workflows, without building the crypto and compliance plumbing from
            scratch.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {AUDIENCES.map((a) => (
              <span key={a} className="font-medium" style={{ fontSize: 13, color: DEEP, background: "#DEF6E9", borderRadius: 999, padding: "6px 13px" }}>
                {a}
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mx-auto mt-12" style={{ maxWidth: 820 }}>
            <CodeMock />
          </div>
        </FadeIn>

        <FadeIn>
          <div className="mt-8 flex justify-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 font-semibold transition-transform hover:scale-[1.02]"
              style={{ background: MINT, color: "#06231A", borderRadius: 11, height: 48, padding: "0 22px", fontSize: 15, boxShadow: "0 12px 28px -12px rgba(18,255,128,0.6)" }}
            >
              Explore developer APIs <ArrowRight size={16} />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

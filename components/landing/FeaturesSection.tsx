"use client";

import {
  FileText,
  MessageCircle,
  TrendingUp,
  Bell,
  Zap,
  Globe,
  Shield,
  type LucideIcon,
} from "lucide-react";
import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
  badge?: string;
  big?: boolean;
  mdWide?: boolean;
};

// Order tuned for a bento rhythm: big tiles land on alternating sides
// across a 3-column grid (big+small, small+big, big+small, small+big).
const FEATURES: Feature[] = [
  {
    icon: FileText,
    title: "Contract-aware payments",
    desc: "Upload any PDF or Google Drive link. The agent reads terms and calculates the right amount, including bonuses, overtime, and caps.",
    badge: "AI-powered",
    big: true,
  },
  {
    icon: TrendingUp,
    title: "FX rate optimization",
    desc: "The agent monitors exchange rates across anchor partners and executes at the best window of the day. Saves hundreds per month.",
  },
  {
    icon: Bell,
    title: "Proactive balance alerts",
    desc: "The agent checks your USDC balance before payroll day, not on it. You get a top-up alert 3 days early, every time.",
  },
  {
    icon: MessageCircle,
    title: "Autonomous dispute resolution",
    desc: "Contractor messages about a wrong payment? The agent reads it, checks the evidence, and resolves it, often without you seeing it.",
    badge: "AI-powered",
    big: true,
  },
  {
    icon: Zap,
    title: "Automated compliance checks",
    desc: "Your agent fetches and pays for up-to-date regulatory data on its own, keeping every payroll run compliant with no manual research.",
    badge: "AI-powered",
  },
  {
    icon: Shield,
    title: "Full audit trail",
    desc: "Every decision the agent makes is logged with a plain-English reason. Total transparency. Full compliance.",
  },
  {
    icon: Globe,
    title: "Multi-country offramps",
    desc: "Nigeria, Kenya, Ghana, South Africa. Contractors convert USDC to local currency instantly via Stellar anchor partners.",
    mdWide: true,
  },
];

function Badge({ children }: { children: string }) {
  return (
    <span
      className="inline-block font-medium"
      style={{
        background: "#DEF6E9",
        color: "#0A9200",
        borderRadius: "4px",
        padding: "2px 8px",
        fontSize: "11px",
      }}
    >
      {children}
    </span>
  );
}

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-white px-5 md:px-10"
      style={{ paddingTop: "80px", paddingBottom: "80px" }}
    >
      <div className="mx-auto max-w-container">
        <FadeIn>
          <SectionLabel>Features</SectionLabel>
          <h2
            className="mx-auto mt-4 text-center font-medium"
            style={{
              color: "#1A1A1A",
              maxWidth: "640px",
              fontSize: "clamp(28px, 5vw, 40px)",
              lineHeight: 1.1,
            }}
          >
            Everything your payroll needs. Nothing you need to touch.
          </h2>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn
                key={f.title}
                delay={(i % 3) * 0.05}
                className={
                  f.big
                    ? "h-full lg:col-span-2"
                    : f.mdWide
                    ? "h-full md:col-span-2 lg:col-span-1"
                    : "h-full"
                }
              >
                <div
                  className={`relative h-full overflow-hidden ${
                    f.big ? "bento-gradient" : "bg-white"
                  }`}
                  style={{
                    borderRadius: "20px",
                    border: "2px solid #E8E8E8",
                    padding: f.big ? "36px" : "28px",
                  }}
                >
                  {/* decorative glow on big tiles */}
                  {f.big && (
                    <div
                      aria-hidden
                      className="mint-glow absolute"
                      style={{
                        top: "-60px",
                        right: "-60px",
                        width: "220px",
                        height: "220px",
                        borderRadius: "9999px",
                      }}
                    />
                  )}

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span
                        className="flex items-center justify-center"
                        style={{
                          width: f.big ? "48px" : "40px",
                          height: f.big ? "48px" : "40px",
                          borderRadius: "9999px",
                          background: f.big ? "#FFFFFF" : "#DEF6E9",
                          border: f.big ? "1px solid #DEF6E9" : "none",
                        }}
                      >
                        <Icon size={f.big ? 24 : 20} color="#0A9200" />
                      </span>
                      {f.badge && <Badge>{f.badge}</Badge>}
                    </div>
                    <h3
                      className="font-medium"
                      style={{
                        fontSize: f.big ? "22px" : "18px",
                        color: "#1A1A1A",
                        marginTop: "16px",
                      }}
                    >
                      {f.title}
                    </h3>
                    <p
                      style={{
                        fontSize: f.big ? "16px" : "15px",
                        color: "#8A8F98",
                        marginTop: "8px",
                        lineHeight: 1.6,
                        maxWidth: f.big ? "440px" : "none",
                      }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

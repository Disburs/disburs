"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Wallet,
  Link2,
  Camera,
  ShieldCheck,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/portal/ui";
import { contractor } from "@/lib/contractor";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "46px",
  borderRadius: "10px",
  border: "1px solid #E2E4E7",
  padding: "0 14px",
  fontSize: "15px",
  color: "#1A1A1A",
  background: "#FFFFFF",
  outline: "none",
};

const COUNTRIES = [
  { name: "Nigeria", flag: "🇳🇬", cur: "NGN" },
  { name: "Kenya", flag: "🇰🇪", cur: "KES" },
  { name: "Ghana", flag: "🇬🇭", cur: "GHS" },
  { name: "South Africa", flag: "🇿🇦", cur: "ZAR" },
];

export default function ContractorOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const total = 4;

  const next = () => (step < total - 1 ? setStep(step + 1) : router.push("/contractor"));

  return (
    <div
      style={{ background: "#FFFFFF", border: "1px solid #ECEDEF", borderRadius: "20px", padding: "28px" }}
    >
      {/* progress */}
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "9999px",
              background: i <= step ? "#12FF80" : "#E2E4E7",
              transition: "background 200ms",
            }}
          />
        ))}
      </div>

      <div style={{ padding: "28px 0" }}>
        {step === 0 && <Welcome />}
        {step === 1 && <WalletStep />}
        {step === 2 && <CountryStep />}
        {step === 3 && <KycStep />}
      </div>

      {/* nav */}
      <div className="flex items-center justify-between" style={{ paddingTop: "8px" }}>
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-1.5" style={{ fontSize: "14px", color: "#8A8F98" }}>
            <ArrowLeft size={16} /> Back
          </button>
        ) : (
          <span />
        )}
        <Button onClick={next}>
          {step < total - 1 ? (
            <>
              Continue <ArrowRight size={16} />
            </>
          ) : (
            <>
              Go to my wallet <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function Welcome() {
  return (
    <div className="flex flex-col">
      <span
        className="flex items-center justify-center"
        style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#DEF6E9" }}
      >
        <PartyPopper size={28} color="#0A9200" />
      </span>
      <h1 className="mt-5 font-medium" style={{ fontSize: "26px", color: "#1A1A1A", lineHeight: 1.15 }}>
        Welcome, {contractor.firstName}.
      </h1>
      <p className="mt-2" style={{ fontSize: "15px", color: "#5C6068", lineHeight: 1.5 }}>
        <strong style={{ color: "#1A1A1A" }}>{contractor.employer}</strong> is now
        sending your payments through Disburs. You&rsquo;ll get paid in seconds and
        can cash out to your bank or mobile money anytime. No crypto knowledge
        needed.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <label style={{ fontSize: "13px", color: "#1A1A1A", fontWeight: 500 }}>
          Confirm your name
        </label>
        <input style={inputStyle} defaultValue={contractor.name} />
        <label style={{ fontSize: "13px", color: "#1A1A1A", fontWeight: 500 }}>
          Confirm your email
        </label>
        <input style={inputStyle} defaultValue={contractor.email} />
      </div>

      <div
        className="mt-5 flex items-start gap-2"
        style={{ background: "#F7FBF8", border: "1px solid #DEF6E9", borderRadius: "12px", padding: "12px 14px" }}
      >
        <Sparkles size={15} color="#0A9200" className="mt-0.5 shrink-0" />
        <span style={{ fontSize: "13px", color: "#1A5028", lineHeight: 1.5 }}>
          You can message the Disburs agent anytime if a payment looks off. It
          replies in plain language.
        </span>
      </div>
    </div>
  );
}

function WalletStep() {
  const [choice, setChoice] = useState<"create" | "connect">("create");
  return (
    <div className="flex flex-col">
      <h1 className="font-medium" style={{ fontSize: "23px", color: "#1A1A1A" }}>
        Where should we send your pay?
      </h1>
      <p className="mt-1.5" style={{ fontSize: "14px", color: "#8A8F98" }}>
        Pick a wallet to receive your USDC. Most people create a Disburs wallet.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <button
          onClick={() => setChoice("create")}
          className="flex items-start gap-3 text-left"
          style={{
            borderRadius: "14px",
            border: "2px solid " + (choice === "create" ? "#12FF80" : "#E2E4E7"),
            background: choice === "create" ? "#F7FBF8" : "#FFFFFF",
            padding: "16px",
          }}
        >
          <span
            className="flex shrink-0 items-center justify-center"
            style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#DEF6E9" }}
          >
            <Wallet size={20} color="#0A9200" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium" style={{ fontSize: "15px", color: "#1A1A1A" }}>
                Create a Disburs wallet
              </span>
              <span
                className="font-medium"
                style={{ fontSize: "11px", color: "#0A9200", background: "#DEF6E9", borderRadius: "5px", padding: "2px 7px" }}
              >
                Recommended
              </span>
            </div>
            <p className="mt-1" style={{ fontSize: "13px", color: "#8A8F98", lineHeight: 1.45 }}>
              We set it up for you in one tap. Nothing to install, nothing to
              remember.
            </p>
          </div>
        </button>

        <button
          onClick={() => setChoice("connect")}
          className="flex items-start gap-3 text-left"
          style={{
            borderRadius: "14px",
            border: "2px solid " + (choice === "connect" ? "#12FF80" : "#E2E4E7"),
            background: choice === "connect" ? "#F7FBF8" : "#FFFFFF",
            padding: "16px",
          }}
        >
          <span
            className="flex shrink-0 items-center justify-center"
            style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#F0F1F3" }}
          >
            <Link2 size={20} color="#5C6068" />
          </span>
          <div>
            <span className="font-medium" style={{ fontSize: "15px", color: "#1A1A1A" }}>
              Connect an existing Stellar wallet
            </span>
            <p className="mt-1" style={{ fontSize: "13px", color: "#8A8F98", lineHeight: 1.45 }}>
              Already use Lobstr or Freighter? Paste your address.
            </p>
            {choice === "connect" && (
              <input
                style={{ ...inputStyle, marginTop: "10px", height: "42px" }}
                className="font-mono"
                placeholder="G…"
              />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

function CountryStep() {
  const [country, setCountry] = useState("Nigeria");
  return (
    <div className="flex flex-col">
      <h1 className="font-medium" style={{ fontSize: "23px", color: "#1A1A1A" }}>
        Your local currency
      </h1>
      <p className="mt-1.5" style={{ fontSize: "14px", color: "#8A8F98" }}>
        So we can show what your pay is worth and where to cash out.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {COUNTRIES.map((c) => (
          <button
            key={c.name}
            onClick={() => setCountry(c.name)}
            className="flex items-center gap-2.5"
            style={{
              borderRadius: "12px",
              border: "2px solid " + (country === c.name ? "#12FF80" : "#E2E4E7"),
              background: country === c.name ? "#F7FBF8" : "#FFFFFF",
              padding: "14px",
            }}
          >
            <span style={{ fontSize: "22px" }}>{c.flag}</span>
            <div className="text-left">
              <div style={{ fontSize: "14px", color: "#1A1A1A" }}>{c.name}</div>
              <div style={{ fontSize: "12px", color: "#8A8F98" }}>{c.cur}</div>
            </div>
          </button>
        ))}
      </div>

      <label className="mt-6 block" style={{ fontSize: "13px", color: "#1A1A1A", fontWeight: 500 }}>
        Phone number (for SMS payment alerts)
      </label>
      <input style={{ ...inputStyle, marginTop: "8px" }} defaultValue="+234 802 1234 41" />
      <p className="mt-2" style={{ fontSize: "12px", color: "#8A8F98" }}>
        We text you the moment a payment lands.
      </p>
    </div>
  );
}

function KycStep() {
  const [id, setId] = useState(false);
  const [addr, setAddr] = useState(false);

  const Tile = ({
    done,
    onClick,
    title,
    sub,
  }: {
    done: boolean;
    onClick: () => void;
    title: string;
    sub: string;
  }) => (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3"
      style={{
        borderRadius: "14px",
        border: done ? "1px solid #DEF6E9" : "1.5px dashed #CBD0D5",
        background: done ? "#F7FBF8" : "#FFFFFF",
        padding: "16px",
        textAlign: "left",
      }}
    >
      <span
        className="flex shrink-0 items-center justify-center"
        style={{ width: "44px", height: "44px", borderRadius: "12px", background: done ? "#DEF6E9" : "#F0F1F3" }}
      >
        {done ? <Check size={22} color="#0A9200" /> : <Camera size={22} color="#5C6068" />}
      </span>
      <div>
        <div className="font-medium" style={{ fontSize: "14.5px", color: "#1A1A1A" }}>
          {done ? `${title} captured` : title}
        </div>
        <div style={{ fontSize: "12.5px", color: "#8A8F98" }}>
          {done ? "Looks good" : sub}
        </div>
      </div>
    </button>
  );

  return (
    <div className="flex flex-col">
      <span
        className="flex items-center justify-center"
        style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#DEF6E9" }}
      >
        <ShieldCheck size={26} color="#0A9200" />
      </span>
      <h1 className="mt-4 font-medium" style={{ fontSize: "23px", color: "#1A1A1A" }}>
        Quick identity check
      </h1>
      <p className="mt-1.5" style={{ fontSize: "14px", color: "#8A8F98" }}>
        A legal requirement to receive payments. Takes about a minute.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <Tile
          done={id}
          onClick={() => setId(true)}
          title="Government ID"
          sub="Tap to take a photo of your ID"
        />
        <Tile
          done={addr}
          onClick={() => setAddr(true)}
          title="Proof of address"
          sub="Utility bill or bank statement"
        />
      </div>

      {id && addr && (
        <div
          className="mt-5 flex items-center gap-2 font-medium"
          style={{ fontSize: "13px", color: "#0A7A1E", background: "#DEF6E9", borderRadius: "10px", padding: "12px 14px" }}
        >
          <Check size={16} /> All set. Your documents are encrypted and secure.
        </div>
      )}
    </div>
  );
}

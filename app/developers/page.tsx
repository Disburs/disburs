import type { Metadata } from "next";
import DevNav from "@/components/developers/DevNav";
import Footer from "@/components/landing/Footer";
import Faq, { type FaqCategory } from "@/components/landing/Faq";
import DevHero from "@/components/developers/DevHero";
import AgentSection from "@/components/developers/AgentSection";
import PrivacySection from "@/components/developers/PrivacySection";
import Bento from "@/components/developers/Bento";
import TrustTable from "@/components/developers/TrustTable";
import {
  Quickstart,
  UseCases,
} from "@/components/developers/UseCasesAndQuickstart";
import DevPricing from "@/components/developers/DevPricing";

export const metadata: Metadata = {
  title:
    "Disburs API | Private, autonomous payroll infrastructure for developers",
  description:
    "Custodial wallets, USDC payouts on Stellar and a ledger that matches the chain, as a REST API. An agent proposes each run inside your policy, and zero-knowledge proofs keep every salary off the public ledger.",
};

const FAQ: FaqCategory[] = [
  {
    name: "Getting started",
    items: [
      {
        q: "Is the API live today?",
        a: "The REST endpoints for onboarding, wallets, payments and the ledger are live and documented in the OpenAPI spec. Payroll runs and webhooks land in Phase 1; the agent SDK in Phase 3. Access is by request while we are in private beta.",
      },
      {
        q: "How do I authenticate?",
        a: "Today with the same cookie session the web app uses, issued by magic link or Google. API keys for server-to-server use arrive with the SDK.",
      },
      {
        q: "Is there a sandbox?",
        a: "Yes. Point at testnet, fund a treasury from Circle's faucet and every call behaves exactly as on mainnet, down to the same USDC issuer.",
      },
    ],
  },
  {
    name: "The agent",
    items: [
      {
        q: "Does the agent have access to the treasury?",
        a: "No. It proposes. A policy engine validates the proposal, a proof verifies it, a human authorizes it, and only then does payment infrastructure execute. The agent never holds a key or a balance.",
      },
      {
        q: "Can I use my own agent?",
        a: "That is the point of the SDK in Phase 3: a typed, scoped client any agent can drive to propose and reconcile runs, with the same policy layer in front of it.",
      },
      {
        q: "What if the agent gets something wrong?",
        a: "Every decision is logged in plain English with its inputs. Anything outside policy waits for a person, and a run can be paused in one action.",
      },
    ],
  },
  {
    name: "Privacy",
    items: [
      {
        q: "How does private payroll work?",
        a: "Through a second settlement path: a shielded pool on Soroban where salaries are commitments, not amounts, and each payout carries a zero-knowledge proof that it went to the right payee within budget. The chain verifies the payout without learning the number.",
      },
      {
        q: "What stays visible?",
        a: "Deposits into and out of the pool in aggregate, and timing. Individual salaries and who received what are hidden. We do not claim perfect anonymity; we claim hidden salaries.",
      },
      {
        q: "How do audits work?",
        a: "With view keys. An organization issues one to an auditor and they can read that organization's amounts. Nobody else can, and the public ledger never can.",
      },
      {
        q: "When?",
        a: "Phase 4. Everything before it is built so plaintext amounts are never entrenched, and the pay call keeps the same shape when shielded settlement lands.",
      },
    ],
  },
  {
    name: "Payments and custody",
    items: [
      {
        q: "What happens if I retry a payout?",
        a: "Send the same idempotency key and you get the original payout back. A unique constraint on the pending ledger entry makes a double-pay impossible.",
      },
      {
        q: "Who holds the keys?",
        a: "Disburs does, envelope-encrypted at rest and used only to sign that wallet's own payments. No endpoint ever returns a secret.",
      },
      {
        q: "How do contractors get local currency?",
        a: "They withdraw their USDC to a licensed exchange or Stellar anchor in their country and cash out there. Disburs settles in USDC and does not convert to fiat itself; USDC can be held or sent anywhere Stellar reaches.",
      },
    ],
  },
];

export default function DevelopersPage() {
  return (
    <main id="top" className="overflow-x-clip">
      <noscript>
        <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <DevNav />
      <DevHero />
      <AgentSection />
      <PrivacySection />
      <Bento />
      <TrustTable />
      <UseCases />
      <Quickstart />
      <DevPricing />
      <Faq
        categories={FAQ}
        lead="How the API and the agent behave when money is involved, in plain words."
      />
      <Footer />
    </main>
  );
}

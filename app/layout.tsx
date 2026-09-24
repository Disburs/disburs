import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import WaitlistModal from "@/components/WaitlistModal";

export const metadata: Metadata = {
  metadataBase: new URL("https://disburs.io"),
  title: "Disburs: Payroll That Thinks",
  description:
    "Disburs is autonomous payroll infrastructure. An agent reads your contracts and proposes each run, policy checks and zero-knowledge proofs validate it, and nothing settles until you approve. Paid in USDC on Stellar.",
  keywords: [
    "payroll",
    "African contractors",
    "Stellar",
    "USDC",
    "AI agent",
    "crypto payroll",
    "remote payments",
  ],
  openGraph: {
    title: "Disburs: Payroll That Thinks",
    description:
      "An agent proposes each payroll run, policy checks and zero-knowledge proofs validate it, and you approve before anything settles. Private payroll in USDC on Stellar.",
    url: "https://disburs.io",
    siteName: "Disburs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disburs: Payroll That Thinks",
    description:
      "An agent proposes each payroll run, policy checks and zero-knowledge proofs validate it, and you approve before anything settles. Private payroll in USDC on Stellar.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <WaitlistModal />
        </Providers>
      </body>
    </html>
  );
}

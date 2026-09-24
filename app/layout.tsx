import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import WaitlistModal from "@/components/WaitlistModal";

export const metadata: Metadata = {
  metadataBase: new URL("https://disburs.io"),
  title: "Disburs: Payroll That Thinks",
  description:
    "Disburs is an autonomous AI agent that reads your contracts, clears routine exceptions, and pays your contractors privately on Stellar with zero-knowledge proofs. Not a payout API. An agent.",
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
      "Not a payout API. An autonomous AI agent that reads contracts, clears routine exceptions, and keeps payroll private with zero-knowledge proofs.",
    url: "https://disburs.io",
    siteName: "Disburs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disburs: Payroll That Thinks",
    description:
      "Not a payout API. An autonomous AI agent that reads contracts, clears routine exceptions, and keeps payroll private with zero-knowledge proofs.",
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

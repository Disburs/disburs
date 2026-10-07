import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import WaitlistModal from "@/components/WaitlistModal";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0e1a14] focus:text-[#12ff80] focus:rounded-full focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#12ff80] text-sm font-medium transition"
        >
          Skip to content
        </a>
        <Providers>
          {children}
          <WaitlistModal />
        </Providers>
      </body>
    </html>
  );
}

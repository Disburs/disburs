import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import WaitlistModal from "@/components/WaitlistModal";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://disburs.xyz"),
  title: "Disburs: Stablecoin Payroll",
  description:
    "Stablecoin payroll for global teams. Fund a treasury in USDC on Stellar, run payroll, invoices and milestones, and approve before anything settles. An agent prepares each run, and salaries stay private.",
  keywords: [
    "stablecoin payroll",
    "USDC payroll",
    "payroll",
    "African contractors",
    "Stellar",
    "USDC",
    "AI agent",
    "crypto payroll",
    "remote payments",
  ],
  openGraph: {
    title: "Disburs: Stablecoin Payroll",
    description:
      "Stablecoin payroll for global teams: fund a treasury in USDC on Stellar, approve each run, and every contractor is paid in seconds. Salaries stay private.",
    url: "https://disburs.xyz",
    siteName: "Disburs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disburs: Stablecoin Payroll",
    description:
      "Stablecoin payroll for global teams: fund a treasury in USDC on Stellar, approve each run, and every contractor is paid in seconds. Salaries stay private.",
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
        <Providers>
          {children}
          <WaitlistModal />
        </Providers>
      </body>
    </html>
  );
}

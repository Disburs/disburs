import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import WaitlistModal from "@/components/WaitlistModal";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://disburs.io"),
  title: "Disburs: Private Global Payroll",
  description:
    "Global payroll that keeps every salary private. Disburs prepares each run for your approval and pays contractors in USDC on Stellar.",
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
    title: "Disburs: Private Global Payroll",
    description:
      "Global payroll that keeps every salary private. Approve each run and pay contractors in USDC on Stellar.",
    url: "https://disburs.io",
    siteName: "Disburs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disburs: Private Global Payroll",
    description:
      "Global payroll that keeps every salary private. Approve each run and pay contractors in USDC on Stellar.",
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

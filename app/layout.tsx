import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://disburs.io"),
  title: "Disburs: Payroll That Thinks",
  description:
    "Disburs is an autonomous AI agent that reads your contracts, settles disputes, times the FX window, and pays your contractors on Stellar. Not automation. An agent.",
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
      "Not automation. An autonomous AI agent that reads contracts, resolves disputes, and pays contractors on Stellar.",
    url: "https://disburs.io",
    siteName: "Disburs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disburs: Payroll That Thinks",
    description:
      "Not automation. An autonomous AI agent that reads contracts, resolves disputes, and pays contractors on Stellar.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

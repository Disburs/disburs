import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://disburs.io"),
  title: "Disburs: The Payroll Agent for Africa",
  description:
    "Disburs is an AI payroll agent that reads your contracts, calculates what every contractor is owed, picks the best exchange rate, and pays your entire African team via Stellar, automatically.",
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
    title: "Disburs: The Payroll Agent for Africa",
    description:
      "An autonomous AI payroll agent that pays African remote contractors via the Stellar blockchain.",
    url: "https://disburs.io",
    siteName: "Disburs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disburs: The Payroll Agent for Africa",
    description:
      "An autonomous AI payroll agent that pays African remote contractors via the Stellar blockchain.",
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

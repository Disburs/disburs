import type { Metadata } from "next";
import ContractorShell from "@/components/contractor/ContractorShell";

export const metadata: Metadata = {
  title: "Disburs — Contractor",
  robots: { index: false, follow: false },
};

export default function ContractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContractorShell>{children}</ContractorShell>;
}

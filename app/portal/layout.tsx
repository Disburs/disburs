import type { Metadata } from "next";
import PortalShell from "@/components/portal/PortalShell";

export const metadata: Metadata = {
  title: "Disburs — Employer Portal",
  robots: { index: false, follow: false },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalShell>{children}</PortalShell>;
}

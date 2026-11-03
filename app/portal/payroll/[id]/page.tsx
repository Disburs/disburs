"use client";

import { use } from "react";
import PayrollDetail from "@/components/portal/payroll/PayrollDetail";

export default function PayrollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <PayrollDetail id={id} />;
}

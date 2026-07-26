// Simulated data for the contractor portal demo. No backend.

export const contractor = {
  name: "Laycon Okonkwo",
  firstName: "Laycon",
  initials: "CO",
  email: "Laycon@northwind.studio",
  phone: "+234 802 •••• 41",
  country: "Nigeria",
  flag: "🇳🇬",
  currency: "NGN",
  rate: 1618, // 1 USDC = 1,618 NGN
  balance: 1200, // USDC
  employer: "Northwind Studios",
};

export type Payment = {
  date: string;
  amount: number;
  company: string;
  status: "Received" | "Converted";
};

export const payments: Payment[] = [
  { date: "Nov 1, 2026", amount: 1200, company: "Northwind Studios", status: "Received" },
  { date: "Oct 1, 2026", amount: 900, company: "Northwind Studios", status: "Converted" },
  { date: "Sep 1, 2026", amount: 900, company: "Northwind Studios", status: "Converted" },
  { date: "Aug 1, 2026", amount: 900, company: "Northwind Studios", status: "Converted" },
];

export type Cashout = {
  date: string;
  usdc: number;
  local: number;
  currency: string;
  method: string;
  status: "Completed";
};

export const cashouts: Cashout[] = [
  { date: "Oct 2, 2026", usdc: 900, local: 1456200, currency: "NGN", method: "GTBank •••• 4821", status: "Completed" },
  { date: "Sep 3, 2026", usdc: 900, local: 1449000, currency: "NGN", method: "OPay wallet", status: "Completed" },
];

export const companies = ["Northwind Studios", "Lumen Labs"];

export const destinations = [
  { id: "gtb", label: "GTBank", detail: "•••• 4821", type: "Bank account" },
  { id: "opay", label: "OPay", detail: "+234 802 •••• 41", type: "Mobile money" },
];

export function ngn(n: number) {
  return n.toLocaleString("en-US");
}

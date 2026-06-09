// Simulated data for the employer portal demo. No backend — everything here
// is static mock data used to illustrate how the product would feel.

export type ContractorStatus =
  | "Active"
  | "Pending KYC"
  | "Wallet unverified"
  | "Contract missing";

export type Contractor = {
  id: string;
  name: string;
  initials: string;
  email: string;
  country: string;
  flag: string;
  role: string;
  rate: string;
  rateType: "monthly" | "hourly";
  lastPaid: string | null;
  status: ContractorStatus;
  wallet: string;
  walletStatus: "Verified" | "Unverified";
  agentLast: string;
  amount: number;
};

export const company = {
  name: "Northwind Studios",
  plan: "Growth",
  initials: "NS",
  contact: "Collins Christopher",
  balance: 9800,
};

export const contractors: Contractor[] = [
  {
    id: "chidi",
    name: "Chidi Okonkwo",
    initials: "CO",
    email: "chidi@northwind.studio",
    country: "Nigeria",
    flag: "🇳🇬",
    role: "Product Designer",
    rate: "$900 / mo",
    rateType: "monthly",
    lastPaid: "Nov 1, 2026",
    status: "Active",
    wallet: "GAJK…7QF2",
    walletStatus: "Verified",
    agentLast: "Added $300 milestone bonus · Nov 1",
    amount: 1200,
  },
  {
    id: "amara",
    name: "Amara Njoroge",
    initials: "AN",
    email: "amara@northwind.studio",
    country: "Kenya",
    flag: "🇰🇪",
    role: "Frontend Engineer",
    rate: "$1,200 / mo",
    rateType: "monthly",
    lastPaid: "Nov 1, 2026",
    status: "Active",
    wallet: "GBQW…3LMN",
    walletStatus: "Verified",
    agentLast: "Verified new wallet address · Oct 29",
    amount: 1200,
  },
  {
    id: "bola",
    name: "Bola Adewale",
    initials: "BA",
    email: "bola@northwind.studio",
    country: "Nigeria",
    flag: "🇳🇬",
    role: "Project Manager",
    rate: "$760 / mo",
    rateType: "monthly",
    lastPaid: "Nov 1, 2026",
    status: "Active",
    wallet: "GCTR…9XK1",
    walletStatus: "Verified",
    agentLast: "Resolved overtime dispute, paid +$360 · Nov 1",
    amount: 1120,
  },
  {
    id: "kwame",
    name: "Kwame Mensah",
    initials: "KM",
    email: "kwame@northwind.studio",
    country: "Ghana",
    flag: "🇬🇭",
    role: "Backend Engineer",
    rate: "$32 / hr",
    rateType: "hourly",
    lastPaid: "Nov 1, 2026",
    status: "Active",
    wallet: "GDLP…2WQ8",
    walletStatus: "Verified",
    agentLast: "Paid 160 logged hours · Nov 1",
    amount: 1280,
  },
  {
    id: "thabo",
    name: "Thabo Nkosi",
    initials: "TN",
    email: "thabo@northwind.studio",
    country: "South Africa",
    flag: "🇿🇦",
    role: "QA Engineer",
    rate: "$880 / mo",
    rateType: "monthly",
    lastPaid: "Nov 1, 2026",
    status: "Active",
    wallet: "GEFН…5RT3",
    walletStatus: "Verified",
    agentLast: "Paid · Nov 1",
    amount: 880,
  },
  {
    id: "emeka",
    name: "Emeka Obi",
    initials: "EO",
    email: "emeka@northwind.studio",
    country: "Nigeria",
    flag: "🇳🇬",
    role: "Mobile Engineer",
    rate: "$1,150 / mo",
    rateType: "monthly",
    lastPaid: "Nov 1, 2026",
    status: "Active",
    wallet: "GFKM…8VB6",
    walletStatus: "Verified",
    agentLast: "Paid · Nov 1",
    amount: 1150,
  },
  {
    id: "wanjiru",
    name: "Wanjiru Kamau",
    initials: "WK",
    email: "wanjiru@northwind.studio",
    country: "Kenya",
    flag: "🇰🇪",
    role: "Data Analyst",
    rate: "$820 / mo",
    rateType: "monthly",
    lastPaid: "Oct 1, 2026",
    status: "Contract missing",
    wallet: "GHQP…1ND4",
    walletStatus: "Verified",
    agentLast: "Requested contract upload · Nov 2",
    amount: 820,
  },
  {
    id: "zanele",
    name: "Zanele Dlamini",
    initials: "ZD",
    email: "zanele@northwind.studio",
    country: "South Africa",
    flag: "🇿🇦",
    role: "Content Strategist",
    rate: "$700 / mo",
    rateType: "monthly",
    lastPaid: null,
    status: "Pending KYC",
    wallet: "—",
    walletStatus: "Unverified",
    agentLast: "Awaiting KYC documents · Nov 3",
    amount: 700,
  },
  {
    id: "kofi",
    name: "Kofi Asante",
    initials: "KA",
    email: "kofi@northwind.studio",
    country: "Ghana",
    flag: "🇬🇭",
    role: "DevOps Engineer",
    rate: "$1,300 / mo",
    rateType: "monthly",
    lastPaid: null,
    status: "Wallet unverified",
    wallet: "GJRT…4PL9",
    walletStatus: "Unverified",
    agentLast: "Sent wallet verification request · Nov 3",
    amount: 1300,
  },
];

export type Activity = {
  icon:
    | "check"
    | "dispute"
    | "fx"
    | "shield"
    | "bell"
    | "file"
    | "wallet";
  text: string;
  time: string;
};

export const activityFeed: Activity[] = [
  {
    icon: "check",
    text: "Paid 7 contractors $7,180 in a single Stellar transaction.",
    time: "2 hours ago",
  },
  {
    icon: "dispute",
    text: "Resolved Bola's overtime dispute, verified 4 hrs on ticket #2847 and paid an extra $360.",
    time: "5 hours ago",
  },
  {
    icon: "fx",
    text: "Locked FX at 1,618 NGN/USDC, the best rate in 6 days.",
    time: "6 hours ago",
  },
  {
    icon: "shield",
    text: "Verified Amara's new wallet address after a low-risk change.",
    time: "Yesterday",
  },
  {
    icon: "bell",
    text: "Flagged a low balance and recommended a $2,600 top-up before Dec 1.",
    time: "2 days ago",
  },
];

export type PayrollRun = {
  id: string;
  date: string;
  total: number;
  count: number;
  status: "Completed" | "Processing";
  tx: string;
};

export const payrollRuns: PayrollRun[] = [
  { id: "run-nov", date: "Nov 1, 2026", total: 7180, count: 7, status: "Completed", tx: "GADT…K39P" },
  { id: "run-oct", date: "Oct 1, 2026", total: 11580, count: 9, status: "Completed", tx: "GBQ7…2MZL" },
  { id: "run-sep", date: "Sep 1, 2026", total: 10210, count: 8, status: "Completed", tx: "GCLP…8WX4" },
  { id: "run-aug", date: "Aug 1, 2026", total: 9860, count: 8, status: "Completed", tx: "GDRM…5TQ9" },
];

export const nextPayroll = {
  date: "Dec 1, 2026",
  total: 12180,
  count: 9,
  status: "Needs approval" as const,
};

// Lines for the upcoming payroll run (screen 9)
export type PayrollLine = {
  id: string;
  name: string;
  initials: string;
  flag: string;
  country: string;
  basis: string;
  rate: string;
  amount: number;
  wallet: "Verified" | "Unverified";
  flag_note?: { type: "warn" | "bonus"; text: string };
};

export const payrollLines: PayrollLine[] = [
  {
    id: "chidi",
    name: "Chidi Okonkwo",
    initials: "CO",
    flag: "🇳🇬",
    country: "Nigeria",
    basis: "Monthly salary",
    rate: "$900",
    amount: 1200,
    wallet: "Verified",
    flag_note: { type: "bonus", text: "$300 milestone bonus triggered by contract clause" },
  },
  {
    id: "amara",
    name: "Amara Njoroge",
    initials: "AN",
    flag: "🇰🇪",
    country: "Kenya",
    basis: "Monthly salary",
    rate: "$1,200",
    amount: 1200,
    wallet: "Verified",
  },
  {
    id: "bola",
    name: "Bola Adewale",
    initials: "BA",
    flag: "🇳🇬",
    country: "Nigeria",
    basis: "Monthly + overtime",
    rate: "$760",
    amount: 1120,
    wallet: "Verified",
    flag_note: { type: "bonus", text: "+$360 overtime verified on ticket #2847" },
  },
  {
    id: "kwame",
    name: "Kwame Mensah",
    initials: "KM",
    flag: "🇬🇭",
    country: "Ghana",
    basis: "160 hrs @ $32/hr",
    rate: "$32/hr",
    amount: 1280,
    wallet: "Verified",
    flag_note: { type: "warn", text: "Capped at 40 hrs/week — logged 52, paying 40" },
  },
  {
    id: "thabo",
    name: "Thabo Nkosi",
    initials: "TN",
    flag: "🇿🇦",
    country: "South Africa",
    basis: "Monthly salary",
    rate: "$880",
    amount: 880,
    wallet: "Verified",
  },
  {
    id: "emeka",
    name: "Emeka Obi",
    initials: "EO",
    flag: "🇳🇬",
    country: "Nigeria",
    basis: "Monthly salary",
    rate: "$1,150",
    amount: 1150,
    wallet: "Verified",
  },
  {
    id: "wanjiru",
    name: "Wanjiru Kamau",
    initials: "WK",
    flag: "🇰🇪",
    country: "Kenya",
    basis: "Monthly salary",
    rate: "$820",
    amount: 820,
    wallet: "Verified",
    flag_note: { type: "warn", text: "Contract not on file — amount from last cycle" },
  },
];

// FX rates by country (indicative)
export const fxRates: Record<string, { code: string; rate: number; flag: string }> = {
  Nigeria: { code: "NGN", rate: 1618, flag: "🇳🇬" },
  Kenya: { code: "KES", rate: 129, flag: "🇰🇪" },
  Ghana: { code: "GHS", rate: 15.5, flag: "🇬🇭" },
  "South Africa": { code: "ZAR", rate: 18.2, flag: "🇿🇦" },
};

export const fundingHistory = [
  { date: "Nov 28, 2026", method: "Bank transfer (Cowrie)", amount: 5000 },
  { date: "Oct 27, 2026", method: "USDC deposit", amount: 8000 },
  { date: "Sep 29, 2026", method: "Card (Flutterwave)", amount: 4500 },
];

export const WALLET_ADDRESS =
  "GА7QF2KJ9XPLMN3WQ8RT5VB6ND4PL9ZJRTK39PXQ2M";

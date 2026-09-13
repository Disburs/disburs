/**
 * The recurring example payees shown across the landing page (hero run,
 * payment proof, payout ledger). Fictional names on placeholder photos.
 */
export type Person = {
  name: string;
  short: string;
  place: string;
  currency: string;
  avatar: string;
};

export const PEOPLE: Person[] = [
  { name: "Kwabena Mensah", short: "K. Mensah", place: "Accra, GH", currency: "GHS", avatar: "/avatars/kwabena.jpg" },
  { name: "Thabo Nkosi", short: "T. Nkosi", place: "Cape Town, ZA", currency: "ZAR", avatar: "/avatars/thabo.jpg" },
  { name: "Wanjiru Kamau", short: "W. Kamau", place: "Nairobi, KE", currency: "KES", avatar: "/avatars/fatou.jpg" },
];

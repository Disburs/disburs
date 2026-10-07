# Disburs

Privacy-preserving, autonomous global payroll on Stellar and USDC — marketing
site and product simulation for **disburs.io**.

Disburs reads your contracts, calculates what every contractor is owed, picks
the best exchange rate, and pays your global team in USDC via the Stellar
network — automatically, with every run waiting for your approval.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** + a Playfair Display and Archivo design system (mint `#12FF80` accent)
- **Framer Motion** for subtle motion
- **Lucide** icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## What's in here

### 1. Marketing landing page — `/`

A single-scroll site: hero (with a live payroll dashboard mock), the problem,
how it works, a natural-language agent chat, a "real agency" demo, features,
who we serve, pricing, trust, security, an interactive USDC→local FX converter,
and an FAQ. The waitlist form posts to `/api/waitlist`.

### 2. Employer portal — `/portal` *(simulated)*

A fully mocked product walkthrough — sidebar app shell with Dashboard, Agent
Chat, Contractors, Add/Edit contractor, Payroll Run, Payment History, Wallet &
Funding, and Agent Settings. Employer onboarding lives at `/onboarding`.

### 3. Contractor portal — `/contractor` *(simulated)*

A simpler web portal for contractors with no crypto knowledge: onboarding,
dashboard, agent messages/disputes, and cash-out.

> **Note:** the `/portal`, `/onboarding`, and `/contractor` areas are
> **demo simulations** — no backend, no real API calls, all state-driven mock
> data. They exist to illustrate how the product would feel and can be removed
> cleanly by deleting `app/portal`, `app/onboarding`, `app/contractor`,
> `components/portal`, `components/contractor`, `lib/mock.ts`, and
> `lib/contractor.ts` (plus the "Employer portal demo" link in the footer).

## Project structure

```
app/
  page.tsx            Landing page
  waitlist/           Waitlist capture + /api/waitlist route
  onboarding/         Employer onboarding wizard (simulated)
  portal/             Employer portal screens (simulated)
  contractor/         Contractor portal screens (simulated)
components/
  landing/            Marketing sections
  portal/             Employer shell + UI primitives
  contractor/         Contractor shell
lib/
  mock.ts             Employer mock data
  contractor.ts       Contractor mock data
```

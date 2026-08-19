# StoreParda — Project Constitution

**Version:** 1.0.0 · **Ratified:** 2026-08-18 · **Status:** Active

This document is the source of truth for how StoreParda is built. Any human contributor
or AI coding agent (Claude Code, etc.) working on this repo MUST read this file first and
treat it as binding. Decisions here were made deliberately, after weighing alternatives —
do not silently override them mid-task. If a principle needs to change, amend this file
explicitly (see §8), don't drift from it in a pull request.

---

## 0. Product Identity

|                         |                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**                | StoreParda                                                                                                                                                                                                                                                                                                                                        |
| **Spelling**            | `Parda` (from Hindi/Urdu _पर्दा_ / پردہ — "curtain, veil, reveal"). **NEVER** `Parada` — that spelling collides phonetically with the Prada trademark (confirmed: PRADA S.A. has litigated over marks as distant as "RADA"). Any AI agent encountering "Parada" in a prompt, ticket, or comment should treat it as a typo and correct to "Parda". |
| **Domain**              | `storeparda.in`                                                                                                                                                                                                                                                                                                                                   |
| **Target market**       | Independent cloth/garment retail stores in India (v1 only — see §2.II)                                                                                                                                                                                                                                                                            |
| **Core differentiator** | The Purchase-Trip module — landed-cost tracking for owners who travel to source stock (Surat, Kerala, Bangladesh, etc.) before it ever reaches the shop                                                                                                                                                                                           |
| **Brand colors**        | Green `#2FBF71` · Lavender `#7B7FE0`                                                                                                                                                                                                                                                                                                              |
| **Tagline**             | "వస్త్ర దుకాణాల ఆపరేటింగ్ సిస్టమ్" / "Cloth store operating system"                                                                                                                                                                                                                                                                               |
| **Trademark status**    | ⚠️ India Trademark Registry search (class 9 + 35 + 42) **not yet completed** as of ratification. Do not proceed to public launch until this is closed out with a lawyer.                                                                                                                                                                          |

---

## 1. Who This Is Built By, And Under What Constraints

- Built solo by a full-time employed React.js developer, nights and weekends, alongside
  a demanding job and an active green card process. Realistic capacity: **~10 hours/week**.
- Total budget ceiling: **₹15–20 lakh over 3 years**. Recurring infra cost must stay near
  **$45/month** (Supabase Pro $25 + Vercel Pro $20) plus incidental domain/legal fees.
- **IP separation is non-negotiable.** All code is written on personal hardware, personal
  accounts, outside employer working hours. The business entity, when formed, is registered
  under a co-founder who is not bound by the developer's employment contract. No commits,
  no cloud resources, no dependencies should ever touch employer-owned infrastructure.
- The first customers are two family-run pilot stores (Nellore, Tirupati) — free,
  low-stakes, high-trust testing ground before any external sale.

---

## 2. Core Principles

### I. Offline-First, From Day One

Billing at a physical counter must never fail because the internet dropped. This was
debated and reversed once already (see §8 changelog) — the final decision is: **build
the offline sync layer (Dexie.js + Supabase push/pull) as part of the initial release**,
not as a post-launch add-on. Every write path (invoice creation, stock movement) must go
through local storage first, sync second.

### II. Cloth-Store Focus — No Premature Horizontal Expansion

This product is being built for cloth/garment retailers. Jewelry, furniture, and other
"travel-to-source" verticals were discussed and explicitly deferred. Do not add
vertical-specific fields, flows, or copy for other industries until v1 has validated
product-market fit in cloth retail with real paying customers. If expansion ever happens,
it happens as a deliberate rebrand decision, not a scope-creep accident.

### III. Open-Source Only, No License Fees

Every library in the stack must be permissively licensed (MIT, Apache 2.0, ISC, BSD).
No paid SDKs, no per-seat proprietary tooling. The only recurring costs allowed are
infrastructure (Supabase, Vercel, domain) and, later, the Claude API — never software
licenses. See §4 for the locked dependency list; check license before adding anything new.

### IV. The Purchase-Trip Module Is Not Optional

Barcode, GST billing, size/color inventory — every competitor already has these
(Ginesys, GoFrugal, QueueBuster, Zwing, Vyapar). They are table stakes, not the reason
anyone switches. The Purchase-Trip → Landed-Cost → MRP flow is the one thing no
competitor offers. If time runs short, cut AI Studio, cut advanced reports — **never**
cut or under-invest in this module.

### V. Test the Money Logic

Two pieces of business logic touch money directly and must have unit test coverage
before anything ships to a real store:

1. **GST slab calculation** (`lib/gstCalc.ts`) — ₹2,500 per-piece threshold, including the
   discount-drops-price-below-threshold edge case.
2. **Landed cost calculation** (`lib/landedCost.ts`) — trip expenses distributed across lots.

A bug here either overcharges a customer (trust destroyed instantly) or misprices stock
(silent margin erosion the owner won't notice for months). No exceptions.

### VI. Ship The Thinnest Slice That Proves The Model

Scope for v1 (P1) is deliberately narrow: Purchase Trips, Inventory + Barcode, Billing +
GST, basic Reports, Settings. AI Studio (Claude-powered descriptions, video scripts, review
summarization), loyalty programs, and multi-store chain features are P2 — built only after
the Nellore/Tirupati pilot generates real usage data and a real feature request list.

### VII. No Store Prefix, No Generic Names — But Don't Re-litigate Naming

The name is StoreParda. The logo reuses the awning icon and green/lavender palette
established for the earlier "StoreNode" concept. This decision is closed — do not
reopen it casually; naming churn has already cost real time in this project's history
(see §8).

### VIII. Budget and Time Are Both Hard Constraints

Every module estimate in §5 assumes a 10 hr/week solo pace. Before adding any feature
not listed in the P1 backlog, ask: does this delay the Nellore/Tirupati pilot? If yes,
it does not belong in v1.

---

## 3. Non-Goals for v1 (Explicitly Out of Scope)

- ❌ React Native mobile app (deferred until PWA validates the model; revisit once
  revenue justifies the native-app investment — see §8 for the reasoning trail)
- ❌ AI Studio (Claude-powered video scripts, review collection, trend analysis)
- ❌ Multi-vertical support (jewelry, furniture, footwear)
- ❌ Loyalty programs, staff commission tracking
- ❌ Multi-store chain / franchise features beyond basic multi-store data isolation
- ❌ Payment gateway integration beyond recording payment mode (cash/UPI/card) —
  no card data storage, no PCI scope, ever

---

## 4. Tech Stack (Locked)

| Layer                    | Choice                                                        | License    |
| ------------------------ | ------------------------------------------------------------- | ---------- |
| Build tool               | Vite + React 18 + TypeScript                                  | MIT        |
| PWA                      | `vite-plugin-pwa` (Workbox)                                   | MIT        |
| Styling                  | Tailwind CSS                                                  | MIT        |
| Offline DB               | Dexie.js (IndexedDB)                                          | Apache 2.0 |
| Data/sync                | TanStack Query                                                | MIT        |
| Routing                  | React Router v6                                               | MIT        |
| Forms/validation         | React Hook Form + Zod                                         | MIT        |
| Backend                  | Supabase (Postgres, Auth, Storage, Edge Functions)            | Apache 2.0 |
| Barcode generation       | JsBarcode (Code128)                                           | MIT        |
| Receipt print (fallback) | `react-to-print` (browser print dialog)                       | MIT        |
| Receipt print (direct)   | `esc-pos-encoder` + Web Bluetooth API                         | MIT        |
| Icons                    | Lucide React                                                  | ISC        |
| Testing                  | Vitest + React Testing Library                                | MIT        |
| Package manager          | pnpm                                                          | MIT        |
| Hosting                  | Vercel Pro ($20/mo — required once commercial per Vercel ToS) | —          |
| Backend infra            | Supabase Pro ($25/mo)                                         | —          |

**Known platform constraints (verified 2026):**

- Web Bluetooth API: works on Android Chrome, Desktop Chrome/Edge. **Does not work on
  iOS Safari** (Apple has stated no plans to implement). Target market is
  overwhelmingly Android — accepted risk.
- BarcodeDetector API (camera scanning): full support on Android Chrome only, partial
  on desktop Chrome, none on Safari. **Primary barcode input method is a hardware HID
  scanner** (₹2,000–4,000), which bypasses all browser API limitations entirely —
  camera scanning is a fallback only.

---

## 5. Module Roadmap (Reference: full backlog in `storeparda-techstack-tasks.html`)

| Module    | Scope                                                | Est. hours                                                 |
| --------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| M0        | Project foundation, PWA config, CI                   | 8                                                          |
| M1        | Supabase schema, RLS, Auth (phone OTP)               | 18                                                         |
| M2        | **Offline sync engine** (Dexie ⇄ Supabase push/pull) | 62                                                         |
| M3        | Inventory, variant matrix, barcode                   | 36                                                         |
| M4        | **Purchase-Trip module** (landed cost engine)        | 52                                                         |
| M5        | Billing/POS, GST calc, printing                      | 58                                                         |
| M6        | GST reports, GSTR export                             | 24                                                         |
| M7        | Settings, onboarding                                 | 16                                                         |
| M8        | PWA polish, offline UX, shadow-mode pilot test       | 30                                                         |
| M9        | Launch prep                                          | 16                                                         |
| **Total** |                                                      | **320 hrs (~32 weeks @ 10 hr/wk, ~9–10 months w/ buffer)** |

**Sequencing rule:** M2 must be stable and tested before M3, M4, or M5 begin in earnest.
Building inventory/billing/trip features on top of an unstable sync layer means rework
later — the foundation is not allowed to be "good enough for now."

---

## 6. Architecture Rules

- **Invoice numbering:** `{store_code}-{device_id}-{local_sequence}` — generated
  client-side, never a central counter. Central counters break under offline
  concurrent writes from multiple devices.
- **Every Supabase table** carries `last_modified_at` and `deleted_at` (soft delete).
  No hard deletes in sync-participating tables — ever.
- **Conflict resolution:** last-write-wins by `last_modified_at`. No manual merge UI in v1.
- **Dexie tables mirror Supabase tables** with two additions: `_dirty` (pending push) and
  `_localId` (optimistic UI before server ID is assigned).
- **Region:** Supabase project pinned to `ap-south-1` (Mumbai) for latency to Indian stores.

---

## 7. Definition of Done (per module)

A module is not "done" until:

1. Unit tests pass for any money-touching logic (§2.V)
2. It works correctly with the network disabled (offline-first is not optional per-module)
3. It has been manually tested at 375px viewport width (billing counters use small
   Android tablets/phones)
4. Sync round-trip verified: create offline → reconnect → confirm data on Supabase side

---

## 8. Governance & Amendment Log

This constitution may be amended, but not casually. An amendment requires:

1. A clear reason tied to real evidence (pilot data, a blocked technical path, a
   changed constraint like budget or timeline) — not a mid-session change of mind.
2. An entry in this changelog explaining what changed and why.

### Changelog

- **2026-08-18 — v1.0.0 ratified.** Consolidated decisions from planning discussion:
  name (StoreParda, correcting the Parada/Prada collision risk), tech stack, offline-first
  reversal (initially deferred to post-pilot, then reversed to offline-from-start per
  founder's explicit instruction), PWA-only launch (React Native deferred — founder's
  primary skill is React.js, not React Native; native app revisited only after PWA
  validates demand).

---

## 9. For AI Coding Agents

If you are Claude Code (or any other AI agent) working in this repository:

- Do not introduce a proprietary or non-open-source dependency without flagging it
  explicitly to the human first (§2.III).
- Do not build features from §3 (Non-Goals) even if asked casually in passing — confirm
  explicitly that scope has changed and this file has been amended first.
- Do not weaken GST calculation or landed-cost logic test coverage to "make tests pass
  faster" (§2.V) — if a test is inconvenient, the code is wrong, not the test.
- When in doubt about a naming, branding, or scope question already decided here,
  cite this file rather than re-deriving an answer from scratch.

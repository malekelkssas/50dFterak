# Milestone v1.0 — Project Summary

**Generated:** 2026-04-09  
**Purpose:** Team onboarding and project review

---

## 1. Project Overview

**Fterak50d** is a **React Native** bakery **management** app for a single operator, in an **Nx** monorepo (`pnpm`). It tracks **customers (users)**, **orders** (flour amounts by date, tied to a user), and related workflows (e.g. invoices UI). The product is **operator-first**; end-customer ordering and Convex migration are explicitly **out of scope** for this milestone.

**Core value:** **Reliable day-to-day bakery operations on the phone** — including **money clarity**: each order’s **total is fixed at creation time** from a **global per-kilogram price** stored in Realm, so **history stays trustworthy** when the global price changes.

**Milestone status:** Phases **1** (data layer) and **2** (operator UI) are **complete** and verified. **Phase 3** (release discipline — documented bump workflow and tagging habit) was **in progress**; the **1.1.0** version bump and **`v1.1.0`** git tag close the essential **REL-01 / REL-02** intent for this shippable slice (formal plan checkboxes in `ROADMAP.md` may still be updated separately).

---

## 2. Architecture & Technical Decisions

- **Decision:** Single **global per-kg price** for v1 (no per-product tiers).  
  **Why:** Simplest operator model; matches product choice.  
  **Phase:** Roadmap / Phase 1 context.

- **Decision:** **`OrgSettings`** Realm model as a **singleton** (`_id === 'singleton'`) for bakery-wide settings.  
  **Why:** One logical org; room for future org-level fields without coupling to `User` / `Order`.  
  **Phase:** Phase 1 (D-01, D-02).

- **Decision:** On **order creation**, persist **`snapshotPricePerKg`** and **`snapshotTotal`** (`double`); **no writes** to those fields after create; **service guards** on other mutations.  
  **Why:** Immutable snapshots satisfy PRICE-03 / ORD-01 / ORD-02 and accounting trust.  
  **Phase:** Phase 1 (D-03, D-04).

- **Decision:** **Legacy orders** (pre–schema-v4): snapshot fields default to **`0`** in migration; UI shows **formatted zero**, not live recomputation.  
  **Why:** v1 simplicity; explicit policy in `01-LEGACY-ORDERS.md` (ORD-04 / D-05).  
  **Phase:** Phase 1.

- **Decision:** **Half-up** rounding to **two decimal places** for stored totals (dedicated utility where applicable).  
  **Why:** Consistent currency-style totals.  
  **Phase:** Phase 1–2 implementation.

- **Decision:** **Dedicated screen** (`GlobalFlourPriceScreen`) for global price; **read/write only via `orgSettingsService`** (no shadow Realm state in UI).  
  **Why:** PRICE-01 / PRICE-02; single source of truth.  
  **Phase:** Phase 2 (D-01–D-03).

- **Decision:** Order money on **`OrderCard`** / user order flows uses **`PlainOrder.snapshotTotal` / `snapshotPricePerKg` only** — never `flourAmount ×` current global price.  
  **Why:** ORD-03; legacy zeros formatted, not recomputed (D-04–D-06).  
  **Phase:** Phase 2.

- **Decision:** **Bilingual** operator copy and **ar-EG**-style money formatting per UI spec.  
  **Why:** Consistency with existing app (`PRICING_STRINGS`, `formatSnapshotMoney`).  
  **Phase:** Phase 2 (D-07).

**Stack (summary):** Realm, Redux + persistence, React Navigation, NativeWind, Android-focused RN app under `apps/MOBILE`. Details: `.planning/codebase/STACK.md`.

---

## 3. Phases Delivered

| Phase | Name                             | Status                        | One-liner                                                                                                                                                    |
| ----- | -------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1     | Pricing & snapshots (data layer) | Complete                      | Realm v4: `OrgSettings` singleton, `Order` snapshot fields, migration, `OrgSettingsService`, `addOrder` writes snapshots + guards, legacy policy documented. |
| 2     | Operator UI                      | Complete                      | Global flour price screen + navigation; `OrderCard` shows snapshot money via `formatSnapshotMoney`; no live global recompute on lists.                       |
| 3     | Release discipline               | In progress → partial closure | Semver on root + `apps/MOBILE`, git tag **`v1.1.0`** for this release; optional follow-up: formalize scripts/checklist in plans 03-01 / 03-02.               |

**Plan-level highlights:**

- **01-01:** OrgSettings + Order snapshot doubles + Realm v4 migration.
- **01-02:** OrgSettingsService, snapshots on create, PlainOrder + immutability guards.
- **01-03:** ORD-04 legacy doc + verification audit.
- **02-01:** Global price screen, strings, navigation from Home.
- **02-02:** Formatters + OrderCard snapshot lines.

---

## 4. Requirements Coverage

Aligned with **verified** phase reports and **`PROJECT.md`** (some checkboxes in `.planning/REQUIREMENTS.md` may lag the doc).

- **PRICE-01 / PRICE-02 / PRICE-03:** Met (operator UI + immutable snapshots on existing orders).
- **ORD-01 / ORD-02 / ORD-03:** Met (snapshots at create; list/detail from snapshots).
- **ORD-04:** Met (documented legacy `0` policy and UI behavior).
- **REL-01 / REL-02:** **Partially met** by this release (version bump **1.1.0** + tag **`v1.1.0`**); optional: add scripted bump doc per Phase 3 plans.

**Audit file:** No `v1.0-MILESTONE-AUDIT.md` was present in `.planning/` at summary generation time.

---

## 5. Key Decisions Log

| ID        | Description                                                 | Phase |
| --------- | ----------------------------------------------------------- | ----- |
| D-01      | `OrgSettings` singleton for org-level settings              | 1     |
| D-02      | Default global price `0`; seed/migrate as needed            | 1     |
| D-03      | Snapshots at create; no post-create mutation                | 1     |
| D-04      | `double` for money fields                                   | 1     |
| D-05      | Legacy orders: snapshot fields `0`; UI shows formatted zero | 1     |
| D-01      | Dedicated pricing screen; service-only persistence          | 2     |
| D-02      | Update price without creating an order                      | 2     |
| D-03      | Discoverable entry (e.g. Home → screen)                     | 2     |
| D-04–D-06 | Snapshot-only money on order rows; no live recompute        | 2     |
| D-07      | UI-SPEC: a11y, bilingual strings, formatting                | 2     |

---

## 6. Tech Debt & Deferred Items

- **Testing:** No RN unit/E2E suite yet; quality via TypeScript check, lint, and manual/device steps (see `.planning/codebase/TESTING.md`).
- **Phase 3 docs:** Plans **03-01** / **03-02** (scripted bump workflow, push checklist) can still be written for repeatability.
- **Product / backend:** Convex migration, consumer ordering, per-category pricing — **deferred** (see `PROJECT.md` / `REQUIREMENTS.md` v2).
- **REQUIREMENTS.md:** Consider syncing checkbox state with `PROJECT.md` validated list to avoid confusion.

**Retrospective:** No `.planning/RETROSPECTIVE.md` was present.

---

## 7. Getting Started

- **Run the app:** From repo root, `pnpm install` then `pnpm run start:MOBILE`; Android builds via `pnpm run android:build-debug` / install scripts in root `package.json`.
- **Key directories:** `apps/MOBILE/` (screens, navigation, backend Realm/services), `apps/MOBILE/backend/` (models, `realm.ts`, services), `.planning/codebase/` (architecture map).
- **Tests:** No automated MOBILE test target; use `pnpm exec tsc -p apps/MOBILE/tsconfig.json --noEmit`, `pnpm run lint`, and device smoke (pricing screen + order list).
- **Where to look first:** `OrderService.addOrder`, `OrgSettingsService`, `realmHelpers` / `PlainOrder`, `GlobalFlourPriceScreen`, `OrderCard`, `navigation/index.tsx`.

---

## Stats

- **Timeline:** 2026-04-09 (milestone execution concentrated on this date)
- **Phases complete:** 2 / 3 (Phase 3 partially satisfied by release tagging)
- **Commits** (from first `.planning/phases/` commit through release prep): **19**
- **Files changed (approx. range):** **38** files, **+2087 / -61** lines
- **Contributors:** malekelkssas

_Git range used: `a48eb53` (first phase tree) .. `HEAD` at summary generation._

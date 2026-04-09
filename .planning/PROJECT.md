# Fterak50d (bakery management)

## What This Is

A **React Native** bakery **management** app for a single operator (your friend), living in an **Nx** monorepo. It tracks **customers (users)**, **orders** (flour amounts by date, tied to a user), and related workflows (e.g. invoices UI). The product is **operator-first**; **end-customer ordering** is a possible future direction, not current scope.

## Core Value

**Reliable day-to-day bakery operations on the phone** — correct customer and order records, including **money clarity**: each order’s **total is fixed at creation time** from a **global per-kilogram price**, so history stays trustworthy when prices change.

## Requirements

### Validated

- ✓ **Customer records** — Users with name, phone, flour balance (`User` in Realm) — existing
- ✓ **Orders by day** — Create/list orders with date parts, `flourAmount`, linked user, `doneAt` for completion — existing (`Order`, `OrderService`)
- ✓ **Realm as local system of record** — models and service singletons — existing
- ✓ **Redux + persistence** — app state layer — existing
- ✓ **Android-focused RN app** in `apps/MOBILE` with NativeWind, React Navigation — existing
- ✓ **Bilingual UI direction** (English / Arabic labels in navigation) — existing
- ✓ **Global per-kg price (data layer)** — `OrgSettings` singleton + `OrgSettingsService` read/write — **Validated in Phase 1: Pricing & snapshots (data layer)**
- ✓ **Snapshot on order create** — `snapshotPricePerKg` and rounded `snapshotTotal` on `Order` at creation; guards prevent later mutation — **Validated in Phase 1: Pricing & snapshots (data layer)**
- ✓ **Operator global per-kg price UI** — View/edit persisted global rate without creating an order — **Validated in Phase 2: Operator UI**
- ✓ **Order list/detail snapshot money** — Display `snapshotTotal` / `snapshotPricePerKg` with stable formatting (not live global recompute) — **Validated in Phase 2: Operator UI**

### Active

- [ ] **Release discipline** — When a shippable feature is complete: bump **semver** on mobile app and root repo (`0.0.0` style), then **git tag** and push (process to follow consistently).

### Out of Scope

- **Convex migration** — Explicitly deferred; not part of current milestone.
- **Consumer-facing ordering app** — Deferred until management baseline is solid.
- **Per-product or per-category per-kg prices** — v1 uses a **single global** per-kg rate only.

## Context

- Monorepo **Fterak50d** (`pnpm`, Nx); mobile app **`apps/MOBILE`**.
- Codebase map under `.planning/codebase/` (stack, architecture, structure).
- Orders store **`flourAmount`** plus **`snapshotPricePerKg`** and **`snapshotTotal`** (Realm v4). Operator UI for global price and snapshot money on orders shipped in **Phase 2**; next focus is **Phase 3** release discipline (semver + tags).

## Constraints

- **Tech**: Stay on current stack (**Realm**, **Redux**, RN) until a deliberate backend migration (Convex) is scheduled.
- **Data**: Pre–schema-v4 orders use **0** for snapshot fields (documented under ORD-04 / D-05 in `01-LEGACY-ORDERS.md`).
- **Platform**: Primary target remains **Android** as today; iOS parity not stated as a blocker for v1.

## Key Decisions

| Decision                                | Rationale                                                     | Outcome                                              |
| --------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------- |
| **Single global per-kg price for v1**   | Simplest operator model; matches your choice “1”              | Phase 1 data layer shipped (`OrgSettings` + service) |
| **Immutable order totals via snapshot** | Accounting trust; old orders must not move when price changes | Phase 1: snapshots on create + service guards        |
| **Convex**                              | You asked to ignore for now                                   | Deferred                                             |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):

1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):

1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

_Last updated: 2026-04-09 — Phase 2 (operator UI) complete; Phase 3 (release discipline) next_

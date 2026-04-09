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

### Active

- [ ] **Global per-kg price** — Operator sets one **price per kilogram** for the bakery (not per product in v1).
- [ ] **Snapshot on order create** — When an order is created, persist the **price per kg** (and derived **order total** or equivalent) so it **does not change** if the global price is updated later.
- [ ] **Release discipline** — When a shippable feature is complete: bump **semver** on mobile app and root repo (`0.0.0` style), then **git tag** and push (process to follow consistently).

### Out of Scope

- **Convex migration** — Explicitly deferred; not part of current milestone.
- **Consumer-facing ordering app** — Deferred until management baseline is solid.
- **Per-product or per-category per-kg prices** — v1 uses a **single global** per-kg rate only.

## Context

- Monorepo **Fterak50d** (`pnpm`, Nx); mobile app **`apps/MOBILE`**.
- Codebase map under `.planning/codebase/` (stack, architecture, structure).
- Orders today store **`flourAmount`** (numeric) but **no monetary fields** yet; pricing work extends the **Order** (or related) model and UI.

## Constraints

- **Tech**: Stay on current stack (**Realm**, **Redux**, RN) until a deliberate backend migration (Convex) is scheduled.
- **Data**: Existing orders after the feature ships must either **gain nullable snapshot fields** with sensible handling for legacy rows, or a documented **migration** strategy — implementation detail for the phase plan.
- **Platform**: Primary target remains **Android** as today; iOS parity not stated as a blocker for v1.

## Key Decisions

| Decision                                | Rationale                                                     | Outcome   |
| --------------------------------------- | ------------------------------------------------------------- | --------- |
| **Single global per-kg price for v1**   | Simplest operator model; matches your choice “1”              | — Pending |
| **Immutable order totals via snapshot** | Accounting trust; old orders must not move when price changes | — Pending |
| **Convex**                              | You asked to ignore for now                                   | Deferred  |

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

_Last updated: 2026-04-09 after initialization_

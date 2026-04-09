# Roadmap: Fterak50d (bakery management)

## Overview

Ship **trustworthy money fields** on top of the existing Realm order flow: persist a **single global per-kg price**, **snapshot** it (and derived totals) on each new order, keep **legacy orders** honest, then add **operator UI** to view/edit price and see historical totals. Finish with a **repeatable semver + git tag** release habit for shippable slices.

## Phases

- [x] **Phase 1: Pricing & snapshots (data layer)** — Realm settings + order snapshot fields, write rules, legacy policy (2026-04-09)
- [x] **Phase 2: Operator UI** — Screens to manage price and display order money from snapshots (2026-04-09)
- [ ] **Phase 3: Release discipline** — Version bumps and tagging workflow

## Phase Details

### Phase 1: Pricing & snapshots (data layer)

**Goal**: Global per-kg price is stored locally; new orders persist snapshot price and total; updates to global price never rewrite past orders; legacy rows have an explicit rule.

**Depends on**: Nothing (first phase)

**Requirements**: PRICE-03, ORD-01, ORD-02, ORD-04

**Success Criteria** (what must be TRUE):

1. A **single global per-kg price** can be read and updated in persistence (may be seedable for dev even before full UI).
2. **Creating an order** writes **snapshot per-kg** and **snapshot total** (or equivalent fields) derived from `flourAmount` and the price at create time.
3. **Changing** the global price **does not** alter snapshot fields on orders that already exist.
4. **Pre-feature orders** follow the agreed rule (nullable snapshots + UI fallback, or one-time migration) documented in the phase plan.

**Plans**: 3 plans

**UI hint**: no

Plans:

- [x] 01-01: Design Realm schema (settings + `Order` fields) and migration/version bump strategy
- [x] 01-02: Services: read/update global price; `addOrder` writes snapshots; guards against mutating snapshots
- [x] 01-03: Legacy order policy + tests or manual verification checklist

### Phase 2: Operator UI

**Goal**: Operator can see and change the global per-kg price; order lists and details show money from **snapshots**, not live recalculation.

**Depends on**: Phase 1

**Requirements**: PRICE-01, PRICE-02, ORD-03

**Success Criteria** (what must be TRUE):

1. Operator can **view** the current global per-kg price from the app.
2. Operator can **set or update** that price without creating an order.
3. Order screens show **total (and/or rate)** from **stored snapshot**; changing global price does not change numbers on old orders.

**Plans**: 2 plans

**UI hint**: yes

Plans:

- [x] 02-01: Settings / pricing screen (or integrated surface) for global per-kg price
- [x] 02-02: Wire order list/detail (and create flow if needed) to snapshot fields + formatting

### Phase 3: Release discipline

**Goal**: Shippable increments bump **semver** on `apps/MOBILE` and repo root; **git tag** is created and pushed.

**Depends on**: Phase 2

**Requirements**: REL-01, REL-02

**Success Criteria** (what must be TRUE):

1. Documented steps (or scripts) exist for **bumping** `apps/MOBILE/package.json` and root `package.json` together for a release.
2. Completing a shippable slice includes creating and **pushing** a **git tag** consistent with the version.

**Plans**: 2 plans

**UI hint**: no

Plans:

- [ ] 03-01: Document or script semver bump workflow (`0.0.0` style) for mobile + root
- [ ] 03-02: Tagging convention + push checklist (and optional CI hook note)

## Progress

**Execution Order:**  
Phases execute in numeric order: 1 → 2 → 3

| Phase                               | Plans Complete | Status      | Completed  |
| ----------------------------------- | -------------- | ----------- | ---------- |
| 1. Pricing & snapshots (data layer) | 3/3            | Complete    | 2026-04-09 |
| 2. Operator UI                      | 2/2            | Complete    | 2026-04-09 |
| 3. Release discipline               | 0/2            | Not started | -          |

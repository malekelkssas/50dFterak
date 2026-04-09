# Requirements: Fterak50d (bakery management)

**Defined:** 2026-04-09  
**Core Value:** Reliable day-to-day bakery operations on the phone, including money clarity via immutable per-order pricing snapshots.

## v1 Requirements

### Pricing settings

- [ ] **PRICE-01**: Operator can view the current **global price per kilogram** (single bakery-wide rate).
- [ ] **PRICE-02**: Operator can **set or update** that global per-kilogram price without creating an order.
- [ ] **PRICE-03**: Updating the global price **does not change** stored totals (or snapshot fields) on **existing** orders.

### Orders & totals

- [ ] **ORD-01**: When creating an order, the app **captures a snapshot** of the global per-kg price **in effect at creation time** (stored on the order or equivalent immutable record).
- [ ] **ORD-02**: When creating an order, the app stores an **order total** (or equivalent) derived from **flour amount × snapped per-kg price**, so the total is stable for that order row.
- [ ] **ORD-03**: Order list and detail views show **monetary values from the snapshot**, not a live recalculation from the current global price.
- [ ] **ORD-04**: **Legacy orders** created before this feature either display a defined fallback (e.g. “—” or “unknown”) or receive a one-time migration rule — behavior is **explicit and documented** in the phase plan (no silent wrong totals).

### Release process

- [ ] **REL-01**: Document or automate **semver bumps** for **`apps/MOBILE`** and **root** `package.json` for a shippable increment (`0.0.0` style).
- [ ] **REL-02**: After a shippable feature, create and push a **git tag** consistent with the release/versioning scheme.

## v2 Requirements

### Platform / backend

- **CONVEX-01**: Migrate sync/backend to **Convex** (or equivalent) — deferred; not in current roadmap until promoted.

### Product expansion

- **CUST-01**: End-customers can **place orders** from a consumer-facing surface — deferred.
- **PRICE-10**: **Per-product or per-category** per-kg pricing — deferred; v1 remains global rate only.

## Out of Scope

| Feature                        | Reason                                                  |
| ------------------------------ | ------------------------------------------------------- |
| Convex migration               | Explicitly deferred by product owner for this milestone |
| Consumer ordering              | Management-first; later phase                           |
| Multi-tier or per-item pricing | v1 scope is single global per-kg price only             |
| iOS release / store submission | Not required for stated v1 unless added later           |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status  |
| ----------- | ----- | ------- |
| PRICE-01    | —     | Pending |
| PRICE-02    | —     | Pending |
| PRICE-03    | —     | Pending |
| ORD-01      | —     | Pending |
| ORD-02      | —     | Pending |
| ORD-03      | —     | Pending |
| ORD-04      | —     | Pending |
| REL-01      | —     | Pending |
| REL-02      | —     | Pending |

**Coverage:**

- v1 requirements: 9 total
- Mapped to phases: 0
- Unmapped: 9 ⚠️

---

_Requirements defined: 2026-04-09_  
_Last updated: 2026-04-09 after initial definition_

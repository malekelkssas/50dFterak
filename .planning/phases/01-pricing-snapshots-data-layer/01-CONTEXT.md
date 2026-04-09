# Phase 1: Pricing & snapshots (data layer) - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Global per-kg price is stored locally in Realm; new orders persist immutable snapshot price and derived total at creation time; updating the global price never rewrites past orders; pre-feature orders use an explicit, simple rule in the data layer (no nullable snapshot strategy). Operator-facing screens for price and money display are **Phase 2**.

</domain>

<decisions>
## Implementation Decisions

### Global price storage (OrgSettings model)

- **D-01:** Use a dedicated **Realm model for organization-level settings** (recommended name: **`OrgSettings`**) — a **singleton row** identified by a **fixed primary key** (e.g. well-known `ObjectId` or string id `default`). Holds at least **global price per kilogram**; room for future bakery-wide keys without coupling to `User` or `Order`.
- **D-02:** **Initial / missing global price** defaults to **`0`** (seed on first read or migration so a row exists with `0` — exact mechanism is implementation detail).

### Order snapshots (create-time immutability)

- **D-03:** On **order creation**, persist **both** (a) **per-kg price in effect at creation** (read from OrgSettings at write time) and (b) **order total** derived from **`flourAmount ×` that per-kg price**. After creation, **snapshot fields must not change** when the global price is updated (PRICE-03 / ORD-01 / ORD-02).
- **D-04:** **Numeric type:** use **`double`** for monetary fields to stay consistent with existing Realm usage (`Order.flourAmount`, `Invoice.price`).

### Legacy orders (ORD-04) — simplified rule

- **D-05:** **No nullable snapshot fields** and **no “unknown” sentinel path** in the data layer. For orders that existed **before** this feature: set snapshot **per-kg** and **total** to **`0`** via schema migration (default values for new properties). Phase 2 UI will therefore show **0** for money derived from snapshots on those rows unless later product changes — **accepted by product owner** for v1 simplicity.

### Claude's Discretion

- Exact **property names** on `OrgSettings` and `Order`, Realm **schema version** bump, and **migration callback** structure.
- **Rounding** when computing `flourAmount × pricePerKg` → stored total (e.g. half-up to 2 decimal places vs raw double) — choose a single rule and document in the phase plan.
- Service-layer **guards** (reject writes that try to change snapshot fields on existing orders) vs relying on migration-only discipline — prefer explicit guards where low-cost.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product & requirements

- `.planning/REQUIREMENTS.md` — PRICE-03, ORD-01, ORD-02, ORD-04 traceability and acceptance intent.
- `.planning/PROJECT.md` — Vision, stack constraints (Realm, Redux, RN), single global per-kg v1 scope.
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, plan breakdown (01-01 … 01-03).

### Implementation touchpoints (code)

- `apps/MOBILE/backend/realm.ts` — Schema registration and `schemaVersion`.
- `apps/MOBILE/backend/models/Order.ts` — Order Realm schema.
- `apps/MOBILE/backend/services/OrderService.ts` — `addOrder` and write paths for snapshots.
- `apps/MOBILE/backend/realmHelpers.ts` — `PlainOrder` / `toPlainOrder` extensions for new fields.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable assets

- **OrderService** (`OrderService.addOrder`) — natural place to read global price and write snapshot fields inside the existing `realm.write` create block.
- **realmHelpers** — extend `PlainOrder` and `toPlainOrder` when Order gains snapshot properties.

### Established patterns

- **Realm** as system of record with **schemaVersion** migrations (`realm.ts` currently at version 3).
- **Singleton services** (`OrderService.getInstance()`) — a sibling **SettingsService** (or methods on a small service) for OrgSettings read/update is consistent.
- **Money as `double`** already used on **Invoice** and **Order.flourAmount**.

### Integration points

- New **OrgSettings** model must be added to the **Realm schema array** in `realm.ts`.
- Phase 2 will read the same OrgSettings and Order snapshot fields for UI; this phase owns **persistence and write rules** only.

</code_context>

<specifics>
## Specific Ideas

- Product owner prefers **minimal legacy handling**: **`0`** for old orders, **default global price `0`**, no nullable snapshot design.
- **Org settings model:** Treat as **one logical org (the bakery)** today; singleton **OrgSettings** row keeps global config in one place and scales if more org-level fields appear later.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 1 scope.

</deferred>

---

_Phase: 01-pricing-snapshots-data-layer_
_Context gathered: 2026-04-09_

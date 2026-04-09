# Phase 2: Operator UI - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Operator-facing React Native UI that **reflects Phase 1**: read/update the **global per-kg flour price** via `OrgSettings` (without creating an order), and show **order money from persisted snapshots** (`snapshotPricePerKg`, `snapshotTotal`) everywhere orders appear — not from live global price. Satisfies **PRICE-01**, **PRICE-02**, and **ORD-03**; aligns with approved **02-UI-SPEC.md**.

</domain>

<decisions>
## Implementation Decisions

### Global per-kg price (operator surface)

- **D-01:** Add a **dedicated operator screen** for viewing and editing the global per-kg price (roadmap plan **02-01**). It is a **UI reflection of Phase 1** data: read/write through **`orgSettingsService`** / Realm **`OrgSettings`** only — no shadow state that drifts from persistence.
- **D-02:** Updating the price must be possible **without creating an order** (**PRICE-02**). Save flow uses a clear primary CTA and validation copy per **02-UI-SPEC** (e.g. positive number, two decimal places).
- **D-03:** The screen must be **discoverable** from the existing app shell. **Claude's discretion:** exact entry point (e.g. affordance on **Home**, header action, or future settings pattern) — must stay consistent with NativeWind + `components/ui` patterns in **02-UI-SPEC**.

### Order list / detail — snapshot money (ORD-03)

- **D-04:** **Primary locus today:** **`UserDetailsScreen`** and **`OrderCard`** — this is the app’s real “customer profile + their orders” flow; there is **no** separate global orders tab. Snapshot **rate and/or total** must appear on **order rows** (and any expanded/detail affordance tied to the same order) using **`PlainOrder.snapshotPricePerKg`** and **`PlainOrder.snapshotTotal`** only — **never** `flourAmount × current global price` from `OrgSettings`.
- **D-05:** **User flexibility:** Product owner accepted showing totals on **user (customer) detail / per-user order list** as sufficient for v1; if **`HomeScreen`** or other surfaces later list orders, they must follow the **same snapshot rule**. No requirement to invent a new “global orders” screen for this phase.
- **D-06:** **Legacy rows (ORD-04 / D-05):** Pre–schema-v4 orders have snapshot fields **0**. Display **numeric zero formatted like other money** (e.g. `0.00` in locale) — **not** a fake total implied by today’s global price. If copy clarifies “no historical price,” that is **Claude's discretion**; do **not** silently show recomputed totals.

### Visual and copy contract

- **D-07:** Follow **02-UI-SPEC.md** for spacing, typography, color roles, accessibility (touch targets, labels), bilingual string tables under **`apps/MOBILE/utils/constants`**, and money formatting (**`ar-EG`** for numerals where spec says so).

### Claude's Discretion

- Navigation wiring for the pricing screen and deep links (if any).
- Whether **`AddOrderModal`** shows a **preview** line item for snapshot total **before** save (helpful UX) as long as persisted values still come from **`OrderService.addOrder`** as today.
- Exact layout of rate vs total on **`OrderCard`** (trailing vs subline) within **02-UI-SPEC** hierarchy.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 1 data & legacy rules

- `.planning/phases/01-pricing-snapshots-data-layer/01-CONTEXT.md` — OrgSettings singleton, snapshot immutability, D-05 legacy **0** policy.
- `.planning/phases/01-pricing-snapshots-data-layer/01-LEGACY-ORDERS.md` — ORD-04 verification and migration behavior.

### Phase 2 UI contract

- `.planning/phases/02-operator-ui/02-UI-SPEC.md` — Design system, copy, money display rules, ORD-03 and legacy fallback wording.

### Product & roadmap

- `.planning/REQUIREMENTS.md` — PRICE-01, PRICE-02, ORD-03.
- `.planning/ROADMAP.md` — Phase 2 goal, plans 02-01 / 02-02.
- `.planning/PROJECT.md` — Operator-first scope, stack constraints.

### Code touchpoints

- `apps/MOBILE/backend/services/OrgSettingsService.ts` — global price read/update API for UI.
- `apps/MOBILE/backend/services/OrderService.ts` — order creation; snapshots on create.
- `apps/MOBILE/backend/realmHelpers.ts` — `PlainOrder` / `toPlainOrder` for snapshot fields.
- `apps/MOBILE/screens/UserDetailsScreen.tsx` — customer detail + order list host.
- `apps/MOBILE/components/customers/OrderCard.tsx` — order row presentation.
- `apps/MOBILE/navigation/index.tsx` — tab + stack structure (Home, tabs, `UserDetails`).

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable assets

- **`OrderCard`** — extend to show formatted `snapshotTotal` / `snapshotPricePerKg`; already central to per-user order list.
- **`components/ui`** primitives (**Card**, **Text**, **Button**, **TextInput**, **Dialog**) — use for pricing screen per UI-SPEC.
- **`orgSettingsService`** — already encapsulates singleton `OrgSettings` read/write for the pricing UI.

### Established patterns

- **React Navigation** — `MainTabs` + stack `UserDetails`; new pricing screen likely registered on stack or as modal from Home.
- **NativeWind** + **theme tokens** from `apps/MOBILE/utils/constants/theme.ts`.
- **Bilingual strings** — mirror EN/AR like existing customer/order string tables.

### Integration points

- **Home** is currently marketing-style welcome — natural place for a **“Flour price”** or **Settings** entry without adding a fourth tab (optional product choice left to implementation).
- **Redux** may or may not mirror `OrgSettings` for UI; if used, must **hydrate from Realm** and **save through service** so Phase 1 remains source of truth.

</code_context>

<specifics>
## Specific Ideas

- Product owner requested explicit **UI reflection of Phase 1**: a **place to set global price** and **places to show order totals** from snapshots; comfortable with **customer profile / single-user order view** (**`UserDetailsScreen`**) as the main orders surface rather than a separate global orders screen.
- **Home** today does not list orders — snapshot money work should focus on **`OrderCard` + user detail** unless a new list is introduced in this phase.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

_Phase: 02-operator-ui_
_Context gathered: 2026-04-09_

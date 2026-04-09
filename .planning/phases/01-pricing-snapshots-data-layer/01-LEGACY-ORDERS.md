# Phase 1 — Legacy orders (ORD-04)

## Requirement

**ORD-04** requires that legacy orders created before this feature either show a defined fallback or follow a one-time migration rule, and that this behavior is **explicit and documented** in the phase plan (no silent wrong totals). See `.planning/REQUIREMENTS.md`.

## Decision (D-05)

Per **D-05** in `01-CONTEXT.md`: orders created **before** schema v4 have `snapshotPricePerKg` and `snapshotTotal` set to **0** via schema defaults and migration (no nullable snapshot fields). Phase 2 UI will show **0** for money derived from snapshots on those rows unless product changes later; this is **accepted** for v1.

## Verification

1. Open the app against a database that already contained orders before upgrading to schema v4. Confirm the app launches with no Realm migration crash.
2. Set global price to a value greater than 0 (e.g. call `orgSettingsService.setGlobalPricePerKg(12.5)` from React Native debugger, a temporary dev-only control, or any existing debug entry point you use locally).
3. Create a new order. Inspect the persisted `Order` in Realm or log `toPlainOrder(order)` and confirm `snapshotPricePerKg` matches the current global price and `snapshotTotal` equals `flourAmount × price` rounded half-up to two decimals.
4. Change the global price again. Reload or re-fetch the **previous** order and confirm its `snapshotPricePerKg` and `snapshotTotal` are unchanged.

### Grep audit

Commands run (from repo root):

- `rg "schemaVersion" apps/MOBILE/backend/realm.ts` — shows `schemaVersion: 4` — **PASS**
- `rg "snapshotPricePerKg|snapshotTotal" apps/MOBILE/backend` — no assignments outside `addOrder`’s `realm.create` object literal (only reads, comparisons, type definitions, and schema defaults) — **PASS**

---
phase: 01-pricing-snapshots-data-layer
plan: '02'
subsystem: database
tags: [realm, services, typescript]

requires:
  - phase: 01-pricing-snapshots-data-layer
    provides: OrgSettings model, Order snapshot fields, Realm v4
provides:
  - OrgSettingsService read/write for global per-kg price
  - addOrder persists snapshots with half-up rounding to 2 decimals
  - PlainOrder exposes snapshots; guards prevent mutation after create
affects:
  - Redux/UI consumers of PlainOrder in later phases

tech-stack:
  added: []
  patterns:
    - Service singleton mirroring OrderService
    - Runtime assertion that snapshot fields stay stable on toggle/delete

key-files:
  created:
    - apps/MOBILE/backend/services/OrgSettingsService.ts
  modified:
    - apps/MOBILE/backend/services/OrderService.ts
    - apps/MOBILE/backend/realmHelpers.ts

key-decisions:
  - Used Math.round(raw * 100) / 100 for half-up currency-style rounding per plan

patterns-established:
  - orgSettingsService module export alongside orderService

requirements-completed:
  - PRICE-03
  - ORD-01
  - ORD-02

duration: 10min
completed: 2026-04-09T12:55:00Z
---

# Phase 1 Plan 02: Services & plain types summary

**Global price via OrgSettingsService singleton, new orders store rounded `snapshotTotal`, and PlainOrder carries snapshot fields with write-path guards on toggle/delete.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-04-09T12:45:00Z
- **Completed:** 2026-04-09T12:55:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- `getGlobalPricePerKg` / `setGlobalPricePerKg` with lazy singleton creation
- `addOrder` snapshots current price and half-up rounded total at creation time
- `assertSnapshotsUnchanged` in `toggleDone` and `deleteOrder` write transactions

## Task Commits

1. **Task 1: OrgSettingsService for global price** — `e11120f` (feat)
2. **Task 2: addOrder writes snapshots with rounding rule** — `d1d5f56` (feat)
3. **Task 3: PlainOrder + toPlainOrder + snapshot immutability guard** — `3f01d63` (feat)

## Files Created/Modified

- `apps/MOBILE/backend/services/OrgSettingsService.ts` — global price API
- `apps/MOBILE/backend/services/OrderService.ts` — snapshots on create, guards
- `apps/MOBILE/backend/realmHelpers.ts` — PlainOrder fields and mapping

## Decisions Made

None - followed plan.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None.

## Next Phase Readiness

Ready for plan `01-03` (ORD-04 documentation and grep audit).

## Self-Check: PASSED

---

_Phase: 01-pricing-snapshots-data-layer_
_Completed: 2026-04-09_

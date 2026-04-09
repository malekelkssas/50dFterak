---
phase: 01-pricing-snapshots-data-layer
plan: '01'
subsystem: database
tags: [realm, migration, typescript]

requires: []
provides:
  - OrgSettings Realm model with singleton _id
  - Order snapshot doubles with default 0 for legacy rows
  - Realm schemaVersion 4 and v3→v4 migration creating singleton row
affects:
  - 01-02 service layer
  - Phase 2 UI when reading PlainOrder money fields

tech-stack:
  added: []
  patterns:
    - String primary key singleton document for bakery-wide settings

key-files:
  created:
    - apps/MOBILE/backend/models/OrgSettings.ts
  modified:
    - apps/MOBILE/backend/models/Order.ts
    - apps/MOBILE/backend/realm.ts

key-decisions:
  - Used Realm property defaults for snapshot fields so migrated orders get 0 without per-row loops

patterns-established:
  - OrgSettings rows must use _id === 'singleton' only

requirements-completed:
  - PRICE-03
  - ORD-01
  - ORD-02
  - ORD-04

duration: 12min
completed: 2026-04-09T12:45:00Z
---

# Phase 1 Plan 01: Realm schema & migration summary

**Realm v4 with OrgSettings singleton, Order `snapshotPricePerKg` / `snapshotTotal` doubles, and migration that seeds the settings row on upgrade from v3.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-09T12:33:00Z
- **Completed:** 2026-04-09T12:45:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Added `OrgSettings` model with `globalPricePerKg` and fixed singleton id
- Extended `Order` schema with immutable snapshot fields defaulting to 0
- Registered schema, bumped version, and migration that creates the singleton when missing

## Task Commits

1. **Task 1: Add OrgSettings Realm model** — `52a8ae2` (feat)
2. **Task 2: Extend Order schema with snapshot doubles** — `aec0c93` (feat)
3. **Task 3: Register schema and migration (v3 → v4)** — `f6732a7` (feat)

## Files Created/Modified

- `apps/MOBILE/backend/models/OrgSettings.ts` — singleton org pricing settings
- `apps/MOBILE/backend/models/Order.ts` — snapshot property definitions
- `apps/MOBILE/backend/realm.ts` — schema list, version 4, `onMigration`

## Decisions Made

None beyond plan — followed `01-CONTEXT.md` D-03, D-04, D-05.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None.

## Next Phase Readiness

Ready for plan `01-02` (OrgSettingsService and OrderService snapshot writes).

## Self-Check: PASSED

---

_Phase: 01-pricing-snapshots-data-layer_
_Completed: 2026-04-09_

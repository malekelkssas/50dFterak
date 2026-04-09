---
phase: 02-operator-ui
plan: '02'
subsystem: ui
tags: [react-native, formatting, orders]

requires:
  - phase: 01-pricing-snapshots-data-layer
    provides: PlainOrder.snapshotTotal, snapshotPricePerKg
provides:
  - formatSnapshotMoney helper and OrderCard snapshot money lines
affects:
  - operator-ui

tech-stack:
  added: []
  patterns:
    - 'Snapshot money: ar-EG two-decimal formatting + ج.م suffix aligned with formatCurrency style'

key-files:
  created: []
  modified:
    - apps/MOBILE/utils/formatters.ts
    - apps/MOBILE/utils/constants/strings.ts
    - apps/MOBILE/utils/constants/index.ts
    - apps/MOBILE/components/customers/OrderCard.tsx

key-decisions:
  - 'Legacy zero snapshots display as formatted 0,00 ج.م — no em dash, no recomputation from global price'

patterns-established:
  - 'Order list/detail money uses only snapshot fields on OrderCard; no orgSettingsService in presentation'

requirements-completed: [ORD-03]

duration: 15min
completed: 2026-04-09
---

# Phase 2: Operator UI — Plan 02 Summary

**Order rows show snapshot total and per-kg rate with shared ar-EG two-decimal formatting; no live global price in OrderCard.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-09T13:10:00Z
- **Completed:** 2026-04-09T13:25:00Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- `formatSnapshotMoney` centralizes snapshot display (ar-EG, 2 decimals, ` ج.م`).
- `ORDER_MONEY_STRINGS` adds bilingual labels for total and per-kg lines.
- `OrderCard` renders both snapshot fields with accessibility labels referencing snapshot semantics.

## Task Commits

Delivered in the same feature commit as plan 01 (same branch push):

1. **Task 1: Snapshot money formatter** — `ddc5127`
2. **Task 2: Labels** — `ddc5127`
3. **Task 3: OrderCard wiring** — `ddc5127`

## Files Created/Modified

- `apps/MOBILE/utils/formatters.ts` — `formatSnapshotMoney`.
- `apps/MOBILE/utils/constants/strings.ts` — `ORDER_MONEY_STRINGS`.
- `apps/MOBILE/utils/constants/index.ts` — export `ORDER_MONEY_STRINGS`.
- `apps/MOBILE/components/customers/OrderCard.tsx` — snapshot money block.

## Decisions Made

- Placed money as a subline under the time row to keep flour amount as the focal anchor per 02-UI-SPEC.

## Deviations from Plan

None.

## Issues Encountered

None.

## User Setup Required

None.

## Next Phase Readiness

Phase 3 can build on stable snapshot display in list/detail surfaces.

---

_Phase: 02-operator-ui_
_Completed: 2026-04-09_

## Self-Check: PASSED

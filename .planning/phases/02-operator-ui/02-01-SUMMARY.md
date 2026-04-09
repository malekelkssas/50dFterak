---
phase: 02-operator-ui
plan: '01'
subsystem: ui
tags: [react-native, org-settings, navigation]

requires:
  - phase: 01-pricing-snapshots-data-layer
    provides: OrgSettingsService, globalPricePerKg persistence
provides:
  - Global flour price stack screen with validation and bilingual copy
  - Home navigation entry and PRICING_STRINGS tables
affects:
  - operator-ui

tech-stack:
  added: []
  patterns:
    - 'Pricing copy: PRICING_STRINGS.en canonical + PRICING_STRINGS.ar for operator UI'

key-files:
  created:
    - apps/MOBILE/screens/GlobalFlourPriceScreen.tsx
  modified:
    - apps/MOBILE/utils/constants/strings.ts
    - apps/MOBILE/utils/constants/index.ts
    - apps/MOBILE/utils/constants/navigation.ts
    - apps/MOBILE/utils/types/navigation.ts
    - apps/MOBILE/navigation/index.tsx
    - apps/MOBILE/screens/HomeScreen.tsx

key-decisions:
  - 'Primary save CTA displays EN literal Save flour price per plan key_links; screen copy uses AR for consistency with the rest of the app'

patterns-established:
  - 'Global price editing uses orgSettingsService only — no Realm/Redux in the screen'

requirements-completed: [PRICE-01, PRICE-02]

duration: 25min
completed: 2026-04-09
---

# Phase 2: Operator UI — Plan 01 Summary

**Global per-kg flour price screen with orgSettingsService round-trip, bilingual PRICING_STRINGS, and Home stack entry.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-04-09T12:50:00Z
- **Completed:** 2026-04-09T13:15:00Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Centralized EN/AR pricing strings matching 02-UI-SPEC English contract.
- `GlobalFlourPriceScreen` loads/saves via `getGlobalPricePerKg` / `setGlobalPricePerKg` with positive-value and ≤2 decimal validation and visible error copy.
- `GlobalFlourPrice` registered on the root stack; Home card includes a ≥48px target to open the screen.

## Task Commits

Implementation delivered in a single feature commit (tasks were executed together):

1. **Task 1: Pricing string tables** — `ddc5127`
2. **Task 2: GlobalFlourPriceScreen** — `ddc5127`
3. **Task 3: Register stack + Home** — `ddc5127`

## Files Created/Modified

- `apps/MOBILE/screens/GlobalFlourPriceScreen.tsx` — pricing form, back header, empty/invalid/save-error UX.
- `apps/MOBILE/utils/constants/strings.ts` — `PRICING_STRINGS`.
- `apps/MOBILE/utils/constants/index.ts` — export `PRICING_STRINGS`.
- `apps/MOBILE/utils/constants/navigation.ts` — `GLOBAL_FLOUR_PRICE`.
- `apps/MOBILE/utils/types/navigation.ts` — `GlobalFlourPrice` route.
- `apps/MOBILE/navigation/index.tsx` — stack screen.
- `apps/MOBILE/screens/HomeScreen.tsx` — navigation entry.

## Decisions Made

- Combined EN button label for the primary CTA with AR for the rest of the screen to satisfy canonical EN copy while matching app language norms.

## Deviations from Plan

None — plan executed as specified.

## Issues Encountered

None.

## User Setup Required

None.

## Next Phase Readiness

Plan 02-02 (snapshot money on order rows) can proceed; this plan does not block it.

---

_Phase: 02-operator-ui_
_Completed: 2026-04-09_

## Self-Check: PASSED

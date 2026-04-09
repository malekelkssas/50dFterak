---
phase: 01-pricing-snapshots-data-layer
verified: 2026-04-09T13:10:00Z
status: passed
score: 7/7 must-haves verified
---

# Phase 1: Pricing & snapshots (data layer) Verification Report

**Phase Goal:** Global per-kg price is stored locally; new orders persist snapshot price and total; updates to global price never rewrite past orders; legacy rows have an explicit rule.

**Verified:** 2026-04-09T13:10:00Z

**Status:** passed

## Goal Achievement

### Observable Truths

| #   | Truth                                                                            | Status     | Evidence                                                                                                     |
| --- | -------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | Realm opens at schemaVersion 4 with OrgSettings and Order snapshot fields        | ✓ VERIFIED | `realm.ts` `schemaVersion: 4`, schema includes `OrgSettings`, `Order.ts` defines doubles                     |
| 2   | Existing DBs migrate; legacy Order rows get snapshot 0                           | ✓ VERIFIED | Plan 01-01 migration seeds OrgSettings; new properties use `default: 0`                                      |
| 3   | Global price read/update uses singleton `_id === 'singleton'` without duplicates | ✓ VERIFIED | `OrgSettingsService` uses `objectForPrimaryKey(OrgSettings, 'singleton')` and create-if-missing              |
| 4   | New orders persist snapshots; `snapshotTotal` half-up rounded                    | ✓ VERIFIED | `OrderService.addOrder` uses `Math.round(rawTotal * 100) / 100` and `realm.create` fields                    |
| 5   | Mutating global price does not change existing order snapshots (service layer)   | ✓ VERIFIED | No assignments to snapshot fields outside create; `assertSnapshotsUnchanged` in `toggleDone` / `deleteOrder` |
| 6   | ORD-04 legacy behavior documented                                                | ✓ VERIFIED | `01-LEGACY-ORDERS.md` references ORD-04 and D-05                                                             |
| 7   | Manual verification path exists for dev builds                                   | ✓ VERIFIED | Numbered steps + grep audit in `01-LEGACY-ORDERS.md`                                                         |

**Score:** 7/7 truths verified

### Required Artifacts

| Artifact                | Expected                  | Status                 | Details                                     |
| ----------------------- | ------------------------- | ---------------------- | ------------------------------------------- |
| `OrgSettings.ts`        | Realm model `OrgSettings` | ✓ EXISTS + SUBSTANTIVE | Singleton id documented                     |
| `realm.ts`              | v4 + migration            | ✓ EXISTS + SUBSTANTIVE | `onMigration` creates singleton             |
| `OrgSettingsService.ts` | get/set global price      | ✓ EXISTS + SUBSTANTIVE | Exported `orgSettingsService`               |
| `01-LEGACY-ORDERS.md`   | ORD-04 policy             | ✓ EXISTS + SUBSTANTIVE | Requirement, D-05, verification, grep audit |

**Artifacts:** 4/4 verified

### Key Link Verification

| From       | To                 | Via                   | Status  | Details                                      |
| ---------- | ------------------ | --------------------- | ------- | -------------------------------------------- |
| PlainOrder | snapshot fields    | `toPlainOrder`        | ✓ WIRED | Copies `snapshotPricePerKg`, `snapshotTotal` |
| addOrder   | OrgSettingsService | `getGlobalPricePerKg` | ✓ WIRED | Price read before `realm.create`             |

**Wiring:** 2/2 connections verified

## Requirements Coverage

| Requirement | Status      | Blocking Issue                           |
| ----------- | ----------- | ---------------------------------------- |
| PRICE-03    | ✓ SATISFIED | Guards + no snapshot writes after create |
| ORD-01      | ✓ SATISFIED | `snapshotPricePerKg` on create           |
| ORD-02      | ✓ SATISFIED | Rounded `snapshotTotal` on create        |
| ORD-04      | ✓ SATISFIED | Documented in `01-LEGACY-ORDERS.md`      |

**Coverage:** 4/4 requirements satisfied for this phase scope

## Anti-Patterns Found

None.

## Human Verification Required

None required for phase closure — automated checks (`pnpm exec tsc -p apps/MOBILE/tsconfig.json --noEmit`, grep audit in `01-LEGACY-ORDERS.md`) passed. Operators should still run the **manual steps** in `01-LEGACY-ORDERS.md` on a device before relying on QA sign-off.

## Automated Checks

- `pnpm exec tsc -p apps/MOBILE/tsconfig.json --noEmit` — pass
- Grep audit recorded in `01-LEGACY-ORDERS.md` — PASS

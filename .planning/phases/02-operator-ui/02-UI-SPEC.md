---
phase: 2
slug: operator-ui
status: approved
shadcn_initialized: false
preset: none
created: 2026-04-09
reviewed_at: 2026-04-09T14:00:00Z
---

# Phase 2 — UI Design Contract

> Visual and interaction contract for **Operator UI**: global per-kg price management and order money from **snapshots**. Generated for `/gsd-ui-phase 2`, verified against six quality dimensions.

---

## Design System

| Property          | Value                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Tool              | **none** (not shadcn — React Native)                                                                                                 |
| Preset            | NativeWind v4 + `nativewind/preset`; Tailwind `theme.extend.colors` wired to CSS vars from `apps/MOBILE/utils/constants/theme.ts`    |
| Component library | **Custom primitives** under `apps/MOBILE/components/ui` (Paper-style `Text` variants, `Button`, `Dialog`, `TextInput`, `Card`, etc.) |
| Icon library      | **lucide-react-native** (existing)                                                                                                   |
| Font              | System default (RN); use existing `Text` variants for scale — no new custom font files in this phase                                 |

**Stack source:** `tailwind.config.js`, `theme.ts`, `@mobile/components/ui`.

---

## Spacing Scale

Declared values (multiples of 4):

| Token | Value | Usage                                                                 |
| ----- | ----- | --------------------------------------------------------------------- |
| xs    | 4px   | Icon gaps, tight inline padding                                       |
| sm    | 8px   | Compact stacks, `hitSlop` minimum alongside targets                   |
| md    | 16px  | Default padding inside cards, form field vertical rhythm              |
| lg    | 24px  | Section separation within a screen                                    |
| xl    | 32px  | Major vertical breaks (e.g. below header)                             |
| 2xl   | 48px  | **Minimum tappable target** for icon-only controls (delete, overflow) |
| 3xl   | 64px  | Rare page-level top/bottom breathing room                             |

**Exceptions:** none beyond documented 48px minimum for icon-only actions (replaces ad-hoc 44px to stay on a 4px grid).

---

## Typography

Map to existing `Text` variants in code; sizes are **logical px** for contract (RN density-independent).

| Role    | Size | Weight         | Line Height |
| ------- | ---- | -------------- | ----------- |
| Body    | 16px | 400 (regular)  | 1.5         |
| Label   | 14px | 400 (regular)  | 1.4         |
| Heading | 20px | 600 (semibold) | 1.25        |
| Display | 28px | 400 (regular)  | 1.2         |

**Weights in this phase:** only **400** and **600**; avoid introducing a third weight (e.g. extrabold) on new copy.

---

## Color

Light scheme (dark: use paired tokens from `theme.ts`; same roles).

| Role            | Value (light)                                                    | Usage                                                                                                                                  |
| --------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Dominant (60%)  | `#FFFFFF` (`background`)                                         | Screen canvas                                                                                                                          |
| Secondary (30%) | `#F8FAFC` (`surface`), `#F1F5F9` (`muted`), `#E2E8F0` (`border`) | Cards, inputs, dividers, elevated panels                                                                                               |
| Accent (10%)    | `#3B82F6` (`primary`)                                            | **Reserved for:** primary screen CTA (e.g. save pricing), positive numeric emphasis (e.g. flour balance), completed-order success line |
| Destructive     | `#EF4444`                                                        | Delete actions, destructive dialog confirm labels only                                                                                 |

**Accent reserved for:** primary CTA on the pricing form; positive balance / success states tied to money or completion; **not** for every tappable row, secondary buttons, or neutral icons.

**Indigo `accent` token:** use sparingly for secondary emphasis (e.g. inline “link” style actions); do **not** compete with primary CTA on the same screen.

---

## Copywriting Contract

All user-visible strings for this phase live in `apps/MOBILE/utils/constants` (mirror EN/AR like `CUSTOMERS_STRINGS`). Contract below is **English canonical**; add Arabic counterparts beside them in code.

| Element                                    | Copy                                                                                                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Primary CTA (save global price)            | **Save flour price**                                                                                                                  |
| Empty state heading (no global price yet)  | **Set your flour price**                                                                                                              |
| Empty state body                           | **Enter what you charge per kilogram. New orders will use this rate when they are created.**                                          |
| Error state (invalid / non-positive price) | **Enter a valid price per kilogram** — **Use a positive number. You can use up to two decimal places.**                               |
| Error state (save failed / persistence)    | **Could not save price** — **Check that the app has storage access and try again.**                                                   |
| Destructive confirmation                   | **Delete order:** keep existing `DIALOG_DELETE_ORDER_TITLE` / `DIALOG_DELETE_ORDER_DESC` + **Delete** button label (already specific) |
| Undo completion                            | Keep existing Arabic confirmation copy in `OrderCard` unless product owner requests EN parity in this phase                           |

---

## Registry Safety

| Registry                          | Blocks Used                       | Safety Gate                                    |
| --------------------------------- | --------------------------------- | ---------------------------------------------- |
| shadcn / web component registries | **Not applicable** (React Native) | N/A                                            |
| NativeWind                        | Official `nativewind/preset` only | No third-party Tailwind component marketplaces |
| Third-party UI registries         | **none**                          | N/A                                            |

---

## Visual hierarchy (Phase 2 surfaces)

| Surface            | Focal anchor                                    | Secondary                                                                                  |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Global pricing** | Large current rate + unit (kg) + editable field | Helper text explaining snapshot behavior                                                   |
| **Order list row** | Flour amount + date/time line                   | Monetary total / rate from snapshot (trailing or subline, consistent across list + detail) |

**Accessibility:** Icon-only controls (delete, tab icons) require **visible labels** in the same screen flow (dialog titles, tab bar labels, or `accessibilityLabel`) — minimum 48×48px touch target.

---

## Money display

- Format currency-style numbers consistently with the rest of the app; prefer **`ar-EG`** locale for number grouping/decimals where numerals appear beside dates already using `ar-EG`.
- **ORD-03:** Always show **stored snapshot** `snapshotTotal` / `snapshotPricePerKg`; never recompute from live `OrgSettings` on list/detail.
- **Legacy / null snapshots:** Follow documented ORD-04 fallback (e.g. em dash or localized “unknown”) — no silent wrong totals; reuse or extend existing string tables.

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-04-09

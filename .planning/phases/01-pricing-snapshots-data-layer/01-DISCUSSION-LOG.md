# Phase 1: Pricing & snapshots (data layer) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-09
**Phase:** 1-Pricing & snapshots (data layer)
**Areas discussed:** Legacy orders, Defaults, Global price storage, Org settings model, Snapshots & types

---

## Legacy orders (ORD-04)

| Option                          | Description                                        | Selected |
| ------------------------------- | -------------------------------------------------- | -------- |
| Nullable + Phase 2 “unknown” UX | Honest display when no snapshot existed            |          |
| One-time migration from a rule  | Backfill from chosen price at upgrade              |          |
| **Use `0` for snapshot fields** | Simple; existing rows get 0 via migration defaults | ✓        |

**User's choice:** Use **`0`** for pre-feature orders — no nullable fields, no complex unknown handling in the data layer.

**Notes:** Accepts that Phase 2 will show **0** for monetary values derived from snapshots on legacy rows.

---

## Initial global price default

| Option                             | Description                                               | Selected |
| ---------------------------------- | --------------------------------------------------------- | -------- |
| Require explicit set before orders | Block or warn until operator sets price                   |          |
| **Default to `0`**                 | Simple; operator sets real price in Phase 2 (or dev seed) | ✓        |

**User's choice:** **Default global per-kg price to `0`.**

---

## Global price storage — Org settings model

| Option                                 | Description                                                        | Selected |
| -------------------------------------- | ------------------------------------------------------------------ | -------- |
| Ad hoc key-value                       | Less structured                                                    |          |
| Fields on unrelated model              | Couples concerns                                                   |          |
| **Dedicated org-level settings model** | Singleton Realm object (e.g. `OrgSettings`) for bakery-wide config | ✓        |

**User's choice:** Proceed with an **org settings** style model; assistant recommended **`OrgSettings`** singleton row with fixed primary key, holding global per-kg price and extensible for future org keys.

---

## Snapshot shape & numeric type

| Option                             | Description                                         | Selected |
| ---------------------------------- | --------------------------------------------------- | -------- |
| Store total only                   | Must not lose per-kg audit                          |          |
| **Store per-kg at create + total** | Matches ORD-01/ORD-02; Phase 2 reads snapshots only | ✓        |
| Integer minor units                | Stricter precision                                  |          |
| **`double`**                       | Matches `Invoice.price` / `Order.flourAmount`       | ✓        |

**User's choice:** Implied alignment with requirements; **both** snapshot fields + **`double`** recorded in CONTEXT (user did not object).

---

## Claude's Discretion

- Realm property names, migration structure, rounding rule for `flourAmount × pricePerKg`, and strictness of snapshot immutability guards in services.

## Deferred Ideas

None recorded.

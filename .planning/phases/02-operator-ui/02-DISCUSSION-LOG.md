# Phase 2: Operator UI - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-09
**Phase:** 2-Operator UI
**Areas discussed:** Global price UI, Order snapshot money surfaces, Phase 1 reflection

---

## Session format

Product direction was provided in a **single message** at `/gsd-discuss-phase 2` (no multi-turn gray-area picker). The orchestrator mapped it to roadmap requirements, **02-UI-SPEC.md**, and current navigation (`UserDetails` + `OrderCard`).

**User's stated intent:** UI must **reflect Phase 1** — (1) a place to **add/set the global price**, and (2) a place to **show order total prices from snapshots**, acceptable on **user profile / single-user order context** or **orders UI**; codebase review showed the latter maps to **`UserDetailsScreen`** + **`OrderCard`** (no global orders tab today).

**Notes:** Align with **PRICE-01**, **PRICE-02**, **ORD-03**; money display contract in **02-UI-SPEC**; legacy **0** snapshots per **01-LEGACY-ORDERS.md** / **D-05**.

---

## Global per-kg price surface

| Option                              | Description                                                                           | Selected |
| ----------------------------------- | ------------------------------------------------------------------------------------- | -------- |
| Dedicated pricing / settings screen | Matches roadmap 02-01 and UI-SPEC “Global pricing” surface; uses `OrgSettingsService` | ✓        |
| Hidden dev-only control             | Rejected — does not satisfy PRICE-01/02 for real operator use                         |          |
| Only implicit via order create      | Rejected — violates PRICE-02                                                          |          |

**User's choice:** Explicit operator-facing surface for global price (wording: “place to add the global price”).

---

## Where to show snapshot order money

| Option                                                        | Description                                                                   | Selected |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------- |
| Per-customer order list + cards (`UserDetails` / `OrderCard`) | Matches existing app structure; satisfies ORD-03 where orders are shown today | ✓        |
| New global “all orders” tab                                   | Not required for v1; user open to profile/single-page style flows             |          |
| Home dashboard listing                                        | Home does not list orders today; out of scope unless added deliberately       |          |

**User's choice:** Implement on **customer detail / order rows**; **no mandate** for a separate global orders screen in Phase 2.

---

## Claude's Discretion

- Entry route for the pricing screen (Home affordance vs other pattern).
- Optional preview of snapshot total in add-order flow before save.
- Exact `OrderCard` layout for rate vs total within UI-SPEC.

## Deferred Ideas

None recorded.

# External integrations & data boundaries

## Network / cloud APIs

- **No REST/GraphQL client libraries** (e.g. no axios/fetch wrapper packages) appear in root or `apps/MOBILE/package.json`. The app is oriented around **local-first** data.
- **Nx Cloud:** `nx.json` contains `nxCloudId` for Nx Cloud analytics/remote cache — developer tooling only, not app runtime.

## Persistence & device storage

- **Realm (MongoDB Realm SDK)** — embedded database; models in `apps/MOBILE/backend/models/` (`User.ts`, `Order.ts`, `Invoice.ts`), access via `getRealm()` in `apps/MOBILE/backend/realm.ts` (`schemaVersion: 3`). All CRUD flows go through service singletons in `apps/MOBILE/backend/services/`.
- **AsyncStorage** — used by `redux-persist` for Redux state hydration (`apps/MOBILE/store/index.ts`).

## Auth & identity

- **No OAuth / Firebase Auth / Clerk-style SDKs** in declared dependencies. User identity in the domain model is **local** (phone + name on `User` in Realm), not third-party auth.

## Encryption & secrets (runtime)

- **redux-persist-transform-encrypt** wraps persisted Redux state (`apps/MOBILE/store/index.ts`). Secret material is expected from **`REDUX_PERSIST_SECRET_KEY`** via `@env` (`react-native-dotenv`), surfaced through `ENV` in `apps/MOBILE/utils/constants/env.ts`.
- **`.env` handling:** `apps/MOBILE/babel.config.js` uses `module:react-native-dotenv` with `path: '.env'`, `safe: false`, `allowUndefined: true` — developers must supply `.env` locally; it should stay out of version control.

## Push, maps, analytics

- No dedicated packages for push notifications, maps, or analytics were found in `apps/MOBILE/package.json` at mapping time.

## Platform services (implicit)

- **React Native / Android** — standard platform APIs via RN and native modules (e.g. `@react-native-community/datetimepicker`). No custom native module code was reviewed beyond generated Android project layout.

## Summary

| Boundary       | Mechanism                                | Primary paths                        |
| -------------- | ---------------------------------------- | ------------------------------------ |
| Local DB       | Realm                                    | `apps/MOBILE/backend/`               |
| UI state cache | Redux + persist + encrypt + AsyncStorage | `apps/MOBILE/store/index.ts`         |
| Configuration  | dotenv → `@env` → `ENV`                  | `apps/MOBILE/utils/constants/env.ts` |

# Code conventions

## TypeScript

- **Strict-ish defaults** via `typescript-eslint` recommended rules in `eslint.config.mjs`.
- **`any`:** warned (`@typescript-eslint/no-explicit-any`: `warn`).
- **Unused symbols:** error; ignore names matching `^_` for args/vars; `caughtErrors: 'none'` so unused catch bindings are allowed.
- **Shared config:** `tsconfig.base.json` — `target` es2015, `module` esnext, `skipLibCheck`, path aliases for `@mobile` and `design-tokens`.

## React & React Native

- **JSX runtime:** automatic (no `React` import required for JSX in modern setup).
- **ESLint:** `react/react-in-jsx-scope` off; React version `detect`.
- **Hooks rules:** `react-hooks/refs` off (Animated / RN patterns).
- **`react-hooks/set-state-in-effect`:** off — documented in `eslint.config.mjs` as intentional for modal reset patterns.
- **File-level exception:** `apps/MOBILE/components/Logo.tsx` allows `@typescript-eslint/no-require-imports` off (asset `require`).

## Formatting

- **Prettier** is the formatter of record; **`eslint-config-prettier`** disables conflicting ESLint rules.
- **`lint-staged`** runs ESLint `--fix` and Prettier on staged `ts/tsx/js/jsx` and Prettier on json/md/css/yaml (`package.json`).

## Imports & aliases

- Prefer **`@mobile/...`** for cross-folder imports inside the app (matches TS paths).
- **`@/`** is an alternate alias to the MOBILE app root in Babel; some screens use it (e.g. `HomeScreen.tsx` imports `@/components/ui`).
- **Env:** only `ENV` object from `apps/MOBILE/utils/constants/env.ts`; raw `@env` imports are centralized there.

## State management

- **Redux Toolkit** — `configureStore`, `combineReducers` in `apps/MOBILE/store/index.ts`.
- **Persistence:** `redux-persist` with `whitelist` to limit what is stored; encryption transform applied to the persisted subtree.
- **Serializable check:** ignores standard persist action types; comment notes `immutableCheck` was disabled to avoid TS/process issues.

## Backend / Realm

- **Writes** wrapped in `realm.write(() => { ... })` inside services.
- **Errors:** `throw new Error(...)` for missing entities (e.g. `UserService.updateUser`).
- **Queries:** Realm `filtered`, `sorted`, cursor pagination by `createdAt` where applicable (`apps/MOBILE/backend/services/UserService.ts` as reference).
- **UI boundary:** expose **plain objects** via `realmHelpers.ts` (`PlainUser`, `toPlainUser`, etc.) rather than passing live Realm objects to React.

## Styling

- **NativeWind:** `className` on RN primitives; semantic tokens like `bg-background`, `text-secondary` tied to CSS variables / theme.
- **Components:** UI kit in `apps/MOBILE/components/ui/` uses variant props (e.g. `Text` `variant="headlineSmall"`).

## Documentation

- Internal doc example: `apps/MOBILE/docs/navigation-setup.md` for navigation conventions (screen name constants, etc.).

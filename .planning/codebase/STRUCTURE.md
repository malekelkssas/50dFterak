# Repository structure

## Root

| Path                 | Purpose                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `package.json`       | Workspace scripts (lint, format, Nx-wrapped Android commands, `start:MOBILE`), shared devDependencies, `lint-staged`, pnpm overrides |
| `pnpm-lock.yaml`     | Lockfile                                                                                                                             |
| `nx.json`            | Nx configuration, plugins, Nx Cloud id                                                                                               |
| `tsconfig.base.json` | Shared TS options, path aliases `@mobile/*`, `design-tokens`                                                                         |
| `eslint.config.mjs`  | Flat ESLint config for `apps/**` and `libs/**`                                                                                       |
| `.husky/`            | Git hooks (pre-commit → lint-staged)                                                                                                 |

## `apps/MOBILE/` — React Native app

| Path                                                       | Purpose                                       |
| ---------------------------------------------------------- | --------------------------------------------- |
| `src/main.tsx`                                             | App registration                              |
| `src/app/App.tsx`                                          | Providers + navigation shell                  |
| `navigation/index.tsx`                                     | Stack + tab navigators                        |
| `screens/`                                                 | Screen components per route                   |
| `components/ui/`                                           | Generic UI primitives                         |
| `components/users/`, `invoices/`, `customers/`             | Feature-specific components                   |
| `backend/`                                                 | Realm (`realm.ts`), models, services, helpers |
| `store/`                                                   | Redux store, slices                           |
| `hooks/`                                                   | Shared hooks (`useStore`, feature hooks)      |
| `utils/`                                                   | Constants, formatters, types                  |
| `global.css`                                               | Tailwind / NativeWind global styles           |
| `metro.config.js`, `babel.config.js`, `tailwind.config.js` | Bundler and styling toolchain                 |
| `android/`                                                 | Native Android project                        |
| `project.json`                                             | Nx targets (Gradle, adb)                      |
| `package.json`                                             | App runtime dependencies                      |
| `docs/navigation-setup.md`                                 | Internal navigation documentation             |

## `libs/design-tokens/`

| Path           | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `src/index.ts` | Exported light/dark CSS variable maps for NativeWind |

## Naming conventions (observed)

- **Screens:** `*Screen.tsx` in `apps/MOBILE/screens/`.
- **Services:** `*Service.ts`, singleton with `getInstance()` in `apps/MOBILE/backend/services/`.
- **Realm models:** PascalCase class matching entity (`User`, `Order`, `Invoice`) in `apps/MOBILE/backend/models/`.
- **UI components:** PascalCase files under `components/`.
- **Redux slices:** `*Slice.ts` under `apps/MOBILE/store/slices/`.

## Generated / vendor (typically ignored for app logic)

- `node_modules/`, `apps/MOBILE/android/build/`, `.nx/` — build caches and dependencies; ESLint explicitly ignores `android/`, `ios/`, `build/`, config files per `eslint.config.mjs`.

## Alias quick reference

- Import from app internals: `@mobile/...` or `@/...` (see `tsconfig.base.json` and `apps/MOBILE/babel.config.js`).
- Shared tokens: `import { lightColorVars } from 'design-tokens'` (path from `tsconfig.base.json`).

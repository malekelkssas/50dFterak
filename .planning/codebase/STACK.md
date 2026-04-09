# Technology stack

## Monorepo & tooling

- **Package manager:** `pnpm@10.30.3` (see root `package.json`).
- **Monorepo:** [Nx](https://nx.dev) `22.5.3` — `nx.json`, plugins `@nx/react-native`, `@nx/vite`, `@nx/web`, `@nx/js`, `@nx/node`.
- **Node:** `>= 22.11.0` (`engines` in root `package.json`).

## Languages & runtime

- **TypeScript** `~5.9.2` — shared `tsconfig.base.json` at repo root.
- **React** `19.2.3` (pinned via `pnpm.overrides` in root `package.json`).
- **React Native** `^0.84.1` — primary app in `apps/MOBILE/`.
- **Hermes:** `hermes-compiler` listed in `apps/MOBILE/package.json`.

## Mobile app (`apps/MOBILE`)

- **UI:** NativeWind `^4.2.3` + Tailwind `^3.4.19` (app devDependency; root overrides align `nativewind` with Tailwind 3.4.x).
- **Styling entry:** `apps/MOBILE/global.css`, wired via `nativewind/babel` and `withNativeWind` in `apps/MOBILE/metro.config.js`.
- **Navigation:** `@react-navigation/native`, native-stack, bottom-tabs (`apps/MOBILE/navigation/index.tsx`).
- **State:** `@reduxjs/toolkit`, `react-redux`, `redux-persist` + `redux-persist-transform-encrypt`, `@react-native-async-storage/async-storage` (`apps/MOBILE/store/index.ts`).
- **Local database:** `realm` `^12.14.1` — schema and singleton in `apps/MOBILE/backend/realm.ts`.
- **Animation / gestures:** `react-native-reanimated`, `react-native-gesture-handler`, `react-native-worklets`.
- **Icons:** `lucide-react-native`.
- **SVG:** `react-native-svg` + `react-native-svg-transformer` (Metro in `apps/MOBILE/metro.config.js`).
- **Env in app code:** `react-native-dotenv` → `@env` module (`apps/MOBILE/babel.config.js`, `apps/MOBILE/utils/constants/env.ts`).

## Shared library

- **`libs/design-tokens`** — CSS variable maps for light/dark (`libs/design-tokens/src/index.ts`), consumed as path alias `design-tokens` from `tsconfig.base.json`.

## Build & bundling

- **Metro:** `apps/MOBILE/metro.config.js` — `@nx/react-native` `withNxMetro`, SVG transformer, NativeWind.
- **Babel:** `apps/MOBILE/babel.config.js` — module-resolver aliases `@mobile` / `@`, Reanimated plugin (must stay last), conditional presets for Nx build vs RN dev.
- **Android:** Gradle under `apps/MOBILE/android/`; Nx targets in `apps/MOBILE/project.json` (`android-build-debug`, `android-build-release`, install/clean/adb helpers).

## Lint & format

- **ESLint 9** flat config: `eslint.config.mjs` — `typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-config-prettier`.
- **Prettier** `~3.6.2` + `prettier-plugin-tailwindcss`.
- **Git hooks:** Husky `^9.1.7`, `lint-staged` in root `package.json` (`.husky/pre-commit` runs `pnpm exec lint-staged`).

## Optional / scaffolded but light use

- Root devDependencies include **Vite** `^7`, **Vitest** `^4`, `@nx/vite` — Nx plugin registered in `nx.json`; no app-level Vitest config or `*.spec.ts` files were found in the mapped tree. Treat as available for future web/libs testing, not currently driving the MOBILE app.

## Path aliases

- TypeScript: `@mobile/*` → `apps/MOBILE/*`, `design-tokens` → `libs/design-tokens/src/index.ts` (`tsconfig.base.json`).
- Babel (MOBILE): `@mobile` and `@` resolve to `apps/MOBILE` root (`apps/MOBILE/babel.config.js`).

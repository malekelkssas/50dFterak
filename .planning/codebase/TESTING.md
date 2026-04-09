# Testing

## Current state

- **No unit or integration test files** matching `*.spec.ts`, `*.test.ts`, or `*.spec.tsx` were found under `apps/` or `libs/` at mapping time.
- The **MOBILE** Nx `project.json` defines **Android Gradle and adb targets only** — no `test` executor configured for the app in that file.

## Tooling present but unused for MOBILE

- **Vitest** `^4.0.0` and **@vitest/ui** are in the **root** `package.json` devDependencies.
- **@nx/vite** is registered in `nx.json` with standard target names (`test`, `typecheck`, etc.) for Vite-based projects.
- **jsdom** `~22.1.0` is available for DOM-like test environments.

**Implication:** The repo is set up to add **web or library** tests via Vitest/Nx in the future; the React Native app is **not** currently covered by an automated test target discovered in this map.

## Linting as quality gate

- **`pnpm run lint`** / **`lint:strict`** — ESLint over `apps/**/*` and `libs/**/*` (`package.json` scripts).
- **Pre-commit:** Husky runs `lint-staged`, which enforces ESLint + Prettier on staged files.

## Manual / device testing (inferred)

- Scripts such as `android:build-debug`, `android:install-debug`, `start:MOBILE` (`package.json`) support **on-device or emulator** verification.
- **`adb:reconnect`** — `adb reverse` for Metro (`apps/MOBILE/project.json`).

## Recommendations (for future planning — not implemented)

- Add **React Native Testing Library** + Jest (or Nx’s RN test preset) if component tests are desired.
- Consider **Detox** or **Maestro** for E2E if critical flows need regression coverage.
- If introducing **Vitest**, scope initial tests to **`libs/design-tokens`** or future pure TS libraries where RN mocking is unnecessary.

# Concerns & technical debt

## Security

- **Redux persist encryption fallback:** `apps/MOBILE/store/index.ts` uses `secretKey: ENV.REDUX_PERSIST_SECRET_KEY || 'fallback-dev-secret'`. If `.env` is missing in a **release** build, persisted state could be encrypted with a **known default**. Mitigation: fail fast in production when the key is unset, or use a build-time assert.
- **Secrets in repo:** Ensure `apps/MOBILE/.env` and Android signing keys stay gitignored; the mapper did not audit `.gitignore` contents in depth — verify before open-sourcing.

## Data & migrations

- **Realm schema evolution:** `apps/MOBILE/backend/realm.ts` sets `schemaVersion: 3` with no migration callbacks visible in that file. Bumping schema without migration logic can cause **data loss or startup failures** on user devices. Review Realm migration strategy before model changes.
- **Cascade deletes:** User deletion manually removes related orders in `UserService.deleteUser` — other relationships (invoices, etc.) should be audited for orphan rules consistency.

## Code health

- **Redux immutable checks disabled** in `configureStore` (comment references TS/process errors). This reduces runtime safety against accidental mutation.
- **Minimal Redux usage vs. persistence complexity:** Only `counter` is whitelisted for persist, yet encryption transform applies to the persisted reducer — understandability cost for new contributors.
- **Alias inconsistency:** Mix of `@mobile/...` and `@/...` imports across the app increases cognitive load; standardizing on one style would simplify onboarding.

## Quality gates

- **No automated test suite** (see `TESTING.md`) — regressions rely on manual checks and lint.
- **No CI workflows** under `.github/` were found at mapping time — no guaranteed pre-merge lint/test in cloud.

## Performance & UX (unverified)

- Large Realm result sets: services use pagination in places (`UserService.getUsers`); other list screens should follow the same pattern to avoid loading entire tables into memory.
- **Reanimated / worklets:** Version alignment between `react-native-reanimated` and `react-native-worklets` must stay compatible with RN 0.84 — watch upgrade churn.

## Product / i18n

- **Mixed tab labels** (English + Arabic) in `apps/MOBILE/navigation/index.tsx` — if full i18n is a goal, centralize strings and RTL handling to avoid inconsistent UX.

## Dependency surface

- **Nx Cloud** ID in `nx.json` ties the workspace to Nx’s service — acceptable for teams using Cloud; confirm compliance if repo is forked or made private differently.

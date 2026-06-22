# CareConnect — Mobile (Expo / React Native)

The mobile build of **CareConnect**, a healthcare/caregiver app designed around
four WCAG-aligned accessibility constraints (large interactive buttons,
confirmation dialogs, double-tap prevention, reduced motion).

This Expo app is the team's **reference implementation** — the Flutter app
(`apps/flutter-app`) is kept at feature parity with it.

**Stack:** Expo SDK 54 · React Native 0.81 · React 19 · Expo Router (file-based) ·
TypeScript. Data is served by a built-in in-memory mock API, so **no backend is
required** — the app and all tests work offline.

## Prerequisites

- Node.js 20 LTS+ and pnpm 9+
- For device runs / E2E: Android Studio (+ an emulator) or, on macOS, Xcode

Install dependencies from the repo root (see the [root README](../../README.md)):

```bash
pnpm install
```

## Running

```bash
cd apps/mobile
pnpm start        # Expo dev server — then press a / i / w for Android / iOS / web
pnpm android      # build & run on Android (expo run:android)
pnpm ios          # build & run on iOS (macOS only)
pnpm web          # run in the browser
```

Demo credentials: **`demo@careconnect.com` / `demo123`** (the mock API accepts any
email/password).

## Testing

```bash
cd apps/mobile
pnpm test                                  # Jest: unit + integration (with coverage)
npx jest --testPathPattern=integration     # integration tests only
pnpm e2e                                    # Maestro E2E flows (requires an emulator)
pnpm lint                                   # ESLint
```

- **Unit + integration** — Jest + React Native Testing Library + MSW. Details and
  pitfalls: [docs/integration-testing.md](docs/integration-testing.md). Coverage
  report: [docs/coverage-report.md](docs/coverage-report.md). Thresholds: 75%
  statements/lines, 70% branches/functions.
- **End-to-end** — Maestro (Android), with prerequisites and CI setup in
  [e2e/README.md](e2e/README.md).
- **Screen reader / TalkBack** — manual guide in
  `docs/talkback-manual-testing.docx`; `pnpm talkback` / `pnpm talkback:off`
  toggle TalkBack on a connected device.

## Project structure

```
src/
  app/                  Expo Router routes — (auth) and (tabs) route groups
  features/<feature>/   context + models + components per feature
  services/             api.ts, mock-api.ts, validation.ts
  shared/               shared components, contexts, hooks
  data/seeds.ts         demo / seed data
  __tests__/            unit, integration, and a11y test suites
e2e/                    Maestro end-to-end flows
```

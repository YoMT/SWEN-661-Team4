# CareConnect — Desktop (Electron)

The desktop build of CareConnect, the cross-platform caregiver app for people
managing care for a loved one with Parkinsonian tremors. Built with
**Electron + React + TypeScript** (via [electron-vite](https://electron-vite.org)).

This app shares its **data model and feature logic with `apps/mobile`** — the
domain types, mock backend, validation, and feature state are ported from the
mobile reference so the two stay in parity.

## Status

Initial implementation with the core screens **wired up to live state** (React
context over an in-memory mock backend — no server required):

| Screen           | Wired up | What works                                                              |
| ---------------- | :------: | ---------------------------------------------------------------------- |
| **Login**        |    ✅    | Email/password validation, demo auth, session persisted to `localStorage` |
| **Dashboard**    |    ✅    | Live dose / appointment / symptom counts, next-med & next-appt cards, quick links, refresh |
| **Medications**  |    ✅    | Dose list sorted by urgency, **Mark as taken** (optimistic update reflected on the Dashboard) |
| **Appointments** |    ✅    | Today vs. upcoming visits from shared state                            |
| **Symptoms**     |    ✅    | Recent log list **and** a working "Log a symptom" form (type, severity, note) |

### Demo account

```
email:    demo@careconnect.com
password: demo123
```

## Architecture

```
src/
  main/            Electron main process (window lifecycle)
  preload/         Context-isolated bridge
  renderer/src/
    types.ts       Shared domain types (User, Medication, Appointment, …)
    services/      api client + in-memory mock backend + form validation
    state/         React context providers (auth, profile, meds, appts, symptoms)
                   + AppProviders composer + useDashboard aggregator hook
    components/    Sidebar (navigation shell)
    screens/       Login, Dashboard, Medications, Appointments, Symptoms
    assets/        theme.css (CareConnect palette, mirrors the mobile tokens)
    App.tsx        Auth gate + sidebar-driven view switching
```

State flows the same way as the mobile app: feature **providers** load data from
the `api` service (which resolves to the bundled mock backend) and expose it via
hooks. A shared `RefreshProvider` lets the Dashboard re-pull everything, and
`useDashboard` aggregates cross-feature counts. Because Medications and the
Dashboard read the same provider, marking a dose taken updates both instantly.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

Run from the **repo root** (this app is part of the pnpm workspace):

```bash
pnpm install
```

### Development

```bash
cd apps/desktop
pnpm dev          # launch Electron with HMR
pnpm typecheck    # type-check main + preload + renderer
pnpm lint         # eslint
```

### Build

```bash
pnpm build:win    # Windows installer
pnpm build:mac    # macOS app (macOS only)
pnpm build:linux  # Linux package
```

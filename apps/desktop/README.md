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

## Troubleshooting

### `pnpm` is not found

`pnpm` may not be on your PATH. It ships with Node via Corepack, which honors the
repo's pinned pnpm version — just prefix commands with `corepack`:

```bash
corepack pnpm install
cd apps/desktop
corepack pnpm dev
```

### `Error: Electron uninstall` when running `pnpm dev`

The Vite dev server starts (e.g. `http://localhost:5173`) but Electron fails to
launch with:

```
error during start dev server and electron app:
Error: Electron uninstall
    at getElectronPath (.../electron-vite/dist/chunks/lib-*.js)
```

This means Electron's prebuilt binary wasn't extracted during install — its
`dist/electron(.exe)` and `path.txt` are missing (the download can fail silently
on Windows). The download itself is usually cached, so re-running the install
script extracts it without re-downloading:

```bash
corepack pnpm rebuild electron
```

If that still leaves the binary missing, extract the cached zip manually
(Windows / PowerShell — adjust the version and cache hash to match yours):

```powershell
$pkg = Resolve-Path "..\..\node_modules\.pnpm\electron@*\node_modules\electron"
$zip = Get-ChildItem "$env:LOCALAPPDATA\electron\Cache\*\electron-v*-win32-x64.zip" | Select-Object -First 1
Remove-Item "$pkg\dist" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory "$pkg\dist" | Out-Null
Expand-Archive $zip.FullName "$pkg\dist" -Force
if (Test-Path "$pkg\dist\electron.d.ts") { Move-Item "$pkg\dist\electron.d.ts" "$pkg\electron.d.ts" -Force }
Set-Content "$pkg\path.txt" -Value "electron.exe" -NoNewline -Encoding ascii
```

Verify from `apps/desktop`:

```bash
node -e "const p=require('electron'); console.log(p, require('fs').existsSync(p))"
```

It should print the path to `electron.exe` and `true`.

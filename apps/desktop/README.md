# CareConnect — Desktop (Electron)

The desktop build of CareConnect, the cross-platform caregiver app for people
managing care for a loved one with Parkinsonian tremors. Built with
**Electron + React + TypeScript** (via [electron-vite](https://electron-vite.org)).

This app shares its **data model and feature logic with `apps/mobile`** — the
domain types, mock backend, validation, and feature state are ported from the
mobile reference so the two stay in parity.

## Status

Implements the **CareConnect Desktop Design System** (`DESKTOP_DESIGN_SYSTEM.md`)
and the keyboard-first **accessibility model** (`DESKTOP_ACCESSIBILITY.md`):
a full desktop shell over live state (React context + in-memory mock backend, no
server required).

### App shell (§3)

`title bar → menu bar → contextual toolbar → sidebar + content + assistant panel → status bar`

- **Custom frameless title bar** with real, labelled window controls (§3.1).
- **Menu bar** File / Edit / View / Help (`role="menubar"`, dropdowns, check &
  radio items) plus a **native application menu** that registers the cross-platform
  `CmdOrCtrl` accelerators (§3.2 / §6).
- **Contextual toolbar** (`role="toolbar"`, roving tabindex) whose actions change
  per screen; care-write buttons keep the 44px critical floor (§3.3).
- **Sidebar** primary nav with roving focus, `aria-current`, count badges, ⌘B
  collapse (§3.4).
- **Dockable Peggy assistant** panel (⌘J, `role="log"`, wired to `/ai/chat`) —
  replaces the mobile floating FAB (§3.8).
- **Status bar** (`contentinfo`) with sync state + due counts (icon+text, never
  color alone) (§3.7).
- **Command palette** (⌘K) — a keyboard path to every action (§3.3).
- **Two-step confirm dialog** for care writes, focus-trapped, Esc cancels (§3.6).

### Screens (wired to live state)

| Screen | What works |
| --- | --- |
| **Login** | Split-screen (§3.10), validation, demo auth, session in `localStorage` |
| **Dashboard** | Live dose / appointment / symptom tiles, next-up cards, quick actions |
| **Medications** | Keyboard **grid** (↑/↓/Home/End, Space/T to mark taken); Mark-as-taken is ≥44px with a **600ms debounce** + **two-step confirm** |
| **Appointments** | Today vs. upcoming from shared state |
| **Symptoms** | Recent-log list + working "Log a symptom" form |
| **Profile** | Account info + **accessibility preferences** (theme, text size, Tremor mode, reduce motion) + sign out |

### Accessibility (the four pillars + WCAG 2.1 AA)

- **Design tokens** (`assets/theme.css`, mirrored in `theme/tokens.ts`) — color,
  chrome, spacing, type, radius, elevation; **light + `[data-theme="dark"]`** and
  the **Accessible/Tremor density** via `[data-density="accessible"]` (§2/§7).
- **Keyboard-first** — ⌘1…5 nav, ⌘B/⌘J/⌘K, **F6 region cycling**, Esc precedence,
  roving tabindex in menu/toolbar/sidebar/grid; `:focus-visible` rings; landmarks
  + skip link (§4).
- **Reduce Motion** default on, honoring `prefers-reduced-motion` (Pillar 4).
- **Live regions** announce saves, marks and refreshes (§4.6).

### Demo account

```
email:    demo@careconnect.com
password: demo123
```

## Architecture

```
src/
  main/
    index.ts       Frameless window + window-control IPC + native menu wiring
    menu.ts        Native application menu (accelerators → menu:action)
  preload/         contextBridge: window controls + onMenuAction
  renderer/src/
    types.ts       Shared domain types (User, Medication, Appointment, …)
    actions.ts     ActionId catalog + command-palette commands
    theme/         tokens.ts (TS mirror of the CSS design tokens)
    lib/           use-debounced-action (600ms care-write guard, Pillar 3)
    services/      api client + in-memory mock backend + form validation
    state/         ui-context (prefs/chrome/confirm/live) + feature providers
                   (auth, profile, meds, appts, symptoms) + useDashboard
    components/    TitleBar, MenuBar, Toolbar, Sidebar, StatusBar,
                   AssistantPanel, ConfirmDialog, CommandPalette
    screens/       Login, Dashboard, Medications, Appointments, Symptoms, Profile
    assets/        theme.css (design-system tokens + shell + components)
    App.tsx        Auth gate + shell assembly + central action dispatcher + shortcuts
```

State flows as on mobile: feature **providers** load from the `api` service
(bundled mock backend) and expose hooks; a shared `RefreshProvider` re-pulls
everything; `useDashboard` aggregates counts; `ui-context` owns preferences,
chrome visibility, the two-step `confirm()` promise and live-region announcements.
Every command resolves through a single dispatcher in `App.tsx`, fed by the native
menu, the in-window menu bar, the toolbar and the command palette.

### Deferred (see DESKTOP_ACCESSIBILITY.md §11 "Known Limitations")

New-medication / new-appointment / edit-profile forms, right-click context menus,
and the Emergency Contacts / Caretaker Notes / Generate Report destinations are
present as affordances that announce "coming soon"; the assistant uses the mock
`/ai/chat` service.

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

# CareConnect

CareConnect is a cross-platform Healthcare Management Application designed to support caregivers with Parkinsonian tremors. Built around four WCAG-aligned accessibility constraints — large interactive buttons, confirmation dialogs, double-tap prevention, and reduced motion — CareConnect lets caregivers manage medications, appointments, and daily tasks comfortably across mobile, desktop, and web.

**SWEN 661 — UI Implementation | Team 4 | Four Settings. Three Platforms. Twelve Weeks.**

---

## Team Members

| Name             | GitHub                                                 | Email                        | Timezone | OS      |
| ---------------- | ------------------------------------------------------ | ---------------------------- | -------- | ------- |
| Yoseph Tesfay    | [@Yomt](https://github.com/Yomt)                       | Yoseph.Tesfay@gmail.com      | EST      | Windows |
| Donielle Kinchen | [@doniellekinchen](https://github.com/doniellekinchen) | donielle.kinchen10@gmail.com | EST      | macOS   |
| Nuboke Bakoh     | [@Priestb](https://github.com/priestb)                 | priestbakoh@gmail.com        | EST      | Windows |

---

## Team Charter

[View our Team Charter](https://docs.google.com/document/d/1G-NQBSQN3e_H8n3KQnnoJqcNBoXhEuNa4imjHx6JKnM/edit?tab=t.0)

---

## Setup Instructions

### Prerequisites

Ensure the following tools are installed before cloning:

| Tool                                                                                                  | Version                  | Required for                |
| ----------------------------------------------------------------------------------------------------- | ------------------------ | --------------------------- |
| [Git](https://git-scm.com/)                                                                           | Latest                   | All platforms               |
| [Node.js](https://nodejs.org/)                                                                        | 20 LTS or higher         | Web, Mobile, Desktop        |
| [pnpm](https://pnpm.io/)                                                                              | 9+                       | Monorepo package management |
| [Flutter](https://flutter.dev/docs/get-started/install)                                               | 3.32+ (Dart SDK ^3.12.1) | Flutter app                 |
| [Android Studio](https://developer.android.com/studio) or [Xcode](https://developer.apple.com/xcode/) | Latest                   | Flutter mobile targets      |

Verify your installs:

```bash
git --version
node --version
pnpm --version
flutter doctor
```

---

### 1. Clone the Repository

```bash
git clone https://github.com/YoMT/SWEN-661-Team4.git
cd SWEN-661-Team4
```

Install all JS/TS workspace dependencies from the repo root:

```bash
pnpm install
```

> The Flutter app (`apps/flutter-app`) is **not** part of the pnpm workspace. Its dependencies are managed separately via `flutter pub get` (see step 2).

---

### 2. Frontend Setup

The monorepo contains four apps. Set up each one based on what you're working on.

#### Web App (`apps/web`) — React + Vite + TypeScript

```bash
cd apps/web
pnpm dev          # start dev server at http://localhost:5173
pnpm build        # production build
pnpm preview      # preview production build locally
```

#### Mobile App (`apps/mobile`) — Expo + React Native

```bash
cd apps/mobile
pnpm start        # start Expo dev server
# Then press:
#   a  → open Android emulator
#   i  → open iOS simulator (macOS only)
#   w  → open in browser
```

#### Desktop App (`apps/desktop`) — Electron + React + TypeScript

```bash
cd apps/desktop
pnpm dev          # launch Electron in dev mode
pnpm build:win    # build Windows installer
pnpm build:mac    # build macOS app (macOS only)
```

#### Flutter App (`apps/flutter-app`) — Flutter (mobile, desktop, web)

```bash
cd apps/flutter-app
flutter pub get          # install Dart dependencies

flutter run              # run on connected device or emulator
flutter run -d chrome    # run as web app
flutter run -d windows   # run as Windows desktop app
flutter build apk        # build Android APK
flutter build ios        # build iOS (requires macOS + Xcode)
```

---

## Branch Strategy

We follow a **feature-branch workflow** with two long-lived branches:

| Branch    | Purpose                                                    |
| --------- | ---------------------------------------------------------- |
| `main`    | Stable, deployable code. Protected — no direct pushes.     |
| `develop` | Integration branch. All feature branches merge here first. |

### Feature Branches

Branch off `develop` using the naming convention:

```
<platform>/<short-description>
```

Examples:

```
flutter/medication-screen
web/appointment-modal
desktop/settings-panel
mobile/confirmation-dialog
shared/accessibility-tokens
```

### Workflow

```bash
# 1. Always branch from develop
git checkout develop
git pull origin develop
git checkout -b flutter/medication-screen

# 2. Commit with descriptive messages
git commit -m "feat(flutter): add medication list screen with large-button layout"

# 3. Push and open a Pull Request targeting develop
git push origin flutter/medication-screen
```

### Pull Request Rules

- All PRs target `develop`, not `main`
- At least **1 team member review** required before merging
- Resolve all review comments before merge
- `main` is updated via a PR from `develop` at each project milestone

### Commit Message Format

```
<type>(<scope>): <short description>
```

| Type       | Use for                                |
| ---------- | -------------------------------------- |
| `feat`     | New feature                            |
| `fix`      | Bug fix                                |
| `style`    | UI/styling changes only                |
| `refactor` | Code restructuring, no behavior change |
| `docs`     | Documentation updates                  |
| `test`     | Adding or updating tests               |
| `chore`    | Build scripts, config, tooling         |

Scopes: `flutter`, `web`, `mobile`, `desktop`, `shared`

# CareConnect

CareConnect is a cross-platform Healthcare Management Application designed to support caregivers with Parkinsonian tremors. Built around four WCAG-aligned accessibility constraints — large interactive buttons, confirmation dialogs, double-tap prevention, and reduced motion — CareConnect lets caregivers manage medications, appointments, and daily tasks comfortably across mobile, desktop, and web.

**SWEN 661 — UI Implementation | Team 4 | Four Settings. Three Platforms. Twelve Weeks.**

---

## Team Members

| Name | GitHub | Email | Timezone | OS |
|------|--------|-------|----------|-----|
| Yoseph Tesfay | [@Yomt](https://github.com/Yomt) | Yoseph.Tesfay@gmail.com | EST | Windows |
| Donielle Kinchen | [@doniellekinchen](https://github.com/doniellekinchen) | donielle.kinchen10@gmail.com | EST | macOS |
| Nuboke Bakoh | [@Priestb](https://github.com/priestb) | priestbakoh@gmail.com | EST | Windows |

---

## Team Charter

[View our Team Charter](https://docs.google.com/document/d/1G-NQBSQN3e_H8n3KQnnoJqcNBoXhEuNa4imjHx6JKnM/edit?tab=t.0)

---

## Setup Instructions

> ⚠️ This section will be updated as development progresses.

### Prerequisites

- Flutter SDK 3.8.1+
- Git
- VS Code (with Flutter and Dart extensions) or Android Studio
- Java JDK 17+
- Docker Desktop (for backend database)

**macOS only:**
- Xcode 26.5+
- CocoaPods

### 1. Clone the Repository

```bash
git clone https://github.com/YoMT/SWEN-661-Team4.git
cd SWEN-661-Team4
git checkout team_4
```

### 2. Frontend Setup

```bash
cd frontend
flutter pub get
flutter doctor
```

Run on a device:

```bash
flutter run -d chrome       # Web
flutter run -d android      # Android emulator
```

### 3. Backend Setup

> Backend setup instructions coming soon. Will require Docker and PostgreSQL.

---

## Branch Strategy

- All work branches off of and merges back into `team4`
- Branch format: `<type>/<issue-number>-<short-description>`
- Example: `feature/1-tremor-filter-module`
- Direct commits to `main` are not permitted

---

## The Four Accessibility Settings

| Setting Key | Default | Behavior |
|-------------|---------|----------|
| `largeButtons` | false | Scales all interactive targets from 44 to 64 dp/px |
| `confirmImportantActions` | false | Adds a 500ms hold-to-confirm on destructive actions |
| `ignoreDoubleTaps` | false | Ignores repeat taps within 400ms to suppress tremor double-fires |
| `reduceMotion` | OS pref | Disables non-essential animations; defaults to OS setting |

# CareConnect Mobile — E2E Tests (Maestro)

End-to-end tests for the CareConnect React Native app using
[Maestro](https://maestro.mobile.dev). Flows exercise complete user
journeys against a live running app on an iOS simulator or Android emulator.

---

## Why Maestro

- **No native build changes required** — works with Expo Go or an Expo dev build
- **Uses existing accessibility labels** — every button and input in the app already has
  an `accessibilityLabel` (from the WCAG 2.1 AA audit); Maestro finds elements by `label:`
  directly — no `testID` props needed
- **YAML flows** double as readable documentation of the user journey

---

## Prerequisites

### 1. Install Maestro CLI

**macOS / Linux:**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

**Windows (PowerShell):**
```powershell
iwr -Uri "https://get.maestro.mobile.dev/install.ps1" -OutFile "$env:TEMP\install-maestro.ps1"
& "$env:TEMP\install-maestro.ps1"
```

Verify: `maestro --version`

### 2. Start the App on a Simulator or Emulator

```bash
# From apps/mobile/
pnpm start --ios      # iOS Simulator
pnpm start --android  # Android Emulator
```

The app uses its built-in mock API when `EXPO_PUBLIC_API_URL` is not set, so
**no real backend is needed** — all flows work out-of-the-box.

**Default credentials used in flows:** `demo@careconnect.com` / `demo123`
(accepted by the mock API for any email/password combination).

---

## App ID

| Platform | App ID |
|---|---|
| iOS dev build | `com.anonymous.mobile` |
| Android dev build | `com.anonymous.mobile` |
| Expo Go (iOS) | `host.exp.exponent` — see note below |

> **Expo Go note**: If running inside Expo Go (not a custom dev build), omit `appId` from the
> flow header and start the app first; Maestro auto-detects the foreground app.
> Remove the `appId:` line and the `launchApp` step, then run `maestro test` after the app
> is visible on screen.

---

## Flows

| File | Journey |
|---|---|
| `flows/auth-login.yaml` | Landing → Sign in → Dashboard |
| `flows/auth-signup.yaml` | Landing → Create account → Dashboard |
| `flows/medication-add.yaml` | Login → Medications tab → Add medication → Verify in list |
| `flows/symptom-log.yaml` | Login → Symptoms tab → Log pain symptom → Verify success banner |
| `flows/dashboard-navigation.yaml` | Login → All tab bar tabs + dashboard quick links |
| `flows/profile-journey.yaml` | Login → Edit profile → Emergency log → Reply to caretaker note → Peggy AI chat |

---

## Running Tests

```bash
# Single flow
maestro test e2e/flows/auth-login.yaml

# All flows (sequential)
maestro test e2e/flows/

# All flows with JUnit output (CI)
maestro test e2e/flows/ --format junit --output coverage/e2e-results.xml
```

Or use the npm script aliases:

```bash
pnpm e2e              # runs all flows
pnpm e2e:auth         # login flow only
pnpm e2e:all          # all flows + JUnit XML to coverage/e2e-results.xml
```

---

## Directory Structure

```
e2e/
  _helpers/
    login.yaml              # Reusable login sub-flow (imported via runFlow:)
  flows/
    auth-login.yaml
    auth-signup.yaml
    medication-add.yaml
    symptom-log.yaml
    dashboard-navigation.yaml
    profile-journey.yaml
  README.md
```

---

## Selector Strategy

All flows use `label:` (Maestro maps this to `accessibilityLabel` in React Native):

```yaml
- tapOn:
    label: "Email address"     # finds the TextInput with accessibilityLabel="Email address"
- inputText: "demo@careconnect.com"
```

Visible text is used as fallback for button labels where the text and `accessibilityLabel`
are the same (e.g., `tapOn: "Sign In"`).

---

## CI Integration

Add to your CI pipeline after `pnpm test` (unit/integration):

```yaml
# Example GitHub Actions step
- name: Start iOS Simulator
  run: xcrun simctl boot "iPhone 15"

- name: Start Expo app
  run: cd apps/mobile && pnpm start --ios &
  env:
    EXPO_PUBLIC_API_URL: ""   # use mock API

- name: Wait for app to load
  run: sleep 30

- name: Run E2E flows
  run: cd apps/mobile && maestro test e2e/flows/ --format junit --output coverage/e2e-results.xml

- name: Upload E2E results
  uses: actions/upload-artifact@v3
  with:
    name: e2e-results
    path: apps/mobile/coverage/e2e-results.xml
```

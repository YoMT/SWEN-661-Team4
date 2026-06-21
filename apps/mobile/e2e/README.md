# CareConnect Mobile — E2E Tests (Maestro · Android)

End-to-end tests for the CareConnect React Native app using
[Maestro](https://maestro.mobile.dev). Flows target an **Android emulator or
physical device** connected via ADB.

---

## Why Maestro

- No native build changes required — works with Expo Go or an Expo dev build
- Uses existing `accessibilityLabel` props (set during WCAG 2.1 AA audit) via
  Maestro's `tapOn: label:` — no `testID` props needed
- YAML flows double as readable documentation of the user journey

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

### 2. Set up Android SDK & ADB

Install [Android Studio](https://developer.android.com/studio) and ensure `adb` is on your PATH:

```bash
adb version   # should print Android Debug Bridge version x.x.x
```

### 3. Start an Android Emulator

**Via Android Studio:** Open AVD Manager → start a device (API 33+ recommended).

**Via command line:**
```bash
# List available AVDs
emulator -list-avds

# Start one (replace with your AVD name)
emulator -avd Pixel_7_API_34 &
```

Confirm it's ready:
```bash
adb devices   # should show: emulator-5554  device
```

### 4. Build & run the app on the emulator

```bash
# From apps/mobile/
pnpm start --android     # Expo Go on emulator — fastest, no build step (recommended on Windows)

# — OR for a standalone dev build —
npx expo run:android
```

The app uses its built-in mock API when `EXPO_PUBLIC_API_URL` is unset,
so **no real backend is needed** — all flows work out-of-the-box.

**Default credentials used in flows:** `demo@careconnect.com` / `demo123`
(mock API accepts any email/password).

---

## App ID

| Target | App ID | Flows directory |
|---|---|---|
| Android dev build | `com.anonymous.mobile` | `e2e/flows/` |
| Android Expo Go | `host.exp.exponent` | `e2e/flows-exponent/` |

> **Recommended on Windows:** Use the Expo Go flows (`flows-exponent/`). They
> require no build step — just `pnpm start --android` and the PowerShell runner.

---

## Flows

Both directories contain the same 6 journeys. The `flows-exponent/` variants
target `host.exp.exponent` and include the auto-login guard (see below).

### `flows-exponent/` — Expo Go (recommended on Windows)

| File | Journey |
|---|---|
| `auth-login.yaml` | Landing → Sign in → Dashboard |
| `auth-signup.yaml` | Landing → Create account → Dashboard |
| `dashboard-navigation.yaml` | Login → All tab bar tabs + dashboard quick links |
| `medication-add.yaml` | Login → Medications tab → Add medication → Verify in list |
| `symptom-log.yaml` | Login → Symptoms tab → Log pain symptom → Verify success banner |
| `profile-journey.yaml` | Login → Emergency contacts → Caretaker notes → Peggy AI → Edit profile |

### `flows/` — Dev build

Same 6 journeys; targets `com.anonymous.mobile`. Use for CI and when running a
standalone dev build (`npx expo run:android`).

---

## Running Tests

### Windows — Expo Go (recommended)

Use the PowerShell runner from the repo root. It force-stops and restarts the
app before each flow and sends BACK + HOME to dismiss any lingering system
overlays (Google Play Services dialogs, SOS screens):

```powershell
powershell -File scripts\run-e2e.ps1
```

Output shows `[PASSED]` / `[FAILED]` per flow and exits non-zero on any failure.

### Dev build / macOS / CI — npm scripts

From `apps/mobile/`:

```bash
# Single flow
maestro test e2e/flows/auth-login.yaml

# All 6 flows (sequential)
maestro test e2e/flows/

# All flows + JUnit XML output (CI)
maestro test e2e/flows/ --format junit --output coverage/e2e-results.xml
```

npm script aliases:

```bash
pnpm e2e              # all flows
pnpm e2e:auth         # login flow only
pnpm e2e:all          # all flows + JUnit XML to coverage/e2e-results.xml
```

> These aliases point to `e2e/flows/` (dev build). For Expo Go flows run them
> directly with `maestro test e2e/flows-exponent/<flow>.yaml` or use
> `scripts/run-e2e.ps1`.

---

## Directory Structure

```
e2e/
  _helpers/
    login.yaml                 # dev-build login sub-flow
    login-exponent.yaml        # Expo Go login (includes auto-login guard)
    logout-exponent.yaml       # Expo Go logout
  flows/                       # dev build (com.anonymous.mobile)
    auth-login.yaml
    auth-signup.yaml
    medication-add.yaml
    symptom-log.yaml
    dashboard-navigation.yaml
    profile-journey.yaml
  flows-exponent/              # Expo Go (host.exp.exponent) — 6/6 passing
    auth-login.yaml
    auth-signup.yaml
    medication-add.yaml
    symptom-log.yaml
    dashboard-navigation.yaml
    profile-journey.yaml
  README.md
```

---

## Auto-Login Guard

Expo Go persists the auth token in SecureStore across app restarts. If a flow
crashes before the logout helper runs, the next flow will open to the Home tab
instead of Landing, causing `assertVisible: "Made for caregivers"` to fail.

`login-exponent.yaml` handles this with optional sign-out steps at the top:

```yaml
- tapOn:
    text: "Profile"
    optional: true
- tapOn:
    text: "Sign out"
    optional: true
- extendedWaitUntil:
    visible: "Made for caregivers"
    timeout: 10000
```

`run-e2e.ps1` force-stops the app between flows and sends `KEYCODE_BACK` +
`KEYCODE_HOME` to dismiss system overlays, but the guard covers any residual
token case.

---

## Selector Strategy

Maestro offers three ways to identify tap targets. Each has a specific role:

| Selector | When to use | Example |
|---|---|---|
| `label:` | Header buttons, TextInput fields, elements in the top ~60% of screen | `tapOn: label: "Go back"` |
| `text:` | Profile LinkRows, tab bar labels, buttons with emoji or arrow suffixes | `tapOn: text: "Emergency contacts"` |
| `point:` | FABs and buttons where `text:` or `label:` cause ambiguity | `tapOn: point: "89%,74%"` |

**`label:`** maps to the Android content-desc (accessibilityLabel). It is the
default and works correctly for header buttons ("Go back", "Edit profile",
"Close assistant"), TextInput fields by their `accessibilityLabel`, and elements
in the fixed header region.

**`text:`** matches visible text rendered by a Text node. Use it for Profile
index LinkRows (e.g., "Emergency contacts", "Caretaker notes") and tab bar items
(`tapOn: "Profile"`). For buttons with trailing emoji or arrows, use a regex:
`tapOn: text: ".*Emergency"`.

**`point:`** bypasses the accessibility tree entirely. Use it when `label:` or
`text:` resolve to the wrong element. Known cases in this app:

| Element | Coordinates | Why |
|---|---|---|
| Peggy FAB (Profile screen) | `"89%,74%"` | `label:` at y ≈ 1730px resolves to Edit Profile header |
| Sign In button | `"50%,64%"` | Case-insensitive text search also matches card title "Sign in" |
| Create Account button | `"50%,70%"` | Same ambiguity pattern as Sign In |

Back navigation uses `tapOn: label: "Go back"` (the app's explicit back button).
The Android system swipe-back gesture is disabled in the app
(`predictiveBackGestureEnabled: false` in `app.json`).

---

## Known Pitfalls

### 1. Gboard crash on `inputText:` with natural-language text

Injecting free-text strings into multiline TextInputs (caretaker notes,
Peggy messages, incident log) triggers Gboard's cloud-autocomplete. The emulator
has no Google network access → a fullscreen "Something went wrong / communicating
with Google servers" dialog appears and blocks all subsequent assertions. This
dialog survives `am force-stop` (it runs in a separate process).

**Fix:** Omit `inputText:` for natural-language TextInputs in E2E flows. Cover
those features with integration tests (MSW + RNTL). Only use `inputText:` for
structured fields: email, password, medication name/dose.

### 2. `pressKey: back` race condition

`pressKey: back` fired immediately after `tapOn:` on a TextInput can arrive
before the keyboard fully renders. Android routes `KEYCODE_BACK` to navigation
when no IME is visible, popping the current route instead of closing the keyboard.
Symptom: the flow navigates one screen too far.

**Fix:** Only use `pressKey: back` to close the keyboard when the app is on a
pushed route where "back" definitively means "close keyboard, not navigate."
To navigate back from a screen with an open keyboard, use `tapOn: label: "Go back"`
— the header back button closes the keyboard as a side effect.

### 3. `label:` mismatch at y > 1500px on Profile index

On the Profile index screen (1080 × 2340 Pixel 5 emulator), `tapOn: label:` for
elements below y ≈ 1500px consistently taps the "Edit profile" header button
instead. This affected `label: "Emergency contacts"` and `label: "Open Peggy
assistant"`.

**Fix:** Use `tapOn: text:` for Profile LinkRows; use `tapOn: point:` for the
PeggyFab. Precede the FAB tap with `tapOn: "Profile"` (re-activates the tab) to
flush any pending navigation animation before firing the coordinate tap.

---

## CI Integration (Android)

```yaml
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: cd apps/mobile && pnpm install

      - name: Install Maestro
        run: curl -Ls "https://get.maestro.mobile.dev" | bash

      - name: Start Android Emulator & run app
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 34
          arch: x86_64
          profile: pixel_6
          script: |
            cd apps/mobile
            pnpm start --android &
            sleep 45
            maestro test e2e/flows/ --format junit --output coverage/e2e-results.xml

      - name: Upload E2E results
        uses: actions/upload-artifact@v4
        with:
          name: e2e-results
          path: apps/mobile/coverage/e2e-results.xml
```

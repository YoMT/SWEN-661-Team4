# CareConnect Flutter — E2E tests

CareConnect Flutter has **two** end-to-end layers:

| Layer | Tool | Location | Runs |
|---|---|---|---|
| Flutter-native E2E | `integration_test` | [`integration_test/`](../integration_test) | headless or on any device |
| Black-box device E2E | Maestro | `e2e/flows/` (this folder) | Android/iOS device or emulator |

The Maestro flows mirror the React Native app's E2E suite (`apps/mobile/e2e`) so
the journeys stay aligned across platforms.

## 1. integration_test (recommended, runs in CI)

Drives the real app (router + providers + screens) through full journeys.

```bash
# On a device/emulator (true E2E):
flutter test integration_test/app_test.dart -d <deviceId>

# Examples:
flutter test integration_test/app_test.dart -d windows
flutter test integration_test/app_test.dart -d chrome
```

## 2. Maestro flows (device black-box E2E)

### Prerequisites
- [Maestro](https://maestro.mobile.dev/getting-started/installing-maestro) installed
- A running Android emulator (or iOS simulator) with the app installed:

```bash
flutter build apk --debug
flutter install            # installs com.example.flutter_app on the running device
```

### Run

```bash
cd apps/flutter-app
maestro test e2e/flows/                    # all flows
maestro test e2e/flows/auth-login.yaml     # a single flow
```

### Flows
| File | Journey |
|---|---|
| `auth-login.yaml` | Landing → login (demo creds) → dashboard |
| `dashboard-navigation.yaml` | Sign in → visit every main tab |
| `medication-add.yaml` | Sign in → add a medication |
| `symptom-log.yaml` | Sign in → log a symptom |
| `profile-journey.yaml` | Sign in → verify caregiver + care recipient |
| `peggy-assistant.yaml` | Sign in → ask Peggy a question |

Demo credentials: `demo@careconnect.com` / `demo123`.

> Maestro drives Flutter through the semantics tree. If a selector ever fails on
> first run, prefer the `integration_test` suite above (it asserts against the
> widget tree directly) and adjust the Maestro text/ids to match the current UI.

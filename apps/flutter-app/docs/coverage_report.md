# CareConnect Line Coverage Report

**Project:** `apps/flutter-app` (package: `care_connect`)
**Threshold:** 80%

---

## Overall Result: PASS

| Metric | Value |
|---|---|
| Lines found (LF) | 2182 |
| Lines hit (LH) | 1828 |
| Line coverage | **83.8%** |
| Threshold | 80% |
| Result | **PASS** |

Generated from `flutter test --coverage` over the unit, widget, and integration
suites under `test/`.

---

## Test layers

| Layer | Location | Count |
|---|---|---|
| Unit (providers, models, services, error bus, seeds, validators) | `test/unit/` | — |
| Widget (screens & components with mocked providers) | `test/*.dart`, `test/widget/` | — |
| Accessibility (screen-reader, mirrors mobile a11y suite) | `test/a11y/` | 7 |
| Integration (full app via router + real providers) | `test/integration/` | 4 |
| **E2E — Flutter integration_test** | `integration_test/` | 4 |
| **E2E — Maestro flows** (device, mirrors mobile) | `e2e/flows/` | 6 |

`flutter test` runs **238** unit/widget/a11y/integration tests. The
`integration_test` E2E suite runs the real built app and passes on
`-d windows` (and any other device). See [e2e/README.md](../e2e/README.md).

---

## Per-Feature Breakdown

| Feature | Lines Hit | Lines Found | Coverage % |
|---|---|---|---|
| core | 152 | 183 | 83.1% |
| features/accessibility | 139 | 145 | 95.9% |
| features/ai_assistant | 121 | 140 | 86.4% |
| features/appointments | 152 | 177 | 85.9% |
| features/auth | 152 | 186 | 81.7% |
| features/caretaker | 185 | 222 | 83.3% |
| features/dashboard | 165 | 205 | 80.5% |
| features/emergency | 156 | 205 | 76.1% |
| features/landing | 53 | 66 | 80.3% |
| features/medication | 201 | 237 | 84.8% |
| features/profile | 94 | 101 | 93.1% |
| features/symptoms | 148 | 180 | 82.2% |
| shared | 92 | 117 | 78.6% |
| **TOTAL** | **1825** | **2181** | **83.7%** |

---

## How to Re-Run

```bash
cd apps/flutter-app
flutter test --coverage                         # unit + widget + integration
flutter test integration_test/app_test.dart -d windows   # E2E
```

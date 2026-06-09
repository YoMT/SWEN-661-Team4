# CareConnect Unit Test Report

**Generated:** 2026-06-09
**Project:** `apps/flutter-app` (package: `care_connect`)
**Test type:** Pure Dart unit tests (no widget rendering)
**Total tests:** 77 | **Passing:** 77 | **Failing:** 0

---

## Summary

| Metric | Value |
|---|---|
| Unit test files | 8 |
| Total unit tests | 77 |
| Tests passing | 77 |
| Tests failing | 0 |
| Mocks required | None |

---

## Test Results by File

| Test File | Class / Feature | Tests | Status |
|---|---|---|---|
| `test/unit/validators_test.dart` | `Validators` — email, password, required, phone | 19 | ✓ Pass |
| `test/unit/accessibility_model_test.dart` | `AccessibilityModel` — textScale, dimensions, copyWith | 11 | ✓ Pass |
| `test/unit/care_report_model_test.dart` | `CareReport.adherenceRate` | 5 | ✓ Pass |
| `test/unit/emergency_contact_model_test.dart` | `EmergencyContactModel.initials` | 5 | ✓ Pass |
| `test/unit/medication_model_test.dart` | `MedicationModel` — canMarkTaken, copyWith | 6 | ✓ Pass |
| `test/unit/symptom_provider_test.dart` | `SymptomProvider` — setSeverity, overallStatus | 8 | ✓ Pass |
| `test/unit/medication_provider_test.dart` | `MedicationProvider` — byTimeSlot, nextDue, CRUD | 11 | ✓ Pass |
| `test/unit/appointment_provider_test.dart` | `AppointmentProvider` — date filters, cancel | 12 | ✓ Pass |

---

## What Is Tested

### `Validators` (19 tests)
Pure static methods with regex and boundary checks.

| Method | Cases |
|---|---|
| `email()` | valid email, null, empty, missing @, missing domain |
| `password()` | valid ≥8 chars, longer, null, empty, 7-char (below minimum) |
| `required()` | valid, null, empty, whitespace-only, custom `fieldName` in message |
| `phone()` | valid with country code, 10-digit, null, empty, letters |

### `AccessibilityModel` (11 tests)
Computed getters that scale UI dimensions based on text size and tremor mode.

- `textScale`: `standard`→1.0 · `large`→1.25 · `largest`→1.5
- `minTouchTarget`: `tremorMode=false`→44.0 · `tremorMode=true`→60.0
- `primaryButtonHeight`: 64.0 / 72.0
- `navItemHeight`: 56.0 / 64.0
- `copyWith`: single-field update, preserves all other fields

### `CareReport.adherenceRate` (5 tests)
Percentage calculation with division-by-zero protection.

- 10/10 → 100.0% · 5/10 → 50.0% · 0/10 → 0.0% · 0/0 → 0.0% · 3/4 → 75.0%

### `EmergencyContactModel.initials` (5 tests)
String parsing with multi-word name handling.

- Two-word name → first letters · single word → first letter · empty → `?`
- Three-word name → first and last · lowercase input → uppercased output

### `MedicationModel` (6 tests)
State-machine and time-based logic.

- `canMarkTaken`: status=given→false · takenAt=null→true · taken 30s ago→false · taken 2min ago→true
- `copyWith`: updates status/takenAt while preserving other fields

### `SymptomProvider` (8 tests)
Severity clamping and health-status averaging.

- `setSeverity`: 0→1 (clamp) · 6→5 (clamp) · 3→3 (unchanged)
- `overallStatus` (via `save()`): single low severity→`'Good'` · two high→`'Stable'` · three high→`'High'`
- Post-save reset: `selectedSymptom=null`, `severity=3`

### `MedicationProvider` (11 tests)
Grouping, filtering, and CRUD on the medications list.

- `byTimeSlot`: two different slots each in own bucket · same slot in shared bucket · empty list
- `nextDue`: null when empty · dueNow preferred over upcoming · given excluded
- `totalDoses`/`givenDoses`: correct counts
- `delete`: removes by id

### `AppointmentProvider` (12 tests)
Date-based filtering and appointment cancellation.

- `todayAppointments`: today+upcoming included · cancelled excluded · tomorrow excluded · sorted ascending
- `upcomingAppointments`: tomorrow included · today excluded · cancelled excluded
- `nextAppointment`: null when empty · returns earliest of multiple · past excluded
- `cancel`: changes status to cancelled · leaves other appointments unchanged

---

## How to Run

```bash
# From apps/flutter-app
flutter test test/unit/            # unit tests only
flutter test                       # all 167 tests (unit + widget)
```

---

## Design Notes

- No `testWidgets`, no `mocktail`, no Flutter widget tree — all tests use plain `test()` and `group()`.
- Providers are constructed fresh in each `setUp()` and their public list fields are replaced directly to avoid depending on sample data.
- DateTime-relative tests construct values from `DateTime.now()` inline so they are always valid regardless of when the suite is run.
- The one known regex constraint: `Validators.phone` accepts strings of 7–15 characters (regex `{7,15}`). Phone strings exceeding 15 digits after `+` will fail validation — this is a pre-existing app constraint, not a test issue.

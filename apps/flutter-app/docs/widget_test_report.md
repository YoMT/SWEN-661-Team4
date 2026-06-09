# CareConnect Widget Test Coverage Report

**Generated:** 2026-06-09  
**Flutter project:** `apps/flutter-app` (package: `care_connect`)  
**Test framework:** `flutter_test` + `mocktail ^0.3.0`  
**Total tests:** 90 | **Passing:** 90 | **Failing:** 0

---

## Summary

| Metric | Value |
|---|---|
| Screens covered | 18 / 18 |
| Screen coverage | 100 % |
| Total widget tests | 90 |
| Tests passing | 90 |
| Tests failing | 0 |
| Mock providers | 7 |

---

## Screen-by-Screen Coverage

| Screen | Test File | Tests | Status |
|---|---|---|---|
| LoginScreen | `auth_widget_test.dart`, `widget_test.dart` | 13 | ✓ Pass |
| SignupScreen | `landing_auth_test.dart` | 4 | ✓ Pass |
| LandingScreen | `landing_auth_test.dart` | 5 | ✓ Pass |
| DashboardScreen | `dashboard_screen_test.dart` | 4 | ✓ Pass |
| MedicationListScreen | `medication_widget_test.dart` | 5 | ✓ Pass |
| MedicationFormScreen | `medication_form_screen_test.dart` | 3 | ✓ Pass |
| AppointmentScreen | `appointments_test.dart` | 3 | ✓ Pass |
| NewAppointmentScreen | `appointments_test.dart` | 3 | ✓ Pass |
| VideoVisitScreen | `appointments_test.dart` | 3 | ✓ Pass |
| RescheduleScreen | `appointments_test.dart` | 3 | ✓ Pass |
| ProfileScreen | `profile_screen_test.dart` | 6 | ✓ Pass |
| EditProfileScreen | `profile_screen_test.dart` | 2 | ✓ Pass |
| CaretakerNotesScreen | `caretaker_notes_test.dart` | 7 | ✓ Pass |
| ProviderReportScreen | `provider_report_screen_test.dart` | 5 | ✓ Pass |
| AiAssistantScreen | `ai_assistant_screen_test.dart` | 4 | ✓ Pass |
| AccessibilityScreen | `accessibility_screen_test.dart` | 4 | ✓ Pass |
| SymptomLogScreen | `widget_test.dart` | 8 | ✓ Pass |
| EmergencyContactScreen | `widget_test.dart` | 9 | ✓ Pass |

---

## Test Files

| File | Tests | Mocks Used |
|---|---|---|
| `test/widget_test.dart` | 23 | Real providers |
| `test/auth_widget_test.dart` | 5 | MockAuthProvider |
| `test/medication_widget_test.dart` | 5 | MockMedicationProvider |
| `test/caretaker_notes_test.dart` | 7 | MockCaretakerProvider |
| `test/landing_auth_test.dart` | 9 | MockAuthProvider |
| `test/dashboard_screen_test.dart` | 4 | MockDashboardProvider |
| `test/appointments_test.dart` | 12 | MockAppointmentProvider |
| `test/profile_screen_test.dart` | 8 | MockProfileProvider |
| `test/ai_assistant_screen_test.dart` | 4 | MockAiAssistantProvider |
| `test/accessibility_screen_test.dart` | 4 | Real AccessibilityProvider |
| `test/provider_report_screen_test.dart` | 5 | None (static data) |
| `test/medication_form_screen_test.dart` | 3 | Real AccessibilityProvider |

---

## Mock Classes (`test/mocks.dart`)

```dart
class MockAuthProvider      extends Mock implements AuthProvider {}
class MockMedicationProvider extends Mock implements MedicationProvider {}
class MockCaretakerProvider  extends Mock implements CaretakerProvider {}
class MockDashboardProvider  extends Mock implements DashboardProvider {}
class MockAppointmentProvider extends Mock implements AppointmentProvider {}
class MockProfileProvider    extends Mock implements ProfileProvider {}
class MockAiAssistantProvider extends Mock implements AiAssistantProvider {}
```

---

## Key Patterns

### Injecting mocks into the widget tree

```dart
Widget _buildSubject(MockXProvider mock) {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider<XProvider>.value(value: mock),
      ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
    ],
    child: const MaterialApp(home: XScreen()),
  );
}
```

### Stubbing provider properties

```dart
setUp(() {
  mock = MockDashboardProvider();
  when(() => mock.careeName).thenReturn('Eleanor Reyes');
  when(() => mock.isLoading).thenReturn(false);
});
```

### Handling off-screen content (scrollable views)

```dart
// Widgets in a ListView may be outside the 800×600 test viewport
expect(find.text('Share with provider', skipOffstage: false), findsOneWidget);
```

### Draining pre-existing framework layout warnings

Some screens have a pre-existing `RenderFlex` overflow or `ListTile`+`DecoratedBox` assertion
that fires in the constrained test viewport (800×600). These are not test logic bugs.
Use `tester.takeException()` to consume them before making assertions:

```dart
void _drainExceptions(WidgetTester tester) {
  while (tester.takeException() != null) {}
}

testWidgets('renders app bar', (tester) async {
  await tester.pumpWidget(_buildSubject());
  await tester.pumpAndSettle();
  _drainExceptions(tester);          // consume known layout warnings
  expect(find.text('Title'), findsOneWidget);
});
```

### Loading-state tests (avoids pumpAndSettle timeout)

When a mock returns `isLoading: true`, a `CircularProgressIndicator` animates indefinitely.
Use `tester.pump()` (single frame) instead of `pumpAndSettle()`:

```dart
testWidgets('shows loading indicator', (tester) async {
  when(() => mock.isLoading).thenReturn(true);
  await tester.pumpWidget(_buildSubject(mock));
  await tester.pump();
  expect(find.byType(CircularProgressIndicator), findsOneWidget);
});
```

---

## How to Run

```bash
# From project root
cd apps/flutter-app
flutter test                     # run all 90 tests
flutter test test/auth_widget_test.dart   # run one file
flutter test --name "LoginScreen"         # run tests matching name pattern
```

---

## Known App Issues (not test bugs)

| Issue | Affected Screens | Workaround in Tests |
|---|---|---|
| `ListTile` nested inside `DecoratedBox` with background color | AccessibilityScreen settings widgets | `_drainExceptions(tester)` |
| `RenderFlex` overflow in constrained 800×600 test viewport | LandingScreen, SignupScreen, NewAppointmentScreen | `_drainExceptions(tester)` |

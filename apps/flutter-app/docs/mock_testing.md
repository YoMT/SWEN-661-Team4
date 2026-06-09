# Mocktail Testing Guide

## Why mocktail

CareConnect uses the `provider` package with `ChangeNotifier`-based state. `mocktail` lets tests inject predictable provider state without relying on real async logic (timers, backend stubs, sample data). This makes tests deterministic, fast, and independent of implementation details.

## Setup

`mocktail: ^0.3.0` is declared under `dev_dependencies` in `pubspec.yaml`.

## Mock Classes

All mocks live in `test/mocks.dart`:

```dart
class MockAuthProvider extends Mock implements AuthProvider {}
class MockMedicationProvider extends Mock implements MedicationProvider {}
class MockCaretakerProvider extends Mock implements CaretakerProvider {}
```

`Mock` from mocktail intercepts every method call. Unregistered calls return safe defaults (null, false, 0, empty string).

## How to Add a New Mock

1. Open `test/mocks.dart`
2. Add one line:
   ```dart
   class MockFooProvider extends Mock implements FooProvider {}
   ```
3. In your test file, create an instance and stub the properties the widget reads:
   ```dart
   final mock = MockFooProvider();
   when(() => mock.someProperty).thenReturn(someValue);
   ```

## Injecting a Mock into a Widget Test

Use `ChangeNotifierProvider.value` to supply the mock instead of a real provider:

```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider<FooProvider>.value(value: mock),
    // real instances for other providers the screen needs
    ChangeNotifierProvider(create: (_) => BarProvider()),
  ],
  child: const MaterialApp(home: FooScreen()),
)
```

## Verifying Interactions (CaretakerProvider)

Use `verify()` to assert a method was called with specific arguments:

```dart
final mock = MockCaretakerProvider();
when(() => mock.reply(any(), any())).thenAnswer((_) async {});

await mock.reply('note-42', 'Patient doing well.');

verify(() => mock.reply('note-42', 'Patient doing well.')).called(1);
```

## Running Tests

```
flutter test
```

To run a single file:

```
flutter test test/medication_widget_test.dart
```

## Test Files

| File | Provider Mocked | Screen Tested |
|---|---|---|
| `test/auth_widget_test.dart` | `MockAuthProvider` | `LoginScreen` |
| `test/medication_widget_test.dart` | `MockMedicationProvider` | `MedicationListScreen` |
| `test/caretaker_notes_test.dart` | `MockMedicationProvider` | `CaretakerNotesScreen` |
| `test/caretaker_notes_test.dart` | `MockCaretakerProvider` | unit — `verify()` |

## Notes

- `pumpAndSettle()` times out when a `CircularProgressIndicator` is on screen (animation never settles). Use `pump()` for loading-state tests instead.
- Widgets in a `ListView` may be off-screen in the test viewport. Use `find.text('...', skipOffstage: false)` to locate them.

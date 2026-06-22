# CareConnect — Flutter

The Flutter build of **CareConnect**, a healthcare/caregiver app designed around
four WCAG-aligned accessibility constraints (large buttons, confirmation
dialogs, double-tap prevention, reduced motion).

This app is kept at **feature parity with the Expo/React Native app**
(`apps/mobile`), which is the team's reference implementation. Shared demo data,
the Peggy AI assistant, auth, and the global error toast all mirror the mobile
behavior.

## Architecture

Feature-first layout under `lib/`:

```
lib/
  app.dart                      MaterialApp.router + global error-toast overlay
  main.dart                     bootstraps prefs, providers, and the router
  core/
    data/seeds.dart             demo data (parity with mobile mock-api)
    error/error_bus.dart        app-wide error queue → GlobalErrorToast
    router/app_router.dart      go_router with an auth-aware redirect guard
    services/                   speech_input_service.dart (voice input)
    theme/                      colors, text styles, light/dark + high-contrast
  features/<feature>/{models,providers,screens,widgets}
  shared/widgets/               app_button, app_text_field, global_error_toast, …
```

State is managed with `provider` (`ChangeNotifier`). Demo data is in-memory and
seeded from `core/data/seeds.dart`. The authenticated session is persisted with
`shared_preferences` and restored on launch; unauthenticated users are kept on
the public routes (`/`, `/login`, `/signup`) by the router redirect.

### Demo login

```
email:    demo@careconnect.com
password: demo123
```

## Running

```bash
flutter pub get
flutter run                 # connected device / emulator
flutter run -d chrome       # web
flutter run -d windows      # Windows desktop
```

> **Voice input** (symptom & note fields) uses `speech_to_text`, which requires
> microphone + speech-recognition permissions (already declared in the Android
> manifest and iOS `Info.plist`). On platforms without speech recognition it
> degrades gracefully to plain typing.

## Testing

```bash
flutter analyze
flutter test                # unit + widget tests
flutter test --coverage     # writes coverage/lcov.info
```

Requires **Flutter 3.32+ / Dart SDK ^3.12.1**.

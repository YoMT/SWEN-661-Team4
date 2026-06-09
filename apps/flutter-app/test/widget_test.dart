import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/features/symptoms/screens/symptom_log_screen.dart';
import 'package:care_connect/features/symptoms/providers/symptom_provider.dart';
import 'package:care_connect/features/emergency/screens/emergency_contact_screen.dart';
import 'package:care_connect/features/emergency/providers/emergency_provider.dart';
import 'package:care_connect/features/auth/screens/login_screen.dart';
import 'package:care_connect/features/ai_assistant/providers/ai_assistant_provider.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';
import 'package:care_connect/features/auth/providers/auth_provider.dart';

Widget wrapWithProviders(Widget child) {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (_) => SymptomProvider()),
      ChangeNotifierProvider(create: (_) => EmergencyProvider()),
      ChangeNotifierProvider(create: (_) => AiAssistantProvider()),
      ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
      ChangeNotifierProvider(create: (_) => AuthProvider()),
    ],
    child: MaterialApp(home: child),
  );
}

void main() {
  // ── Symptom Log Screen ───────────────────────────────────────────────────
  group('SymptomLogScreen', () {
    testWidgets('renders app bar with correct title', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const SymptomLogScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Log a symptom'), findsOneWidget);
    });

    testWidgets('renders symptom prompt text', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const SymptomLogScreen()));
      await tester.pumpAndSettle();
      expect(find.textContaining("What's bothering"), findsOneWidget);
    });

    testWidgets('renders note field label', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const SymptomLogScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Add a note (optional)'), findsOneWidget);
    });

testWidgets('renders voice input button', (tester) async {
  await tester.pumpWidget(wrapWithProviders(const SymptomLogScreen()));
  await tester.pumpAndSettle();

  expect(
    find.byKey(const Key('voiceInputButton'), skipOffstage: false),
    findsOneWidget,
  );
});

    testWidgets('renders Peggy floating action button', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const SymptomLogScreen()));
      await tester.pumpAndSettle();
      expect(find.byType(FloatingActionButton), findsOneWidget);
    });

    testWidgets('Peggy panel is hidden by default', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const SymptomLogScreen()));
      await tester.pumpAndSettle();
      expect(find.text('AI Assistant'), findsNothing);
    });

    testWidgets('tapping Peggy button opens assistant panel', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const SymptomLogScreen()));
      await tester.pumpAndSettle();
      await tester.tap(find.byType(FloatingActionButton));
      await tester.pumpAndSettle();
      expect(find.text('AI Assistant'), findsOneWidget);
    });
  });

  // ── Emergency Contact Screen ─────────────────────────────────────────────
  group('EmergencyContactScreen', () {
    testWidgets('renders app bar with Emergency title', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const EmergencyContactScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Emergency'), findsOneWidget);
    });

    testWidgets('renders EMERGENCY SOS card', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const EmergencyContactScreen()));
      await tester.pumpAndSettle();
      expect(find.text('EMERGENCY SOS'), findsOneWidget);
    });

    testWidgets('renders Call 911 button', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const EmergencyContactScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Call 911'), findsOneWidget);
    });

    testWidgets('renders hold to confirm hint', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const EmergencyContactScreen()));
      await tester.pumpAndSettle();
      expect(
          find.text('Press and hold to confirm — prevents accidental calls'),
          findsOneWidget);
    });

    testWidgets('renders Emergency Contacts section', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const EmergencyContactScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Emergency Contacts'), findsOneWidget);
    });

    testWidgets('renders Quick Incident Log section', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const EmergencyContactScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Quick Incident Log'), findsOneWidget);
    });

    testWidgets('renders Save Incident Log button', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const EmergencyContactScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Save Incident Log'), findsOneWidget);
    });

    testWidgets('renders Peggy floating action button', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const EmergencyContactScreen()));
      await tester.pumpAndSettle();
      expect(find.byType(FloatingActionButton), findsOneWidget);
    });

    testWidgets('tapping Peggy opens assistant panel', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const EmergencyContactScreen()));
      await tester.pumpAndSettle();
      await tester.tap(find.byType(FloatingActionButton));
      await tester.pumpAndSettle();
      expect(find.text('AI Assistant'), findsOneWidget);
    });
  });

  // ── Login Screen ─────────────────────────────────────────────────────────
  group('LoginScreen', () {
    testWidgets('renders CareConnect brand title', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const LoginScreen()));
      await tester.pumpAndSettle();
      expect(find.text('CareConnect'), findsOneWidget);
    });

    testWidgets('renders brand tagline', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const LoginScreen()));
      await tester.pumpAndSettle();
      expect(
          find.text('Care management built for caregivers with tremors'),
          findsOneWidget);
    });

    testWidgets('renders accessibility settings card', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const LoginScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Accessibility settings'), findsOneWidget);
    });

    testWidgets('renders create account link', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const LoginScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Create account'), findsOneWidget);
    });

    testWidgets("renders don't have an account text", (tester) async {
      await tester.pumpWidget(wrapWithProviders(const LoginScreen()));
      await tester.pumpAndSettle();
      expect(find.text("Don't have an account?"), findsOneWidget);
    });

    testWidgets('renders Peggy floating action button', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const LoginScreen()));
      await tester.pumpAndSettle();
      expect(find.byType(FloatingActionButton), findsOneWidget);
    });

    testWidgets('Peggy panel hidden by default', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const LoginScreen()));
      await tester.pumpAndSettle();
      expect(find.text('AI Assistant'), findsNothing);
    });

    testWidgets('tapping Peggy opens assistant panel', (tester) async {
      await tester.pumpWidget(wrapWithProviders(const LoginScreen()));
      await tester.pumpAndSettle();
      await tester.tap(find.byType(FloatingActionButton));
      await tester.pumpAndSettle();
      expect(find.text('AI Assistant'), findsOneWidget);
    });
  });
}
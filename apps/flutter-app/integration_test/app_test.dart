// End-to-end tests for CareConnect, driven through the real app (router,
// providers, navigation shell, and screens) via the official `integration_test`
// harness.
//
// Run headless:   flutter test integration_test/app_test.dart
// Run on device:  flutter test integration_test/app_test.dart -d <deviceId>
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/app.dart';
import 'package:care_connect/core/router/app_router.dart';
import 'package:care_connect/features/auth/providers/auth_provider.dart';
import 'package:care_connect/features/dashboard/providers/dashboard_provider.dart';
import 'package:care_connect/features/medication/providers/medication_provider.dart';
import 'package:care_connect/features/appointments/providers/appointment_provider.dart';
import 'package:care_connect/features/symptoms/providers/symptom_provider.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';
import 'package:care_connect/features/emergency/providers/emergency_provider.dart';
import 'package:care_connect/features/caretaker/providers/caretaker_provider.dart';
import 'package:care_connect/features/profile/providers/profile_provider.dart';
import 'package:care_connect/features/ai_assistant/providers/ai_assistant_provider.dart';

Widget _buildApp() {
  final auth = AuthProvider();
  return MultiProvider(
    providers: [
      ChangeNotifierProvider.value(value: auth),
      ChangeNotifierProvider(create: (_) => DashboardProvider()),
      ChangeNotifierProvider(create: (_) => MedicationProvider()),
      ChangeNotifierProvider(create: (_) => AppointmentProvider()),
      ChangeNotifierProvider(create: (_) => SymptomProvider()),
      ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
      ChangeNotifierProvider(create: (_) => EmergencyProvider()),
      ChangeNotifierProvider(create: (_) => CaretakerProvider()),
      ChangeNotifierProvider(create: (_) => ProfileProvider()),
      ChangeNotifierProvider(create: (_) => AiAssistantProvider()),
    ],
    child: CareConnectApp(router: AppRouter.create(auth)),
  );
}

Future<void> _signIn(WidgetTester tester) async {
  await tester.pumpWidget(_buildApp());
  await tester.pumpAndSettle();
  await tester.tap(find.text('Sign in'));
  await tester.pumpAndSettle();
  final fields = find.byType(TextFormField);
  await tester.enterText(fields.at(0), 'demo@careconnect.com');
  await tester.enterText(fields.at(1), 'demo123');
  await tester.tap(find.text('Sign In'));
  await tester.pumpAndSettle();
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('E2E: sign in and reach the dashboard', (tester) async {
    await _signIn(tester);
    expect(find.text('Margaret Johnson'), findsOneWidget);
  });

  testWidgets('E2E: navigate every main tab after signing in', (tester) async {
    await _signIn(tester);

    await tester.tap(find.text('Meds'));
    await tester.pumpAndSettle();
    expect(find.text('Medications'), findsOneWidget);

    await tester.tap(find.text('Schedule'));
    await tester.pumpAndSettle();
    expect(find.text('Appointments'), findsOneWidget);

    await tester.tap(find.text('Symptoms'));
    await tester.pumpAndSettle();
    expect(find.text('Log a symptom'), findsOneWidget);

    await tester.tap(find.text('Profile'));
    await tester.pumpAndSettle();
    expect(find.text('Profile'), findsWidgets);
  });

  testWidgets('E2E: mark a medication as taken via the confirmation dialog',
      (tester) async {
    await _signIn(tester);
    await tester.tap(find.text('Meds'));
    await tester.pumpAndSettle();

    // Double-tap prevention + confirm dialog are core accessibility pillars.
    final markButton = find.text('Mark as taken').first;
    await tester.ensureVisible(markButton);
    await tester.tap(markButton);
    await tester.pumpAndSettle();

    expect(find.text('Mark as taken?'), findsOneWidget);
    await tester.tap(find.text('Confirm'));
    await tester.pumpAndSettle();
    // Dialog dismissed after confirming.
    expect(find.text('Mark as taken?'), findsNothing);
  });

  testWidgets('E2E: open the Peggy assistant from the dashboard',
      (tester) async {
    await _signIn(tester);
    await tester.tap(find.byType(FloatingActionButton));
    await tester.pumpAndSettle();
    expect(find.text('Peggy'), findsOneWidget);
    expect(find.textContaining("Hi, I'm Peggy"), findsOneWidget);
  });
}

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
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

/// Builds the full app exactly as `main()` does (minus persistence), so these
/// tests exercise the real router, providers, navigation shell, and screens
/// together.
Widget buildApp() {
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

Future<void> _login(WidgetTester tester) async {
  await tester.pumpWidget(buildApp());
  await tester.pumpAndSettle();

  // Landing → login
  await tester.tap(find.text('Sign in'));
  await tester.pumpAndSettle();

  // Enter demo credentials and submit
  final fields = find.byType(TextFormField);
  await tester.enterText(fields.at(0), 'demo@careconnect.com');
  await tester.enterText(fields.at(1), 'demo123');
  await tester.tap(find.text('Sign In'));
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('landing requires sign-in to reach the dashboard', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pumpAndSettle();
    // Landing page is shown; the dashboard greeting is not.
    expect(find.text('Sign in'), findsOneWidget);
    expect(find.text('Margaret Johnson'), findsNothing);
  });

  testWidgets('demo login lands on the dashboard for Margaret Johnson',
      (tester) async {
    await _login(tester);
    expect(find.text('Margaret Johnson'), findsOneWidget);
  });

  testWidgets('bottom navigation moves across the main tabs', (tester) async {
    await _login(tester);

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

  testWidgets('Peggy assistant drawer opens from the dashboard FAB',
      (tester) async {
    await _login(tester);
    await tester.tap(find.byType(FloatingActionButton));
    await tester.pumpAndSettle();
    expect(find.text('Peggy'), findsOneWidget);
  });
}

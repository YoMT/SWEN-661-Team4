import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/features/dashboard/screens/dashboard_screen.dart';
import 'package:care_connect/features/dashboard/providers/dashboard_provider.dart';
import 'package:care_connect/features/medication/providers/medication_provider.dart';
import 'package:care_connect/features/appointments/providers/appointment_provider.dart';
import 'package:care_connect/features/symptoms/providers/symptom_provider.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';
import 'mocks.dart';

Widget _buildSubject(MockDashboardProvider mockDashboard) {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider<DashboardProvider>.value(value: mockDashboard),
      ChangeNotifierProvider(create: (_) => MedicationProvider()),
      ChangeNotifierProvider(create: (_) => AppointmentProvider()),
      ChangeNotifierProvider(create: (_) => SymptomProvider()),
      ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
    ],
    child: const MaterialApp(home: DashboardScreen()),
  );
}

void main() {
  late MockDashboardProvider mockDashboard;

  setUp(() {
    mockDashboard = MockDashboardProvider();
    when(() => mockDashboard.careeName).thenReturn('Eleanor Reyes');
    when(() => mockDashboard.isLoading).thenReturn(false);
  });

  group('DashboardScreen — MockDashboardProvider', () {
    testWidgets('renders RefreshIndicator', (tester) async {
      await tester.pumpWidget(_buildSubject(mockDashboard));
      await tester.pumpAndSettle();
      expect(find.byType(RefreshIndicator), findsOneWidget);
    });

    testWidgets('renders CustomScrollView', (tester) async {
      await tester.pumpWidget(_buildSubject(mockDashboard));
      await tester.pumpAndSettle();
      expect(find.byType(CustomScrollView), findsOneWidget);
    });

    testWidgets('renders caree name from mock in header', (tester) async {
      await tester.pumpWidget(_buildSubject(mockDashboard));
      await tester.pumpAndSettle();
      expect(find.text('Eleanor Reyes', skipOffstage: false), findsWidgets);
    });

    testWidgets('renders different caree name when mock changes', (tester) async {
      when(() => mockDashboard.careeName).thenReturn('Amara Johnson');
      await tester.pumpWidget(_buildSubject(mockDashboard));
      await tester.pumpAndSettle();
      expect(find.text('Amara Johnson', skipOffstage: false), findsWidgets);
    });
  });
}

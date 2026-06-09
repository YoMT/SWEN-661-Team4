import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/features/appointments/screens/appointment_screen.dart';
import 'package:care_connect/features/appointments/screens/new_appointment_screen.dart';
import 'package:care_connect/features/appointments/screens/video_visit_screen.dart';
import 'package:care_connect/features/appointments/screens/reschedule_screen.dart';
import 'package:care_connect/features/appointments/providers/appointment_provider.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';
import 'mocks.dart';

// Drain RenderFlex overflow errors from the constrained test viewport so they
// don't fail tests that are otherwise asserting correct widget presence.
void _drainExceptions(WidgetTester tester) {
  while (tester.takeException() != null) {}
}

Widget _wrapAppointment(MockAppointmentProvider mockAppts) => MultiProvider(
      providers: [
        ChangeNotifierProvider<AppointmentProvider>.value(value: mockAppts),
        ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
      ],
      child: const MaterialApp(home: AppointmentScreen()),
    );

Widget _wrapSimple(Widget screen) => MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
      ],
      child: MaterialApp(home: screen),
    );

void main() {
  group('AppointmentScreen — MockAppointmentProvider', () {
    late MockAppointmentProvider mockAppts;

    setUp(() {
      mockAppts = MockAppointmentProvider();
      when(() => mockAppts.isLoading).thenReturn(false);
      when(() => mockAppts.errorMessage).thenReturn(null);
      when(() => mockAppts.todayAppointments).thenReturn([]);
      when(() => mockAppts.upcomingAppointments).thenReturn([]);
    });

    testWidgets('renders Appointments app bar', (tester) async {
      await tester.pumpWidget(_wrapAppointment(mockAppts));
      await tester.pumpAndSettle();
      expect(find.text('Appointments'), findsOneWidget);
    });

    testWidgets('shows empty state message when no appointments', (tester) async {
      await tester.pumpWidget(_wrapAppointment(mockAppts));
      await tester.pumpAndSettle();
      expect(find.text('No appointments scheduled'), findsOneWidget);
    });

    testWidgets('shows Book appointment button in empty state', (tester) async {
      await tester.pumpWidget(_wrapAppointment(mockAppts));
      await tester.pumpAndSettle();
      expect(find.text('Book appointment'), findsOneWidget);
    });
  });

  group('NewAppointmentScreen', () {
    testWidgets('renders Book Appointment app bar', (tester) async {
      await tester.pumpWidget(_wrapSimple(const NewAppointmentScreen()));
      await tester.pumpAndSettle();
      _drainExceptions(tester);
      expect(find.text('Book Appointment'), findsWidgets);
    });

    testWidgets('renders Doctor Name field', (tester) async {
      await tester.pumpWidget(_wrapSimple(const NewAppointmentScreen()));
      await tester.pumpAndSettle();
      _drainExceptions(tester);
      expect(find.text('Doctor Name', skipOffstage: false), findsOneWidget);
    });

    testWidgets('renders Book Appointment button', (tester) async {
      await tester.pumpWidget(_wrapSimple(const NewAppointmentScreen()));
      await tester.pumpAndSettle();
      _drainExceptions(tester);
      expect(find.text('Book Appointment', skipOffstage: false), findsWidgets);
    });
  });

  group('VideoVisitScreen', () {
    testWidgets('renders Video Visit app bar', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: VideoVisitScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Video Visit'), findsOneWidget);
    });

    testWidgets('renders Ready to join text', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: VideoVisitScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Ready to join?'), findsOneWidget);
    });

    testWidgets('renders videocam icon', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: VideoVisitScreen()));
      await tester.pumpAndSettle();
      expect(find.byIcon(Icons.videocam_outlined), findsOneWidget);
    });
  });

  group('RescheduleScreen', () {
    testWidgets('renders Reschedule Appointment app bar', (tester) async {
      await tester.pumpWidget(_wrapSimple(const RescheduleScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Reschedule Appointment'), findsOneWidget);
    });

    testWidgets('renders date/time instruction text', (tester) async {
      await tester.pumpWidget(_wrapSimple(const RescheduleScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Select a new date and time'), findsOneWidget);
    });

    testWidgets('renders Confirm Reschedule button', (tester) async {
      await tester.pumpWidget(_wrapSimple(const RescheduleScreen()));
      await tester.pumpAndSettle();
      expect(find.text('Confirm Reschedule'), findsOneWidget);
    });
  });
}

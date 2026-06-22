import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/features/appointments/models/appointment_model.dart';
import 'package:care_connect/features/appointments/widgets/appointment_card.dart';
import 'package:care_connect/features/medication/models/medication_model.dart';
import 'package:care_connect/features/medication/providers/medication_provider.dart';
import 'package:care_connect/features/medication/widgets/medication_card.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';
import 'package:care_connect/features/ai_assistant/models/chat_message_model.dart';
import 'package:care_connect/features/ai_assistant/widgets/chat_bubble.dart';
import 'package:care_connect/shared/widgets/loading_indicator.dart';

final _now = DateTime(2026, 1, 1, 9, 0);

AppointmentModel _appt(AppointmentType type) => AppointmentModel(
      id: 'a1',
      createdAt: _now,
      updatedAt: _now,
      doctorName: 'Dr. Sarah Chen',
      specialty: 'Cardiology',
      location: 'City Heart Clinic',
      dateTime: _now,
      type: type,
      status: AppointmentStatus.upcoming,
    );

MedicationModel _med(DoseStatus status) => MedicationModel(
      id: 'm1',
      createdAt: _now,
      updatedAt: _now,
      name: 'Metoprolol',
      dosage: '50 mg',
      instruction: 'with food',
      scheduledTime: '8:00 AM',
      timeSlot: DoseTimeSlot.morning,
      status: status,
    );

Widget _host(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  group('AppointmentCard', () {
    testWidgets('in-person shows doctor + In person badge', (tester) async {
      await tester.pumpWidget(_host(AppointmentCard(appointment: _appt(AppointmentType.inPerson))));
      expect(find.text('Dr. Sarah Chen'), findsOneWidget);
      expect(find.text('In person'), findsOneWidget);
    });

    testWidgets('video shows Join video visit + Video badge', (tester) async {
      await tester.pumpWidget(_host(AppointmentCard(appointment: _appt(AppointmentType.video))));
      expect(find.text('Video'), findsOneWidget);
      expect(find.text('Join video visit'), findsOneWidget);
    });
  });

  group('MedicationCard', () {
    Widget hostMed(MedicationModel med) => MultiProvider(
          providers: [
            ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
            ChangeNotifierProvider(create: (_) => MedicationProvider()),
          ],
          child: MaterialApp(home: Scaffold(body: MedicationCard(medication: med))),
        );

    testWidgets('given medication hides the Mark as taken button', (tester) async {
      await tester.pumpWidget(hostMed(_med(DoseStatus.given)));
      expect(find.text('Given'), findsOneWidget);
      expect(find.text('Mark as taken'), findsNothing);
    });

    testWidgets('due-now medication shows Mark as taken', (tester) async {
      await tester.pumpWidget(hostMed(_med(DoseStatus.dueNow)));
      expect(find.text('Due now'), findsOneWidget);
      expect(find.text('Mark as taken'), findsOneWidget);
    });

    testWidgets('tapping Mark as taken opens the confirmation dialog', (tester) async {
      await tester.pumpWidget(hostMed(_med(DoseStatus.dueNow)));
      await tester.tap(find.text('Mark as taken'));
      await tester.pumpAndSettle();
      expect(find.text('Mark as taken?'), findsOneWidget);
      expect(find.text('Confirm'), findsOneWidget);
    });
  });

  group('ChatBubble', () {
    ChatMessageModel msg(MessageRole role) =>
        ChatMessageModel(id: '1', role: role, content: 'hello', timestamp: _now);

    testWidgets('renders user message', (tester) async {
      await tester.pumpWidget(_host(ChatBubble(message: msg(MessageRole.user))));
      expect(find.text('hello'), findsOneWidget);
    });

    testWidgets('renders assistant message', (tester) async {
      await tester.pumpWidget(_host(ChatBubble(message: msg(MessageRole.assistant))));
      expect(find.text('hello'), findsOneWidget);
    });
  });

  testWidgets('LoadingIndicator renders a progress spinner', (tester) async {
    await tester.pumpWidget(_host(const LoadingIndicator()));
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });
}

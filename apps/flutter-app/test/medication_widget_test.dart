import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/features/medication/screens/medication_list_screen.dart';
import 'package:care_connect/features/medication/providers/medication_provider.dart';
import 'package:care_connect/features/medication/models/medication_model.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';
import 'mocks.dart';

Widget _buildSubject(MockMedicationProvider mockMeds) {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider<MedicationProvider>.value(value: mockMeds),
      ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
    ],
    child: const MaterialApp(home: MedicationListScreen()),
  );
}

MedicationModel _fakeMed({
  String id = '1',
  String name = 'Aspirin',
  DoseTimeSlot slot = DoseTimeSlot.morning,
  DoseStatus status = DoseStatus.given,
}) {
  final now = DateTime.now();
  return MedicationModel(
    id: id,
    createdAt: now,
    updatedAt: now,
    name: name,
    dosage: '81 mg',
    instruction: '1 tablet',
    scheduledTime: '8:00 AM',
    timeSlot: slot,
    status: status,
    takenAt: status == DoseStatus.given ? now : null,
  );
}

void main() {
  late MockMedicationProvider mockMeds;

  setUp(() {
    mockMeds = MockMedicationProvider();
    when(() => mockMeds.isLoading).thenReturn(false);
    when(() => mockMeds.errorMessage).thenReturn(null);
    when(() => mockMeds.medications).thenReturn([]);
    when(() => mockMeds.totalDoses).thenReturn(0);
    when(() => mockMeds.givenDoses).thenReturn(0);
    when(() => mockMeds.byTimeSlot).thenReturn({});
    when(() => mockMeds.nextDue).thenReturn(null);
  });

  group('MedicationListScreen — MockMedicationProvider', () {
    testWidgets('renders Medications app bar title', (tester) async {
      await tester.pumpWidget(_buildSubject(mockMeds));
      await tester.pumpAndSettle();
      expect(find.text('Medications'), findsOneWidget);
    });

    testWidgets('shows empty state when medications list is empty', (tester) async {
      await tester.pumpWidget(_buildSubject(mockMeds));
      await tester.pumpAndSettle();
      expect(find.text('No medications added'), findsOneWidget);
    });

    testWidgets('shows "next at none" when nextDue is null', (tester) async {
      final med = _fakeMed(name: 'Aspirin', status: DoseStatus.given);
      when(() => mockMeds.medications).thenReturn([med]);
      when(() => mockMeds.totalDoses).thenReturn(1);
      when(() => mockMeds.givenDoses).thenReturn(1);
      when(() => mockMeds.byTimeSlot).thenReturn({DoseTimeSlot.morning: [med]});
      when(() => mockMeds.nextDue).thenReturn(null);
      await tester.pumpWidget(_buildSubject(mockMeds));
      await tester.pumpAndSettle();
      expect(find.textContaining('next at none'), findsOneWidget);
    });

    testWidgets('shows medication name when list is populated', (tester) async {
      final med = _fakeMed(name: 'Metformin', slot: DoseTimeSlot.morning);
      when(() => mockMeds.medications).thenReturn([med]);
      when(() => mockMeds.totalDoses).thenReturn(1);
      when(() => mockMeds.givenDoses).thenReturn(1);
      when(() => mockMeds.byTimeSlot).thenReturn({DoseTimeSlot.morning: [med]});
      await tester.pumpWidget(_buildSubject(mockMeds));
      await tester.pumpAndSettle();
      expect(find.text('Metformin 81 mg', skipOffstage: false), findsOneWidget);
      expect(find.text('1 of 1 given'), findsOneWidget);
    });

    testWidgets('shows correct remaining count for mixed status', (tester) async {
      final taken = _fakeMed(id: '1', name: 'Aspirin', status: DoseStatus.given);
      final due = _fakeMed(id: '2', name: 'Lisinopril', slot: DoseTimeSlot.afternoon, status: DoseStatus.dueNow);
      when(() => mockMeds.medications).thenReturn([taken, due]);
      when(() => mockMeds.totalDoses).thenReturn(2);
      when(() => mockMeds.givenDoses).thenReturn(1);
      when(() => mockMeds.byTimeSlot).thenReturn({
        DoseTimeSlot.morning: [taken],
        DoseTimeSlot.afternoon: [due],
      });
      when(() => mockMeds.nextDue).thenReturn(due);
      await tester.pumpWidget(_buildSubject(mockMeds));
      await tester.pumpAndSettle();
      expect(find.text('1 of 2 given'), findsOneWidget);
      expect(find.textContaining('1 remaining'), findsOneWidget);
    });
  });
}

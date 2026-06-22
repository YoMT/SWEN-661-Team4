import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/features/caretaker/screens/caretaker_notes_screen.dart';
import 'package:care_connect/features/caretaker/providers/caretaker_provider.dart';
import 'package:care_connect/features/medication/providers/medication_provider.dart';
import 'package:care_connect/features/symptoms/providers/symptom_provider.dart';
import 'package:care_connect/features/appointments/providers/appointment_provider.dart';
import 'mocks.dart';

Widget _buildSubject(MockMedicationProvider mockMeds) {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider<MedicationProvider>.value(value: mockMeds),
      ChangeNotifierProvider(create: (_) => SymptomProvider()),
      ChangeNotifierProvider(create: (_) => AppointmentProvider()),
      ChangeNotifierProvider(create: (_) => CaretakerProvider()),
    ],
    child: const MaterialApp(home: CaretakerNotesScreen()),
  );
}

void main() {
  late MockMedicationProvider mockMeds;

  setUp(() {
    mockMeds = MockMedicationProvider();
    when(() => mockMeds.totalDoses).thenReturn(0);
    when(() => mockMeds.givenDoses).thenReturn(0);
  });

  group('CaretakerNotesScreen — MockMedicationProvider', () {
    testWidgets('renders Provider Report app bar', (tester) async {
      await tester.pumpWidget(_buildSubject(mockMeds));
      await tester.pumpAndSettle();
      expect(find.text('Provider Report'), findsOneWidget);
    });

    testWidgets('shows 0% adherence when no doses recorded', (tester) async {
      await tester.pumpWidget(_buildSubject(mockMeds));
      await tester.pumpAndSettle();
      expect(find.text('0%'), findsOneWidget);
      expect(find.text('0 of 0 doses'), findsOneWidget);
    });

    testWidgets('shows correct adherence rate when doses taken', (tester) async {
      when(() => mockMeds.totalDoses).thenReturn(30);
      when(() => mockMeds.givenDoses).thenReturn(28);
      await tester.pumpWidget(_buildSubject(mockMeds));
      await tester.pumpAndSettle();
      expect(find.text('93%'), findsOneWidget);
      expect(find.text('28 of 30 doses'), findsOneWidget);
    });

    testWidgets('shows 100% adherence when all doses taken', (tester) async {
      when(() => mockMeds.totalDoses).thenReturn(10);
      when(() => mockMeds.givenDoses).thenReturn(10);
      await tester.pumpWidget(_buildSubject(mockMeds));
      await tester.pumpAndSettle();
      expect(find.text('100%'), findsOneWidget);
    });

    testWidgets('shows Share with provider button', (tester) async {
      await tester.pumpWidget(_buildSubject(mockMeds));
      await tester.pumpAndSettle();
      final finder = find.text('Share with provider');
      await tester.scrollUntilVisible(finder, 300,
          scrollable: find.byType(Scrollable).first);
      expect(finder, findsOneWidget);
    });
  });

  group('MockCaretakerProvider — verify interactions', () {
    test('reply is called with correct noteId and content', () async {
      final mockCaretaker = MockCaretakerProvider();
      when(() => mockCaretaker.reply(any(), any())).thenAnswer((_) async {});

      await mockCaretaker.reply('note-42', 'Patient doing well today.');

      verify(() => mockCaretaker.reply('note-42', 'Patient doing well today.')).called(1);
    });

    test('fetchNotes is called once on load', () async {
      final mockCaretaker = MockCaretakerProvider();
      when(() => mockCaretaker.fetchNotes()).thenAnswer((_) async {});

      await mockCaretaker.fetchNotes();

      verify(() => mockCaretaker.fetchNotes()).called(1);
    });
  });
}

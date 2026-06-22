import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/features/caretaker/screens/provider_report_screen.dart';

Widget _buildSubject() => const MaterialApp(home: ProviderReportScreen());

void main() {
  group('ProviderReportScreen', () {
    testWidgets('renders Provider Report app bar', (tester) async {
      await tester.pumpWidget(_buildSubject());
      await tester.pumpAndSettle();
      expect(find.text('Provider Report'), findsOneWidget);
    });

    testWidgets('shows patient name Gloria Washington', (tester) async {
      await tester.pumpWidget(_buildSubject());
      await tester.pumpAndSettle();
      expect(find.textContaining('Gloria Washington', skipOffstage: false), findsOneWidget);
    });

    testWidgets('shows Medication Adherence card title', (tester) async {
      await tester.pumpWidget(_buildSubject());
      await tester.pumpAndSettle();
      expect(find.text('Medication Adherence', skipOffstage: false), findsOneWidget);
    });

    testWidgets('shows Peggy assistant FAB', (tester) async {
      await tester.pumpWidget(_buildSubject());
      await tester.pumpAndSettle();
      expect(find.byType(FloatingActionButton), findsOneWidget);
    });

    testWidgets('shows Share with Care Team button', (tester) async {
      await tester.pumpWidget(_buildSubject());
      await tester.pumpAndSettle();
      expect(find.text('Share with Care Team', skipOffstage: false), findsOneWidget);
    });
  });
}

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/features/medication/screens/medication_form_screen.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';

Widget _buildSubject() {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
    ],
    child: const MaterialApp(home: MedicationFormScreen()),
  );
}

void main() {
  group('MedicationFormScreen', () {
    testWidgets('renders Add Medication app bar', (tester) async {
      await tester.pumpWidget(_buildSubject());
      await tester.pumpAndSettle();
      expect(find.text('Add Medication'), findsOneWidget);
    });

    testWidgets('renders Medication Name field', (tester) async {
      await tester.pumpWidget(_buildSubject());
      await tester.pumpAndSettle();
      expect(find.text('Medication Name', skipOffstage: false), findsOneWidget);
    });

    testWidgets('renders Save Medication button', (tester) async {
      await tester.pumpWidget(_buildSubject());
      await tester.pumpAndSettle();
      expect(find.text('Save Medication', skipOffstage: false), findsOneWidget);
    });
  });
}

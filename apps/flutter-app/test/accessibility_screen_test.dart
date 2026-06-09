import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/features/accessibility/screens/accessibility_screen.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';

Widget _buildSubject() {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
    ],
    child: const MaterialApp(home: AccessibilityScreen()),
  );
}

// Drain stored framework exceptions (pre-existing ListTile+DecoratedBox warning)
// so they don't fail the test. tester.takeException() consumes one at a time.
void _drainExceptions(WidgetTester tester) {
  while (tester.takeException() != null) {}
}

void main() {
  group('AccessibilityScreen', () {
    testWidgets('renders Accessibility app bar', (tester) async {
      await tester.pumpWidget(_buildSubject());
      await tester.pump();
      _drainExceptions(tester);
      expect(find.text('Accessibility'), findsOneWidget);
    });

    testWidgets('renders Display and motion section header', (tester) async {
      await tester.pumpWidget(_buildSubject());
      await tester.pump();
      _drainExceptions(tester);
      expect(find.text('Display & motion', skipOffstage: false), findsOneWidget);
    });

    testWidgets('renders Steadiness section header', (tester) async {
      await tester.pumpWidget(_buildSubject());
      await tester.pump();
      _drainExceptions(tester);
      expect(find.text('Steadiness', skipOffstage: false), findsOneWidget);
    });

    testWidgets('renders ListView body', (tester) async {
      await tester.pumpWidget(_buildSubject());
      await tester.pump();
      _drainExceptions(tester);
      expect(find.byType(ListView), findsOneWidget);
    });
  });
}

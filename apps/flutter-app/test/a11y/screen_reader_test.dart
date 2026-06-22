import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/shared/widgets/loading_indicator.dart';
import 'package:care_connect/features/landing/screens/landing_screen.dart';
import 'package:care_connect/features/auth/screens/login_screen.dart';
import 'package:care_connect/features/symptoms/widgets/severity_selector.dart';
import 'package:care_connect/features/symptoms/widgets/symptom_buttons_row.dart';
import 'package:care_connect/features/symptoms/providers/symptom_provider.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';
import 'package:care_connect/features/auth/providers/auth_provider.dart';

// Flutter mirror of apps/mobile/src/__tests__/a11y/screen-reader.test.tsx —
// verifies the same TalkBack/VoiceOver guarantees on the Flutter build.

void main() {
  // ── LoadingIndicator ────────────────────────────────────────────────────────
  group('LoadingIndicator', () {
    testWidgets('is announced as "Loading" by default', (tester) async {
      final handle = tester.ensureSemantics();
      await tester.pumpWidget(
        const MaterialApp(home: Scaffold(body: LoadingIndicator())),
      );
      expect(find.bySemanticsLabel('Loading'), findsOneWidget);
      handle.dispose();
    });

    testWidgets('uses the message as its label', (tester) async {
      final handle = tester.ensureSemantics();
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(body: LoadingIndicator(message: 'Fetching appointments')),
        ),
      );
      expect(find.bySemanticsLabel('Fetching appointments'), findsOneWidget);
      handle.dispose();
    });
  });

  // ── Landing screen ──────────────────────────────────────────────────────────
  group('Landing screen', () {
    Widget landing() => ChangeNotifierProvider(
          create: (_) => AccessibilityProvider(),
          child: const MaterialApp(home: LandingScreen()),
        );

    testWidgets('buttons are reachable by their accessible name', (tester) async {
      final handle = tester.ensureSemantics();
      await tester.pumpWidget(landing());
      await tester.pumpAndSettle();
      expect(find.bySemanticsLabel('Sign in'), findsWidgets);
      expect(find.bySemanticsLabel(RegExp('get started', caseSensitive: false)),
          findsWidgets);
      expect(
          find.bySemanticsLabel(
              RegExp('already have an account', caseSensitive: false)),
          findsWidgets);
      handle.dispose();
    });

    testWidgets('hero image has a descriptive (non-empty) label', (tester) async {
      final handle = tester.ensureSemantics();
      await tester.pumpWidget(landing());
      await tester.pumpAndSettle();
      expect(
          find.bySemanticsLabel(
              RegExp('caregiver and elderly', caseSensitive: false)),
          findsOneWidget);
      handle.dispose();
    });
  });

  // ── Login screen ────────────────────────────────────────────────────────────
  group('Login screen', () {
    testWidgets('surfaces the auth error in an assertive live region',
        (tester) async {
      await tester.pumpWidget(MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
          ChangeNotifierProvider(create: (_) => AuthProvider()),
        ],
        child: const MaterialApp(home: LoginScreen()),
      ));
      await tester.pumpAndSettle();

      final fields = find.byType(TextFormField);
      await tester.enterText(fields.at(0), 'demo@careconnect.com');
      await tester.enterText(fields.at(1), 'wrong-password');
      await tester.tap(find.text('Sign In'));
      await tester.pumpAndSettle();

      expect(find.textContaining('Invalid'), findsOneWidget);
      expect(
        find.byWidgetPredicate(
            (w) => w is Semantics && w.properties.liveRegion == true),
        findsWidgets,
      );
    });
  });

  // ── Symptoms ────────────────────────────────────────────────────────────────
  group('Symptoms', () {
    Widget host(Widget child) => MultiProvider(
          providers: [
            ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
            ChangeNotifierProvider(create: (_) => SymptomProvider()),
          ],
          child: MaterialApp(home: Scaffold(body: child)),
        );

    Semantics semanticsLabeled(WidgetTester tester, String label) =>
        tester.widget<Semantics>(find.byWidgetPredicate(
            (w) => w is Semantics && w.properties.label == label));

    testWidgets('severity dots are radios with the default value checked',
        (tester) async {
      await tester.pumpWidget(host(const SeveritySelector()));

      // The scale runs 1-10 (parity with the React Native app).
      expect(
        find.byWidgetPredicate(
            (w) => w is Semantics && w.properties.label == 'Severity 10'),
        findsOneWidget,
      );

      // SymptomProvider defaults severity to 5.
      final s5 = semanticsLabeled(tester, 'Severity 5').properties;
      expect(s5.inMutuallyExclusiveGroup, isTrue);
      expect(s5.checked, isTrue);

      final s1 = semanticsLabeled(tester, 'Severity 1').properties;
      expect(s1.inMutuallyExclusiveGroup, isTrue);
      expect(s1.checked, isFalse);
    });

    testWidgets('symptom buttons expose a selected state that toggles',
        (tester) async {
      await tester.pumpWidget(host(const SymptomButtonsRow()));

      expect(semanticsLabeled(tester, 'Pain').properties.button, isTrue);
      expect(semanticsLabeled(tester, 'Pain').properties.selected, isFalse);

      await tester.tap(find.byWidgetPredicate(
          (w) => w is Semantics && w.properties.label == 'Pain'));
      await tester.pump();

      expect(semanticsLabeled(tester, 'Pain').properties.selected, isTrue);
    });
  });
}

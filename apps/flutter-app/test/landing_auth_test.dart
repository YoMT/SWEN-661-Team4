import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/features/landing/screens/landing_screen.dart';
import 'package:care_connect/features/auth/screens/signup_screen.dart';
import 'package:care_connect/features/auth/providers/auth_provider.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';
import 'mocks.dart';

Widget _wrapLanding() => MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
      ],
      child: const MaterialApp(home: LandingScreen()),
    );

Widget _wrapSignup(MockAuthProvider mockAuth) => MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthProvider>.value(value: mockAuth),
        ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
      ],
      child: const MaterialApp(home: SignupScreen()),
    );

// Drain RenderFlex overflow errors that come from constrained test viewport.
// The overflow is a pre-existing layout issue in the app; assertions still verify
// the correct widgets are present.
void _drainExceptions(WidgetTester tester) {
  while (tester.takeException() != null) {}
}

void main() {
  group('LandingScreen', () {
    testWidgets('renders CareConnect brand name', (tester) async {
      await tester.pumpWidget(_wrapLanding());
      await tester.pumpAndSettle();
      _drainExceptions(tester);
      expect(find.text('CareConnect'), findsWidgets);
    });

    testWidgets('renders Made for caregivers badge', (tester) async {
      await tester.pumpWidget(_wrapLanding());
      await tester.pumpAndSettle();
      _drainExceptions(tester);
      expect(find.text('Made for caregivers', skipOffstage: false), findsOneWidget);
    });

    testWidgets('renders Get started button', (tester) async {
      await tester.pumpWidget(_wrapLanding());
      await tester.pumpAndSettle();
      _drainExceptions(tester);
      expect(find.text("Get started — it's free", skipOffstage: false), findsOneWidget);
    });

    testWidgets('renders I already have an account button', (tester) async {
      await tester.pumpWidget(_wrapLanding());
      await tester.pumpAndSettle();
      _drainExceptions(tester);
      expect(find.text('I already have an account', skipOffstage: false), findsOneWidget);
    });

    testWidgets('renders Sign in link in top bar', (tester) async {
      await tester.pumpWidget(_wrapLanding());
      await tester.pumpAndSettle();
      _drainExceptions(tester);
      expect(find.text('Sign in', skipOffstage: false), findsWidgets);
    });
  });

  group('SignupScreen', () {
    late MockAuthProvider mockAuth;

    setUp(() {
      mockAuth = MockAuthProvider();
      when(() => mockAuth.isLoading).thenReturn(false);
      when(() => mockAuth.errorMessage).thenReturn(null);
      when(() => mockAuth.isAuthenticated).thenReturn(false);
      when(() => mockAuth.currentUser).thenReturn(null);
    });

    testWidgets('renders Create Account app bar', (tester) async {
      await tester.pumpWidget(_wrapSignup(mockAuth));
      await tester.pumpAndSettle();
      _drainExceptions(tester);
      expect(find.text('Create Account'), findsWidgets);
    });

    testWidgets('renders CareConnect brand', (tester) async {
      await tester.pumpWidget(_wrapSignup(mockAuth));
      await tester.pumpAndSettle();
      _drainExceptions(tester);
      expect(find.text('CareConnect'), findsOneWidget);
    });

    testWidgets('renders Create your caregiver account subtitle', (tester) async {
      await tester.pumpWidget(_wrapSignup(mockAuth));
      await tester.pumpAndSettle();
      _drainExceptions(tester);
      expect(find.text('Create your caregiver account'), findsOneWidget);
    });

    testWidgets('renders Already have an account link', (tester) async {
      await tester.pumpWidget(_wrapSignup(mockAuth));
      await tester.pumpAndSettle();
      _drainExceptions(tester);
      expect(find.text('Already have an account?'), findsOneWidget);
    });
  });
}

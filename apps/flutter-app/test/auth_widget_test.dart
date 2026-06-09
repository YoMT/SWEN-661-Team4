import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/features/auth/screens/login_screen.dart';
import 'package:care_connect/features/auth/providers/auth_provider.dart';
import 'package:care_connect/features/ai_assistant/providers/ai_assistant_provider.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';
import 'mocks.dart';

Widget _buildSubject(MockAuthProvider mockAuth) {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider<AuthProvider>.value(value: mockAuth),
      ChangeNotifierProvider(create: (_) => AiAssistantProvider()),
      ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
    ],
    child: const MaterialApp(home: LoginScreen()),
  );
}

void main() {
  late MockAuthProvider mockAuth;

  setUp(() {
    mockAuth = MockAuthProvider();
    when(() => mockAuth.isLoading).thenReturn(false);
    when(() => mockAuth.errorMessage).thenReturn(null);
    when(() => mockAuth.isAuthenticated).thenReturn(false);
    when(() => mockAuth.currentUser).thenReturn(null);
  });

  group('LoginScreen — MockAuthProvider', () {
    testWidgets('renders CareConnect brand title in normal state', (tester) async {
      await tester.pumpWidget(_buildSubject(mockAuth));
      await tester.pumpAndSettle();
      expect(find.text('CareConnect'), findsOneWidget);
    });

    testWidgets('renders Sign In button when not loading', (tester) async {
      await tester.pumpWidget(_buildSubject(mockAuth));
      await tester.pumpAndSettle();
      expect(find.text('Sign In'), findsOneWidget);
    });

    testWidgets('shows error message when auth provider has errorMessage', (tester) async {
      when(() => mockAuth.errorMessage).thenReturn('Sign in failed. Please try again.');
      await tester.pumpWidget(_buildSubject(mockAuth));
      await tester.pumpAndSettle();
      expect(find.text('Sign in failed. Please try again.'), findsOneWidget);
    });

    testWidgets('hides error row when errorMessage is null', (tester) async {
      await tester.pumpWidget(_buildSubject(mockAuth));
      await tester.pumpAndSettle();
      expect(find.text('Sign in failed. Please try again.'), findsNothing);
    });

    testWidgets('shows CircularProgressIndicator when isLoading is true', (tester) async {
      when(() => mockAuth.isLoading).thenReturn(true);
      await tester.pumpWidget(_buildSubject(mockAuth));
      await tester.pump(); // pumpAndSettle would time out — CircularProgressIndicator never stops
      expect(find.byType(CircularProgressIndicator), findsWidgets);
    });
  });
}

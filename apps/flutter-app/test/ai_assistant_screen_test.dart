import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/features/ai_assistant/screens/ai_assistant_screen.dart';
import 'package:care_connect/features/ai_assistant/providers/ai_assistant_provider.dart';
import 'package:care_connect/features/ai_assistant/widgets/typing_indicator.dart';
import 'mocks.dart';

Widget _buildSubject(MockAiAssistantProvider mockAi) {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider<AiAssistantProvider>.value(value: mockAi),
    ],
    child: const MaterialApp(home: AiAssistantScreen()),
  );
}

void main() {
  late MockAiAssistantProvider mockAi;

  setUp(() {
    mockAi = MockAiAssistantProvider();
    when(() => mockAi.messages).thenReturn([]);
    when(() => mockAi.isTyping).thenReturn(false);
    when(() => mockAi.isOpen).thenReturn(false);
  });

  group('AiAssistantScreen — MockAiAssistantProvider', () {
    testWidgets('renders AI Assistant app bar', (tester) async {
      await tester.pumpWidget(_buildSubject(mockAi));
      await tester.pumpAndSettle();
      expect(find.text('AI Assistant'), findsOneWidget);
    });

    testWidgets('renders empty message list when messages is empty', (tester) async {
      await tester.pumpWidget(_buildSubject(mockAi));
      await tester.pumpAndSettle();
      expect(find.byType(ListView), findsOneWidget);
    });

    testWidgets('shows TypingIndicator when isTyping is true', (tester) async {
      when(() => mockAi.isTyping).thenReturn(true);
      await tester.pumpWidget(_buildSubject(mockAi));
      await tester.pumpAndSettle();
      expect(find.byType(TypingIndicator), findsOneWidget);
    });

    testWidgets('hides TypingIndicator when isTyping is false', (tester) async {
      await tester.pumpWidget(_buildSubject(mockAi));
      await tester.pumpAndSettle();
      expect(find.byType(TypingIndicator), findsNothing);
    });
  });
}

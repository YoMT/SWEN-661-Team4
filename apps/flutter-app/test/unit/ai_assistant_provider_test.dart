import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/features/ai_assistant/providers/ai_assistant_provider.dart';
import 'package:care_connect/features/ai_assistant/models/chat_message_model.dart';

void main() {
  late AiAssistantProvider provider;

  setUp(() => provider = AiAssistantProvider());

  test('toggle flips the open state', () {
    expect(provider.isOpen, isFalse);
    provider.toggle();
    expect(provider.isOpen, isTrue);
    provider.toggle();
    expect(provider.isOpen, isFalse);
  });

  test('sendMessage appends the user message then an assistant reply', () async {
    await provider.sendMessage('Tell me about medication');
    expect(provider.messages.length, 2);
    expect(provider.messages.first.role, MessageRole.user);
    expect(provider.messages.last.role, MessageRole.assistant);
    expect(provider.isTyping, isFalse);
  });

  group('Peggy keyword replies (parity with mobile aiReply)', () {
    Future<String> reply(String message) async {
      final p = AiAssistantProvider();
      await p.sendMessage(message);
      return p.messages.last.content;
    }

    test('medication keyword', () async {
      expect(await reply('what medication today?'), contains('Metoprolol'));
    });
    test('appointment keyword', () async {
      expect(await reply('any appointment?'), contains('Dr. Sarah Chen'));
    });
    test('symptom keyword', () async {
      expect(await reply('how are her symptoms?'), contains('dizziness'));
    });
    test('blood pressure keyword', () async {
      expect(await reply('what was the blood pressure?'), contains('138/85'));
    });
    test('emergency/contact keyword', () async {
      expect(await reply('emergency contact please'), contains('Sarah Johnson'));
    });
    test('fallback reply for unrecognized input', () async {
      expect(await reply('hello there'), contains("I'm here to help"));
    });
  });
}

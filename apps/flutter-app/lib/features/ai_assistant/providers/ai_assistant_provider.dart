import 'package:flutter/foundation.dart';
import '../models/chat_message_model.dart';

class AiAssistantProvider extends ChangeNotifier {
  bool isOpen = false;
  bool isTyping = false;
  List<ChatMessageModel> messages = [];

  void toggle() {
    isOpen = !isOpen;
    notifyListeners();
  }

  Future<void> sendMessage(String content) async {
    final now = DateTime.now();
    final userMsg = ChatMessageModel(
      id: '${now.millisecondsSinceEpoch}_user',
      role: MessageRole.user,
      content: content,
      timestamp: now,
    );
    messages = [...messages, userMsg];
    isTyping = true;
    notifyListeners();

    // TODO: call AI backend
    await Future.delayed(const Duration(seconds: 1));

    final reply = ChatMessageModel(
      id: '${DateTime.now().millisecondsSinceEpoch}_assistant',
      role: MessageRole.assistant,
      content: 'I received your message. AI integration coming soon.',
      timestamp: DateTime.now(),
    );
    messages = [...messages, reply];
    isTyping = false;
    notifyListeners();
  }
}

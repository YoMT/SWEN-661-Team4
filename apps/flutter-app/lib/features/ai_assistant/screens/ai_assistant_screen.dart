import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/ai_assistant_provider.dart';
import '../widgets/chat_bubble.dart';
import '../widgets/chat_input_field.dart';
import '../widgets/typing_indicator.dart';

class AiAssistantScreen extends StatelessWidget {
  const AiAssistantScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AiAssistantProvider>();
    return Scaffold(
      appBar: AppBar(title: const Text('AI Assistant')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: provider.messages.length + (provider.isTyping ? 1 : 0),
              itemBuilder: (_, i) {
                if (i == provider.messages.length) return const TypingIndicator();
                return ChatBubble(message: provider.messages[i]);
              },
            ),
          ),
          ChatInputField(onSend: context.read<AiAssistantProvider>().sendMessage),
        ],
      ),
    );
  }
}

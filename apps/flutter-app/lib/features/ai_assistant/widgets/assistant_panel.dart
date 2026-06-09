import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/ai_assistant_provider.dart';
import 'chat_bubble.dart';
import 'chat_input_field.dart';
import 'typing_indicator.dart';

class AssistantPanel extends StatelessWidget {
  const AssistantPanel({super.key});

 @override
Widget build(BuildContext context) {
  final provider = context.watch<AiAssistantProvider>();
  if (!provider.isOpen) return const SizedBox.shrink();
  return Positioned(
    bottom: 0,
    left: 0,
    right: 0,
    height: MediaQuery.of(context).size.height * 0.5,
    child: Material(
      elevation: 8,
      borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                const Icon(Icons.smart_toy_outlined),
                const SizedBox(width: 8),
                Text('AI Assistant', style: Theme.of(context).textTheme.titleMedium),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => context.read<AiAssistantProvider>().toggle(),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(8),
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
    ),
  );
}
}

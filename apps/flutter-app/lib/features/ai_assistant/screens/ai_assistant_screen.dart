import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/ai_assistant_provider.dart';
import '../widgets/chat_bubble.dart';
import '../widgets/chat_input_field.dart';
import '../widgets/typing_indicator.dart';
import '../../../core/theme/app_colors.dart';

class AiAssistantScreen extends StatelessWidget {
  const AiAssistantScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AiAssistantProvider>();
    return Scaffold(
      appBar: AppBar(title: const Text('AI Assistant')),
      body: Column(
        children: [
          if (provider.errorMessage != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: Row(
                children: [
                  const Icon(Icons.error_outline, size: 16, color: AppColors.error),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(provider.errorMessage!,
                        style: const TextStyle(fontSize: 14, color: AppColors.error)),
                  ),
                ],
              ),
            ),
          Expanded(
            child: provider.messages.isEmpty && !provider.isTyping
                ? const Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.smart_toy_outlined, size: 64, color: AppColors.borderStrong),
                        SizedBox(height: 16),
                        Text('Ask me anything',
                            style: TextStyle(fontSize: 16, color: AppColors.textMuted)),
                        SizedBox(height: 6),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 32),
                          child: Text(
                            'I can help with medications, appointments, and health questions',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 13, color: AppColors.textMuted),
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
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

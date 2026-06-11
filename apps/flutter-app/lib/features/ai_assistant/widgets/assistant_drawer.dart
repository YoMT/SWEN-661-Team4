import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/ai_assistant_provider.dart';
import '../../../core/theme/app_colors.dart';
import 'chat_bubble.dart';
import 'chat_input_field.dart';
import 'typing_indicator.dart';

class AssistantDrawer extends StatelessWidget {
  const AssistantDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AiAssistantProvider>();
    return Drawer(
      width: MediaQuery.of(context).size.width * 0.85,
      child: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              child: Row(
                children: [
                  const Icon(Icons.smart_toy_outlined, color: AppColors.primary),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text('Peggy',
                        style: Theme.of(context).textTheme.titleMedium),
                  ),
                  Semantics(
                    label: 'Close assistant',
                    button: true,
                    child: SizedBox(
                      width: 48,
                      height: 48,
                      child: IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.of(context).pop(),
                        tooltip: 'Close',
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Expanded(
              child: provider.messages.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.smart_toy_outlined,
                              size: 48, color: AppColors.borderStrong),
                          SizedBox(height: 12),
                          Text(
                            "Hi, I'm Peggy!\nHow can I help you today?",
                            textAlign: TextAlign.center,
                            style: TextStyle(color: AppColors.textMuted),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(8),
                      itemCount:
                          provider.messages.length + (provider.isTyping ? 1 : 0),
                      itemBuilder: (_, i) {
                        if (i == provider.messages.length) {
                          return const TypingIndicator();
                        }
                        return ChatBubble(message: provider.messages[i]);
                      },
                    ),
            ),
            ChatInputField(
                onSend: context.read<AiAssistantProvider>().sendMessage),
          ],
        ),
      ),
    );
  }
}

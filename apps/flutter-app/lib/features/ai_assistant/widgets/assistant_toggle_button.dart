import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/ai_assistant_provider.dart';

class AssistantToggleButton extends StatelessWidget {
  const AssistantToggleButton({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AiAssistantProvider>();
    return FloatingActionButton(
      onPressed: () => context.read<AiAssistantProvider>().toggle(),
      child: Icon(provider.isOpen ? Icons.close : Icons.smart_toy_outlined),
    );
  }
}

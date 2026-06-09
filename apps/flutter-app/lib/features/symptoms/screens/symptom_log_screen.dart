import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/symptom_provider.dart';
import '../widgets/symptom_buttons_row.dart';
import '../widgets/severity_selector.dart';
import '../widgets/save_log_button.dart';
import '../widgets/recent_entries_list.dart';
import '../../../core/theme/app_colors.dart';
import '../../ai_assistant/widgets/assistant_toggle_button.dart';
import '../../ai_assistant/widgets/assistant_panel.dart';

class SymptomLogScreen extends StatefulWidget {
  const SymptomLogScreen({super.key});

  @override
  State<SymptomLogScreen> createState() => _SymptomLogScreenState();
}

class _SymptomLogScreenState extends State<SymptomLogScreen> {
  final _noteController = TextEditingController();

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SymptomProvider>();
    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(title: const Text('Log a symptom')),
      floatingActionButton: const AssistantToggleButton(),
     body: Stack(
  children: [
    ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (provider.errorMessage != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
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
        const Text("What's bothering Eleanor?",
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
        const SizedBox(height: 16),
        const SymptomButtonsRow(),
        const SizedBox(height: 24),
        const SeveritySelector(),
        const SizedBox(height: 24),
        const Text('Add a note (optional)',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.text)),
        const SizedBox(height: 8),
        TextFormField(
          controller: _noteController,
          style: const TextStyle(fontSize: 16, color: AppColors.text),
          decoration: InputDecoration(
            hintText: 'e.g. after lunch, lasted 10 min',
            hintStyle: const TextStyle(color: AppColors.textMuted),
   suffixIcon: Semantics(
  key: const Key('voiceInputButton'),
  label: 'Voice input',
  button: true,
  child: IconButton(
    icon: const Icon(Icons.mic_none, color: AppColors.primary),
    onPressed: () {},
    tooltip: 'Voice input',
  ),
),
          ),
        ),
        const SizedBox(height: 24),
        SaveLogButton(noteController: _noteController),
        const SizedBox(height: 32),
        if (provider.logs.isEmpty)
          const Column(
            children: [
              Icon(Icons.monitor_heart_outlined, size: 64, color: AppColors.borderStrong),
              SizedBox(height: 16),
              Text('No symptoms logged yet',
                  style: TextStyle(fontSize: 16, color: AppColors.textMuted)),
              SizedBox(height: 6),
              Text('Use the form above to log your first entry',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
            ],
          )
        else ...[
          const Text('Recent entries',
              style: TextStyle(
                  fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
          const SizedBox(height: 12),
          const RecentEntriesList(),
        ],
      ],
    ),
    const AssistantPanel(),
  ],
),
    );
  }
}

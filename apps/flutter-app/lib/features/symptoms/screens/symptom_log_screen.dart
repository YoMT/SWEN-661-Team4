import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/symptom_provider.dart';
import '../widgets/symptom_buttons_row.dart';
import '../widgets/severity_selector.dart';
import '../widgets/save_log_button.dart';
import '../widgets/recent_entries_list.dart';
import '../../../core/theme/app_colors.dart';

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
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text("What's bothering Eleanor?",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
          const SizedBox(height: 16),
          const SymptomButtonsRow(),
          const SizedBox(height: 24),
          const SeveritySelector(),
          const SizedBox(height: 24),
          // Note field with voice input
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
                label: 'Voice input',
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
          if (provider.logs.isNotEmpty) ...[
            const SizedBox(height: 32),
            const Text('Recent entries',
                style: TextStyle(
                    fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.text)),
            const SizedBox(height: 12),
            const RecentEntriesList(),
          ],
        ],
      ),
    );
  }
}

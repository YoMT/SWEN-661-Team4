import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/symptom_provider.dart';
import '../../../shared/widgets/app_button.dart';

class SaveLogButton extends StatelessWidget {
  final TextEditingController noteController;

  const SaveLogButton({super.key, required this.noteController});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SymptomProvider>();
    return AppButton(
      label: 'Save to log',
      icon: Icons.check,
      width: double.infinity,
      semanticLabel: 'Save symptom log entry',
      onPressed: provider.selectedSymptom == null
          ? null
          : () async {
              await context
                  .read<SymptomProvider>()
                  .save(noteController.text.isEmpty ? null : noteController.text);
              noteController.clear();
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Symptom logged'),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
    );
  }
}

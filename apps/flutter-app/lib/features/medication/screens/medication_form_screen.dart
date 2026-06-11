import 'package:flutter/material.dart';
import '../widgets/dosage_selector.dart';
import '../widgets/schedule_picker.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../../ai_assistant/widgets/assistant_toggle_button.dart';
import '../../ai_assistant/widgets/assistant_drawer.dart';

class MedicationFormScreen extends StatelessWidget {
  const MedicationFormScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Medication')),
      floatingActionButton: const AssistantToggleButton(),
      endDrawer: const AssistantDrawer(),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const AppTextField(label: 'Medication Name'),
          const SizedBox(height: 16),
          const DosageSelector(),
          const SizedBox(height: 16),
          const SchedulePicker(),
          const SizedBox(height: 24),
          AppButton(label: 'Save Medication', onPressed: () {}, width: double.infinity),
        ],
      ),
    );
  }
}

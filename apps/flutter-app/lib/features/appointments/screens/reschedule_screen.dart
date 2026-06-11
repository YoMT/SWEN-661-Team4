import 'package:flutter/material.dart';
import '../../../shared/widgets/app_button.dart';
import '../../ai_assistant/widgets/assistant_toggle_button.dart';
import '../../ai_assistant/widgets/assistant_drawer.dart';

class RescheduleScreen extends StatelessWidget {
  const RescheduleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reschedule Appointment')),
      floatingActionButton: const AssistantToggleButton(),
      endDrawer: const AssistantDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const Text('Select a new date and time'),
            const Spacer(),
            AppButton(label: 'Confirm Reschedule', onPressed: () {}, width: double.infinity),
          ],
        ),
      ),
    );
  }
}

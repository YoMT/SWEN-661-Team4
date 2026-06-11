import 'package:flutter/material.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../../ai_assistant/widgets/assistant_toggle_button.dart';
import '../../ai_assistant/widgets/assistant_drawer.dart';

class NewAppointmentScreen extends StatelessWidget {
  const NewAppointmentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Book Appointment')),
      floatingActionButton: const AssistantToggleButton(),
      endDrawer: const AssistantDrawer(),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const AppTextField(label: 'Doctor Name'),
          const SizedBox(height: 16),
          const AppTextField(label: 'Specialty'),
          const SizedBox(height: 16),
          const AppTextField(label: 'Date & Time'),
          const SizedBox(height: 24),
          AppButton(label: 'Book Appointment', onPressed: () {}, width: double.infinity),
        ],
      ),
    );
  }
}

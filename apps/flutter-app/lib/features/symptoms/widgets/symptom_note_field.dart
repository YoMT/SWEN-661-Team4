import 'package:flutter/material.dart';
import '../../../shared/widgets/voice_input_field.dart';

class SymptomNoteField extends StatelessWidget {
  final TextEditingController controller;

  const SymptomNoteField({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return VoiceInputField(
      label: 'Additional notes',
      controller: controller,
      onVoiceTap: () {
        // TODO: implement voice input
      },
    );
  }
}

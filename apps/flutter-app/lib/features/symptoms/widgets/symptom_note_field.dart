import 'package:flutter/material.dart';
import '../../../shared/widgets/voice_input_field.dart';

class SymptomNoteField extends StatelessWidget {
  final TextEditingController controller;

  const SymptomNoteField({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return VoiceInputField(
      label: 'Additional notes',
      hint: 'e.g. after lunch, lasted 10 min',
      controller: controller,
    );
  }
}

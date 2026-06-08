import 'package:flutter/material.dart';
import 'app_text_field.dart';

class VoiceInputField extends StatelessWidget {
  final String label;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final VoidCallback? onVoiceTap;

  const VoiceInputField({
    super.key,
    required this.label,
    this.controller,
    this.validator,
    this.onVoiceTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppTextField(
      label: label,
      controller: controller,
      validator: validator,
      maxLines: 3,
      suffixIcon: IconButton(
        icon: const Icon(Icons.mic_outlined),
        tooltip: 'Voice input',
        onPressed: onVoiceTap,
      ),
    );
  }
}

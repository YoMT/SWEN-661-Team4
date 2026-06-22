import 'package:flutter/material.dart';
import '../../core/services/speech_input_service.dart';
import 'app_text_field.dart';

/// A multi-line text field with built-in tap-to-dictate voice input, intended
/// for users with tremors who find typing difficult. Falls back to plain
/// typing when speech recognition is unavailable.
class VoiceInputField extends StatefulWidget {
  final String label;
  final String? hint;
  final TextEditingController? controller;
  final String? Function(String?)? validator;

  const VoiceInputField({
    super.key,
    required this.label,
    this.hint,
    this.controller,
    this.validator,
  });

  @override
  State<VoiceInputField> createState() => _VoiceInputFieldState();
}

class _VoiceInputFieldState extends State<VoiceInputField> {
  late final TextEditingController _controller =
      widget.controller ?? TextEditingController();
  final SpeechInputService _speech = SpeechInputService();
  bool _listening = false;

  @override
  void dispose() {
    _speech.dispose();
    if (widget.controller == null) _controller.dispose();
    super.dispose();
  }

  Future<void> _toggle() async {
    if (_speech.isListening) {
      await _speech.stop();
      if (mounted) setState(() => _listening = false);
      return;
    }
    final started = await _speech.start(
      onResult: (words) {
        _controller.text = words;
        _controller.selection = TextSelection.collapsed(offset: words.length);
      },
      onDone: () {
        if (mounted) setState(() => _listening = false);
      },
    );
    if (!mounted) return;
    if (started) {
      setState(() => _listening = true);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Voice input is not available on this device')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppTextField(
      label: widget.label,
      hint: widget.hint,
      controller: _controller,
      validator: widget.validator,
      maxLines: 3,
      suffixIcon: IconButton(
        icon: Icon(_listening ? Icons.mic : Icons.mic_none),
        tooltip: _listening ? 'Stop voice input' : 'Voice input',
        onPressed: _toggle,
      ),
    );
  }
}

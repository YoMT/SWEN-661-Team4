import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/caretaker_provider.dart';

class NoteReplyField extends StatefulWidget {
  final String noteId;

  const NoteReplyField({super.key, required this.noteId});

  @override
  State<NoteReplyField> createState() => _NoteReplyFieldState();
}

class _NoteReplyFieldState extends State<NoteReplyField> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: _controller,
            decoration: const InputDecoration(hintText: 'Write a reply...', border: OutlineInputBorder(), isDense: true),
          ),
        ),
        const SizedBox(width: 8),
        IconButton(
          icon: const Icon(Icons.send),
          onPressed: () async {
            if (_controller.text.isEmpty) return;
            await context.read<CaretakerProvider>().reply(widget.noteId, _controller.text);
            _controller.clear();
          },
        ),
      ],
    );
  }
}

import 'package:flutter/material.dart';
import '../models/caretaker_note_model.dart';
import 'note_reply_field.dart';

class NoteCard extends StatelessWidget {
  final CaretakerNoteModel note;

  const NoteCard({super.key, required this.note});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(note.authorName, style: Theme.of(context).textTheme.labelLarge),
            const SizedBox(height: 4),
            Text(note.content),
            if (note.replyContent != null) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.secondaryContainer,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text('Reply: ${note.replyContent}'),
              ),
            ],
            const SizedBox(height: 8),
            NoteReplyField(noteId: note.id),
          ],
        ),
      ),
    );
  }
}

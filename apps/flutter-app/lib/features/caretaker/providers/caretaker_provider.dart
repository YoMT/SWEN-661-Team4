import 'package:flutter/foundation.dart';
import '../models/caretaker_note_model.dart';

class CaretakerProvider extends ChangeNotifier {
  List<CaretakerNoteModel> notes = [];
  bool isLoading = false;
  String? errorMessage;

  Future<void> fetchNotes() async {
    isLoading = true;
    errorMessage = null;
    notifyListeners();
    try {
      await Future.delayed(const Duration(milliseconds: 500));
    } catch (e) {
      errorMessage = 'Failed to load notes.';
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> reply(String noteId, String content) async {
    errorMessage = null;
    try {
      notes = notes.map((n) {
        if (n.id == noteId) {
          final now = DateTime.now();
          return CaretakerNoteModel(
            id: n.id,
            createdAt: n.createdAt,
            updatedAt: now,
            authorName: n.authorName,
            content: n.content,
            replyContent: content,
          );
        }
        return n;
      }).toList();
    } catch (e) {
      errorMessage = 'Failed to send reply.';
    }
    notifyListeners();
  }
}

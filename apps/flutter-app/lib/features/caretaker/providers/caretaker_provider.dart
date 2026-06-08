import 'package:flutter/foundation.dart';
import '../models/caretaker_note_model.dart';

class CaretakerProvider extends ChangeNotifier {
  List<CaretakerNoteModel> notes = [];
  bool isLoading = false;

  Future<void> fetchNotes() async {
    isLoading = true;
    notifyListeners();
    // TODO: fetch from backend
    await Future.delayed(const Duration(milliseconds: 500));
    isLoading = false;
    notifyListeners();
  }

  Future<void> reply(String noteId, String content) async {
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
    notifyListeners();
  }
}

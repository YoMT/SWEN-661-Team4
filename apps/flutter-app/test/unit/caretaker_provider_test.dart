import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/features/caretaker/providers/caretaker_provider.dart';

void main() {
  late CaretakerProvider provider;

  setUp(() => provider = CaretakerProvider());

  test('is seeded with care-team notes', () {
    expect(provider.notes, isNotEmpty);
    expect(provider.notes.first.authorName, contains('Maria'));
  });

  test('fetchNotes toggles loading and repopulates notes', () async {
    final future = provider.fetchNotes();
    expect(provider.isLoading, isTrue);
    await future;
    expect(provider.isLoading, isFalse);
    expect(provider.notes, isNotEmpty);
    expect(provider.errorMessage, isNull);
  });

  test('reply sets replyContent on the targeted note', () async {
    final id = provider.notes.first.id;
    await provider.reply(id, 'Thanks for the update.');
    final updated = provider.notes.firstWhere((n) => n.id == id);
    expect(updated.replyContent, 'Thanks for the update.');
  });

  test('reply leaves other notes unchanged', () async {
    final target = provider.notes.first.id;
    final other = provider.notes.last;
    await provider.reply(target, 'Noted.');
    final stillOther = provider.notes.firstWhere((n) => n.id == other.id);
    expect(stillOther.content, other.content);
  });
}

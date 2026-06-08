import '../../../shared/models/base_model.dart';

class CaretakerNoteModel extends BaseModel {
  final String authorName;
  final String content;
  final String? replyContent;

  const CaretakerNoteModel({
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    required this.authorName,
    required this.content,
    this.replyContent,
  });

  @override
  Map<String, dynamic> toJson() => {
        'id': id,
        'authorName': authorName,
        'content': content,
        'replyContent': replyContent,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
      };
}

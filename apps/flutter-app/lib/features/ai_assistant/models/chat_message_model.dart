enum MessageRole { user, assistant }

class ChatMessageModel {
  final String id;
  final MessageRole role;
  final String content;
  final DateTime timestamp;

  const ChatMessageModel({
    required this.id,
    required this.role,
    required this.content,
    required this.timestamp,
  });
}

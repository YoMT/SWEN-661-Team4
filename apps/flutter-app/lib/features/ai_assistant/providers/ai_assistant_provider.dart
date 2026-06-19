import 'package:flutter/foundation.dart';
import '../models/chat_message_model.dart';

class AiAssistantProvider extends ChangeNotifier {
  bool isOpen = false;
  bool isTyping = false;
  List<ChatMessageModel> messages = [];
  String? errorMessage;

  void toggle() {
    isOpen = !isOpen;
    notifyListeners();
  }

  Future<void> sendMessage(String content) async {
    errorMessage = null;
    final now = DateTime.now();
    final userMsg = ChatMessageModel(
      id: '${now.millisecondsSinceEpoch}_user',
      role: MessageRole.user,
      content: content,
      timestamp: now,
    );
    messages = [...messages, userMsg];
    isTyping = true;
    notifyListeners();
    try {
      await Future.delayed(const Duration(seconds: 1));
      final reply = ChatMessageModel(
        id: '${DateTime.now().millisecondsSinceEpoch}_assistant',
        role: MessageRole.assistant,
        content: _aiReply(content),
        timestamp: DateTime.now(),
      );
      messages = [...messages, reply];
    } catch (e) {
      errorMessage = 'Failed to get a response. Please try again.';
    } finally {
      isTyping = false;
      notifyListeners();
    }
  }

  String _aiReply(String message) {
    final m = message.toLowerCase();
    if (m.contains('medication') || m.contains('med') || m.contains('pill')) {
      return "Margaret has 3 medications today. Metoprolol (50mg) was taken this morning. Lisinopril (10mg) is due now — please remind her to take it with food. Atorvastatin (20mg) is scheduled for tonight at 9pm.";
    }
    if (m.contains('appointment') || m.contains('doctor') || m.contains('visit')) {
      return "There's an appointment with Dr. Sarah Chen (Cardiologist) today at 3pm at City Heart Clinic. Remember to bring the blood pressure log. Dr. Torres has a video call booked for next week.";
    }
    if (m.contains('symptom') || m.contains('feeling') || m.contains('pain')) {
      return "Margaret logged dizziness (severity 3/10) about 2 hours ago and fatigue (severity 4/10) this morning. The dizziness after standing can indicate orthostatic hypotension — worth mentioning to Dr. Chen at today's appointment.";
    }
    if (m.contains('blood pressure') || m.contains('bp')) {
      return "Blood pressure was 138/85 at noon — slightly elevated. Normal target is under 130/80 for Margaret's profile. Monitor again this evening and flag anything above 145/90.";
    }
    if (m.contains('emergency') || m.contains('contact') || m.contains('call')) {
      return "Emergency contacts on file: Sarah Johnson (daughter) at (555) 234-5678, and Dr. Sarah Chen's office at (555) 987-6543.";
    }
    return "I'm here to help with Margaret's care. You can ask me about today's medications, upcoming appointments, recent symptoms, or blood pressure readings.";
  }
}

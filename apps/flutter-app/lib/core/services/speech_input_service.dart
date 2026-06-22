import 'package:speech_to_text/speech_to_text.dart';

/// Thin wrapper around `speech_to_text` that provides tap-to-dictate voice
/// input for the accessibility-focused note fields.
///
/// Degrades gracefully: on platforms or devices without speech recognition
/// (web, some desktops, the test environment) [start] returns `false` so
/// callers can fall back to typing instead of crashing.
class SpeechInputService {
  final SpeechToText _speech = SpeechToText();
  bool _initialized = false;

  bool get isListening => _speech.isListening;

  Future<bool> _ensureReady() async {
    if (_initialized) return _speech.isAvailable;
    _initialized = await _speech.initialize(
      onError: (_) {},
      onStatus: (_) {},
    );
    return _initialized;
  }

  /// Begins listening. [onResult] is called with the cumulative transcript as
  /// it is recognized; [onDone] fires once a final result is delivered.
  /// Returns `false` if speech recognition is unavailable.
  Future<bool> start({
    required void Function(String words) onResult,
    void Function()? onDone,
  }) async {
    final ready = await _ensureReady();
    if (!ready) return false;
    await _speech.listen(
      onResult: (result) {
        onResult(result.recognizedWords);
        if (result.finalResult) onDone?.call();
      },
    );
    return true;
  }

  Future<void> stop() => _speech.stop();

  void dispose() {
    if (_speech.isListening) _speech.cancel();
  }
}

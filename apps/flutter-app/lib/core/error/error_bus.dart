import 'package:flutter/foundation.dart';

/// App-wide error queue, mirroring the mobile app's `ErrorProvider` +
/// `GlobalErrorToast`. Providers push user-facing failure messages here and a
/// single toast surfaces them one at a time, dismissible by the user.
class ErrorBus extends ChangeNotifier {
  ErrorBus._();

  static final ErrorBus instance = ErrorBus._();

  final List<String> _errors = [];

  List<String> get errors => List.unmodifiable(_errors);
  String? get current => _errors.isEmpty ? null : _errors.first;

  void push(String message) {
    _errors.add(message);
    notifyListeners();
  }

  void dismiss() {
    if (_errors.isEmpty) return;
    _errors.removeAt(0);
    notifyListeners();
  }

  void clear() {
    if (_errors.isEmpty) return;
    _errors.clear();
    notifyListeners();
  }
}

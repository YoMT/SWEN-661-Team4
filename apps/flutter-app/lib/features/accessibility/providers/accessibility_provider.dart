import 'package:flutter/foundation.dart';
import '../models/accessibility_model.dart';

class AccessibilityProvider extends ChangeNotifier {
  AccessibilityModel _settings = const AccessibilityModel();

  AccessibilityModel get settings => _settings;

  TextSizeLevel get textSize => _settings.textSize;
  double get textScale => _settings.textScale;
  bool get tremorMode => _settings.tremorMode;
  bool get reduceMotion => _settings.reduceMotion;
  bool get highContrast => _settings.highContrast;
  bool get readAloud => _settings.readAloud;
  bool get confirmActions => _settings.confirmActions;
  double get primaryButtonHeight => _settings.primaryButtonHeight;
  double get navItemHeight => _settings.navItemHeight;
  double get symptomTileHeight => _settings.symptomTileHeight;
  double get minTouchTarget => _settings.minTouchTarget;

  void setTextSize(TextSizeLevel level) {
    _settings = _settings.copyWith(textSize: level);
    notifyListeners();
  }

  void toggleTremorMode() {
    _settings = _settings.copyWith(tremorMode: !_settings.tremorMode);
    notifyListeners();
  }

  void toggleReduceMotion() {
    _settings = _settings.copyWith(reduceMotion: !_settings.reduceMotion);
    notifyListeners();
  }

  void toggleHighContrast() {
    _settings = _settings.copyWith(highContrast: !_settings.highContrast);
    notifyListeners();
  }

  void toggleReadAloud() {
    _settings = _settings.copyWith(readAloud: !_settings.readAloud);
    notifyListeners();
  }

  void toggleConfirmActions() {
    _settings = _settings.copyWith(confirmActions: !_settings.confirmActions);
    notifyListeners();
  }
}

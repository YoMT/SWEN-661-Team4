enum TextSizeLevel { standard, large, largest }

class AccessibilityModel {
  final TextSizeLevel textSize;
  final bool tremorMode;
  final bool reduceMotion;
  final bool highContrast;
  final bool readAloud;
  final bool confirmActions;

  const AccessibilityModel({
    this.textSize = TextSizeLevel.standard,
    this.tremorMode = false,
    this.reduceMotion = true,
    this.highContrast = false,
    this.readAloud = false,
    this.confirmActions = true,
  });

  double get textScale => switch (textSize) {
        TextSizeLevel.standard => 1.0,
        TextSizeLevel.large => 1.25,
        TextSizeLevel.largest => 1.5,
      };

  // Minimum touch target sizes driven by Tremor Mode
  double get minTouchTarget => tremorMode ? 60.0 : 44.0;
  double get primaryButtonHeight => tremorMode ? 72.0 : 64.0;
  double get navItemHeight => tremorMode ? 64.0 : 56.0;
  double get symptomTileHeight => tremorMode ? 84.0 : 72.0;

  AccessibilityModel copyWith({
    TextSizeLevel? textSize,
    bool? tremorMode,
    bool? reduceMotion,
    bool? highContrast,
    bool? readAloud,
    bool? confirmActions,
  }) {
    return AccessibilityModel(
      textSize: textSize ?? this.textSize,
      tremorMode: tremorMode ?? this.tremorMode,
      reduceMotion: reduceMotion ?? this.reduceMotion,
      highContrast: highContrast ?? this.highContrast,
      readAloud: readAloud ?? this.readAloud,
      confirmActions: confirmActions ?? this.confirmActions,
    );
  }
}

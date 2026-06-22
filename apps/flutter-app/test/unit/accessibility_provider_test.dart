import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';
import 'package:care_connect/features/accessibility/models/accessibility_model.dart';

void main() {
  late AccessibilityProvider provider;

  setUp(() => provider = AccessibilityProvider());

  test('defaults: standard text, confirm actions on, reduce motion on', () {
    expect(provider.textSize, TextSizeLevel.standard);
    expect(provider.textScale, 1.0);
    expect(provider.confirmActions, isTrue);
    expect(provider.reduceMotion, isTrue);
    expect(provider.tremorMode, isFalse);
  });

  test('setTextSize updates the text scale', () {
    provider.setTextSize(TextSizeLevel.large);
    expect(provider.textSize, TextSizeLevel.large);
    expect(provider.textScale, 1.25);
    provider.setTextSize(TextSizeLevel.largest);
    expect(provider.textScale, 1.5);
  });

  test('tremor mode enlarges touch targets and button heights', () {
    final baseTouch = provider.minTouchTarget;
    final baseButton = provider.primaryButtonHeight;
    provider.toggleTremorMode();
    expect(provider.tremorMode, isTrue);
    expect(provider.minTouchTarget, greaterThan(baseTouch));
    expect(provider.primaryButtonHeight, greaterThan(baseButton));
    expect(provider.navItemHeight, greaterThan(0));
    expect(provider.symptomTileHeight, greaterThan(0));
  });

  test('toggles flip their respective flags', () {
    provider.toggleReduceMotion();
    expect(provider.reduceMotion, isFalse);
    provider.toggleHighContrast();
    expect(provider.highContrast, isTrue);
    provider.toggleReadAloud();
    expect(provider.readAloud, isTrue);
    provider.toggleConfirmActions();
    expect(provider.confirmActions, isFalse);
  });

  test('settings getter exposes the underlying model', () {
    expect(provider.settings, isA<AccessibilityModel>());
  });
}

import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/features/accessibility/models/accessibility_model.dart';

void main() {
  group('AccessibilityModel.textScale', () {
    test('standard size → 1.0', () {
      const model = AccessibilityModel(textSize: TextSizeLevel.standard);
      expect(model.textScale, 1.0);
    });

    test('large size → 1.25', () {
      const model = AccessibilityModel(textSize: TextSizeLevel.large);
      expect(model.textScale, 1.25);
    });

    test('largest size → 1.5', () {
      const model = AccessibilityModel(textSize: TextSizeLevel.largest);
      expect(model.textScale, 1.5);
    });
  });

  group('AccessibilityModel.minTouchTarget', () {
    test('tremorMode off → 44.0', () {
      const model = AccessibilityModel(tremorMode: false);
      expect(model.minTouchTarget, 44.0);
    });

    test('tremorMode on → 60.0', () {
      const model = AccessibilityModel(tremorMode: true);
      expect(model.minTouchTarget, 60.0);
    });
  });

  group('AccessibilityModel.primaryButtonHeight', () {
    test('tremorMode off → 64.0', () {
      const model = AccessibilityModel(tremorMode: false);
      expect(model.primaryButtonHeight, 64.0);
    });

    test('tremorMode on → 72.0', () {
      const model = AccessibilityModel(tremorMode: true);
      expect(model.primaryButtonHeight, 72.0);
    });
  });

  group('AccessibilityModel.navItemHeight', () {
    test('tremorMode off → 56.0', () {
      const model = AccessibilityModel(tremorMode: false);
      expect(model.navItemHeight, 56.0);
    });

    test('tremorMode on → 64.0', () {
      const model = AccessibilityModel(tremorMode: true);
      expect(model.navItemHeight, 64.0);
    });
  });

  group('AccessibilityModel.copyWith', () {
    test('updates tremorMode and preserves other fields', () {
      const original = AccessibilityModel(
        textSize: TextSizeLevel.large,
        tremorMode: false,
        highContrast: true,
      );
      final updated = original.copyWith(tremorMode: true);

      expect(updated.tremorMode, isTrue);
      expect(updated.textSize, TextSizeLevel.large);
      expect(updated.highContrast, isTrue);
    });

    test('copyWith with no args preserves all fields', () {
      const original = AccessibilityModel(
        textSize: TextSizeLevel.largest,
        tremorMode: true,
        readAloud: true,
      );
      final copy = original.copyWith();

      expect(copy.textSize, TextSizeLevel.largest);
      expect(copy.tremorMode, isTrue);
      expect(copy.readAloud, isTrue);
    });
  });
}

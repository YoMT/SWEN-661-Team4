export type TextSizeLevel = 'standard' | 'large' | 'largest';

export interface AccessibilitySettings {
  textSize: TextSizeLevel;
  tremorMode: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  readAloud: boolean;
  confirmActions: boolean;
}

export const defaultAccessibility: AccessibilitySettings = {
  textSize: 'standard',
  tremorMode: false,
  reduceMotion: true,
  highContrast: false,
  readAloud: false,
  confirmActions: true,
};

export function textScale(settings: AccessibilitySettings): number {
  return settings.textSize === 'largest' ? 1.5 : settings.textSize === 'large' ? 1.25 : 1.0;
}

export function minTouchTarget(settings: AccessibilitySettings): number {
  return settings.tremorMode ? 60 : 48;
}

export function primaryButtonHeight(settings: AccessibilitySettings): number {
  return settings.tremorMode ? 72 : 64;
}

export function navItemHeight(settings: AccessibilitySettings): number {
  return settings.tremorMode ? 64 : 56;
}

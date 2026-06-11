import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export const CC = {
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EBF0F6',
  primary: '#2E5C8A',
  onPrimary: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#595959',
  borderSubtle: '#E0E0E0',
  borderStrong: '#6B6B6B',
  success: '#4A7C59',
  onSuccess: '#FFFFFF',
  warning: '#D4A574',
  onWarning: '#1A1A1A',
  error: '#C85C5C',
  onError: '#FFFFFF',
} as const;

export const LANDING_BG = '#F5EFE6';
export const HEADLINE_BROWN = '#6B4522';

export function useCC() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useAccessibilityContext } = require('@/context/accessibility-context');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { settings } = useAccessibilityContext();
  return {
    ...CC,
    textMuted: settings.highContrast ? CC.text : CC.textMuted,
    borderSubtle: settings.highContrast ? CC.borderStrong : CC.borderSubtle,
  };
}

export const Typography = {
  headlineLarge: { fontSize: 24, fontWeight: '700' as const, lineHeight: 31 },
  headlineMedium: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
  titleLarge: { fontSize: 18, fontWeight: '600' as const, lineHeight: 25 },
  titleMedium: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, lineHeight: 20 },
  labelLarge: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  labelMedium: { fontSize: 14, fontWeight: '600' as const, lineHeight: 21 },
  labelSmall: { fontSize: 12, fontWeight: '500' as const, lineHeight: 18 },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

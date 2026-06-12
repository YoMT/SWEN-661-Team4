import { CC } from '@/constants/theme';
import { useAccessibilityContext } from '@/features/accessibility/accessibility-context';

export function useAccessibleColors() {
  const { settings } = useAccessibilityContext();
  return {
    ...CC,
    textMuted: settings.highContrast ? CC.text : CC.textMuted,
    borderSubtle: settings.highContrast ? CC.borderStrong : CC.borderSubtle,
  };
}

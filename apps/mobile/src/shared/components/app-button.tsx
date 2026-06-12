import React, { useRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { CC } from '@/constants/theme';
import { useAccessibilityContext } from '@/features/accessibility/accessibility-context';
import { useFS } from './cc-text';

type Variant = 'primary' | 'outline' | 'danger' | 'text';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  isLoading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export function AppButton({ label, onPress, variant = 'primary', isLoading, disabled, accessibilityLabel, style }: AppButtonProps) {
  const { buttonHeight } = useAccessibilityContext();
  const fs = useFS();
  const lastPress = useRef(0);

  function handlePress() {
    const now = Date.now();
    if (now - lastPress.current < 600) return;
    lastPress.current = now;
    onPress?.();
  }

  const bg = variant === 'primary' ? CC.primary : variant === 'danger' ? CC.error : 'transparent';
  const border = variant === 'outline' ? CC.primary : variant === 'danger' ? CC.error : 'transparent';
  const textColor = variant === 'primary' || variant === 'danger' ? '#fff' : CC.primary;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || isLoading}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      style={[
        styles.base,
        { height: buttonHeight, backgroundColor: bg, borderColor: border, borderWidth: variant === 'outline' ? 2 : 0 },
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
    >
      {isLoading
        ? <ActivityIndicator color={textColor} size="small" />
        : <Text style={[styles.label, { color: textColor, fontSize: fs(16) }]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  label: { fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.5 },
});

import React from 'react';
import { Text, TextProps } from 'react-native';
import { useAccessibilityContext } from '@/features/accessibility/accessibility-context';

interface CCTextProps extends Omit<TextProps, 'style'> {
  size: number;
  style?: TextProps['style'];
  children?: React.ReactNode;
}

export function CCText({ size, style, children, ...rest }: CCTextProps) {
  const { fontScale } = useAccessibilityContext();
  return (
    <Text style={[style, { fontSize: Math.round(size * fontScale) }]} {...rest}>
      {children}
    </Text>
  );
}

export function useFS() {
  const { fontScale } = useAccessibilityContext();
  return (base: number) => Math.round(base * fontScale);
}

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { CC } from '@/constants/theme';
import { useFS } from './cc-text';
import { useAccessibilityContext } from '@/features/accessibility/accessibility-context';

interface AppTextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  obscureToggle?: boolean;
}

export function AppTextField({ label, error, obscureToggle, secureTextEntry, style, ...rest }: AppTextFieldProps) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const fs = useFS();
  const { settings } = useAccessibilityContext();
  const borderColor = error ? CC.error : (settings.highContrast ? CC.borderStrong : CC.borderStrong);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { fontSize: fs(14) }]}>{label}</Text>
      <View style={[styles.inputRow, { borderColor }]}>
        <TextInput
          style={[styles.input, { fontSize: fs(15) }, style]}
          secureTextEntry={obscureToggle ? hidden : secureTextEntry}
          placeholderTextColor={settings.highContrast ? CC.text : CC.textMuted}
          {...rest}
        />
        {obscureToggle && (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <Text style={[styles.toggle, { fontSize: fs(18) }]}>{hidden ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[styles.error, { fontSize: fs(13) }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontWeight: '600', color: CC.text, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderRadius: 12, paddingHorizontal: 14, backgroundColor: CC.surface },
  input: { flex: 1, color: CC.text, paddingVertical: 14 },
  toggle: { paddingHorizontal: 4 },
  error: { color: CC.error, marginTop: 4 },
});

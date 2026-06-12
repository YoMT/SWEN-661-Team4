import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { CC } from '@/constants/theme';

export function LoadingIndicator({ message }: { message?: string }) {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator size={32} color={CC.primary} />
      {message && <Text style={styles.msg}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  msg: { fontSize: 14, color: CC.textMuted },
});

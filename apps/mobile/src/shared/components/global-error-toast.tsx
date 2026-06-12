import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useErrorContext } from '@/shared/context/error-context';
import { CC } from '@/constants/theme';

export function GlobalErrorToast() {
  const { errors, dismissError } = useErrorContext();
  const insets = useSafeAreaInsets();

  if (errors.length === 0) return null;

  return (
    <View style={[styles.toast, { top: insets.top + 8 }]} accessibilityLiveRegion="assertive">
      <Text style={styles.message} numberOfLines={2}>{errors[0]}</Text>
      <TouchableOpacity onPress={dismissError} style={styles.closeBtn} accessibilityLabel="Dismiss error">
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 99,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CC.error,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  message: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '500' },
  closeBtn: { marginLeft: 12, padding: 4 },
  closeText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

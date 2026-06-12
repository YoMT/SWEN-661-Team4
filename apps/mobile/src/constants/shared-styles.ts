import { StyleSheet } from 'react-native';
import { CC } from './theme';

export const shared = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CC.bg },
  screenHeader: {
    backgroundColor: CC.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: CC.borderSubtle,
  },
  screenHeaderLeft: {
    backgroundColor: CC.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: CC.borderSubtle,
  },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: CC.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CC.borderSubtle,
  },
  sectionTitle: { fontWeight: '700', color: CC.text, marginBottom: 10 },
  backBtn: { color: CC.primary },
  errorBanner: { backgroundColor: '#FEF2F2', borderRadius: 8, padding: 12, marginBottom: 16 },
  errorText: { color: CC.error },
  emptyState: { alignItems: 'center' as const, paddingTop: 60 },
});

import { useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PeggyFab } from '@/components/shared/peggy-fab';
import { CCText } from '@/components/shared/cc-text';
import { useDashboard } from '@/hooks/useDashboard';
import { CC } from '@/constants/theme';
import { shared } from '@/constants/shared-styles';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function StatTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.statTile, { borderLeftColor: color }]}>
      <CCText size={20} style={styles.statValue}>{value}</CCText>
      <CCText size={12} style={styles.statLabel}>{label}</CCText>
    </View>
  );
}

const QUICK_LINKS = [
  { label: '🆘 Emergency', route: '/(tabs)/profile/emergency' },
  { label: '📋 Report', route: '/(tabs)/profile/report' },
  { label: '⚙️ Accessibility', route: '/(tabs)/profile/accessibility' },
] as const;

export default function DashboardScreen() {
  const router = useRouter();
  const { user, careeName, isLoading, refresh, givenDoses, totalDoses, todayAppointmentsCount, logsCount, nextMed, nextAppt } = useDashboard();

  const handleMedsNav = useCallback(() => router.push('/(tabs)/medications'), [router]);
  const handleApptNav = useCallback(() => router.push('/(tabs)/appointments'), [router]);

  return (
    <SafeAreaView style={shared.safeArea}>
      <View style={styles.appBar}>
        <View style={styles.appBarLeft}>
          <View style={styles.avatar}>
            <CCText size={16} style={styles.avatarText}>{user?.name?.[0] ?? 'C'}</CCText>
          </View>
          <View>
            <CCText size={13} style={styles.greetingText}>{greeting()} · caring for</CCText>
            <CCText size={18} style={styles.careeName}>{careeName}</CCText>
          </View>
        </View>
        <TouchableOpacity accessibilityLabel="Notifications">
          <Text style={styles.notifIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={shared.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={CC.primary} />}
      >
        <View style={styles.statsRow}>
          <StatTile label="Doses today" value={`${givenDoses}/${totalDoses}`} color={CC.success} />
          <StatTile label="Appointments" value={String(todayAppointmentsCount)} color={CC.primary} />
          <StatTile label="Logs" value={String(logsCount)} color={CC.warning} />
        </View>

        {nextMed && (
          <View style={shared.card}>
            <CCText size={13} style={styles.cardTitle}>💊 Next medication</CCText>
            <CCText size={17} style={styles.cardMain}>{nextMed.name} · {nextMed.dosage}</CCText>
            <CCText size={14} style={styles.cardSub}>{nextMed.scheduledTime} · {nextMed.instruction}</CCText>
            <TouchableOpacity onPress={handleMedsNav} style={styles.cardBtn}>
              <CCText size={14} style={styles.cardBtnText}>View all medications →</CCText>
            </TouchableOpacity>
          </View>
        )}

        {nextAppt && (
          <View style={shared.card}>
            <CCText size={13} style={styles.cardTitle}>📅 Today's appointment</CCText>
            <CCText size={17} style={styles.cardMain}>{nextAppt.doctorName}</CCText>
            <CCText size={14} style={styles.cardSub}>{nextAppt.specialty} · {nextAppt.location}</CCText>
            <TouchableOpacity onPress={handleApptNav} style={styles.cardBtn}>
              <CCText size={14} style={styles.cardBtnText}>View schedule →</CCText>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.quickRow}>
          {QUICK_LINKS.map((item) => (
            <TouchableOpacity key={item.label} style={styles.quickBtn} onPress={() => router.push(item.route)}>
              <CCText size={12} style={styles.quickBtnText}>{item.label}</CCText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <PeggyFab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appBar: { backgroundColor: CC.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.24)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  greetingText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  careeName: { fontSize: 18, fontWeight: '700', color: '#fff' },
  notifIcon: { fontSize: 22, color: '#fff' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statTile: { flex: 1, backgroundColor: CC.surface, borderRadius: 12, padding: 14, borderLeftWidth: 4, borderWidth: 1, borderColor: CC.borderSubtle },
  statValue: { fontSize: 20, fontWeight: '700', color: CC.text },
  statLabel: { fontSize: 12, color: CC.textMuted, marginTop: 2 },
  cardTitle: { fontSize: 13, color: CC.textMuted, marginBottom: 6 },
  cardMain: { fontSize: 17, fontWeight: '600', color: CC.text },
  cardSub: { fontSize: 14, color: CC.textMuted, marginTop: 2 },
  cardBtn: { marginTop: 12 },
  cardBtnText: { fontSize: 14, color: CC.primary, fontWeight: '600' },
  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  quickBtn: { flex: 1, backgroundColor: CC.surface, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: CC.borderSubtle },
  quickBtnText: { fontSize: 12, color: CC.text, fontWeight: '600', textAlign: 'center' },
});

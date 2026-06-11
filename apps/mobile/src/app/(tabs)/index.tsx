import { View, Text, ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDashboardContext } from '@/context/dashboard-context';
import { useMedicationContext } from '@/context/medication-context';
import { useAppointmentContext } from '@/context/appointment-context';
import { useSymptomContext } from '@/context/symptom-context';
import { useAuthContext } from '@/context/auth-context';
import { PeggyFab } from '@/components/shared/peggy-fab';
import { CCText } from '@/components/shared/cc-text';
import { CC } from '@/constants/theme';

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

export default function DashboardScreen() {
  const router = useRouter();
  const { careeName, isLoading, refresh } = useDashboardContext();
  const { totalDoses, givenDoses, medications } = useMedicationContext();
  const { todayAppointments } = useAppointmentContext();
  const { logs } = useSymptomContext();
  const { user } = useAuthContext();

  const nextMed = medications.find((m) => m.status === 'upcoming' || m.status === 'dueNow');
  const nextAppt = todayAppointments[0];

  return (
    <SafeAreaView style={styles.safe}>
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
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={CC.primary} />}
      >
        <View style={styles.statsRow}>
          <StatTile label="Doses today" value={`${givenDoses}/${totalDoses}`} color={CC.success} />
          <StatTile label="Appointments" value={String(todayAppointments.length)} color={CC.primary} />
          <StatTile label="Logs" value={String(logs.length)} color={CC.warning} />
        </View>

        {nextMed && (
          <View style={styles.card}>
            <CCText size={13} style={styles.cardTitle}>💊 Next medication</CCText>
            <CCText size={17} style={styles.cardMain}>{nextMed.name} · {nextMed.dosage}</CCText>
            <CCText size={14} style={styles.cardSub}>{nextMed.scheduledTime} · {nextMed.instruction}</CCText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/medications')} style={styles.cardBtn}>
              <CCText size={14} style={styles.cardBtnText}>View all medications →</CCText>
            </TouchableOpacity>
          </View>
        )}

        {nextAppt && (
          <View style={styles.card}>
            <CCText size={13} style={styles.cardTitle}>📅 Today's appointment</CCText>
            <CCText size={17} style={styles.cardMain}>{nextAppt.doctorName}</CCText>
            <CCText size={14} style={styles.cardSub}>{nextAppt.specialty} · {nextAppt.location}</CCText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/appointments')} style={styles.cardBtn}>
              <CCText size={14} style={styles.cardBtnText}>View schedule →</CCText>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.quickRow}>
          {[
            { label: '🆘 Emergency', route: '/(tabs)/profile/emergency' },
            { label: '📋 Report', route: '/(tabs)/profile/report' },
            { label: '⚙️ Accessibility', route: '/(tabs)/profile/accessibility' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.quickBtn} onPress={() => router.push(item.route as any)}>
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
  safe: { flex: 1, backgroundColor: CC.bg },
  appBar: { backgroundColor: CC.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.24)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  greetingText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  careeName: { fontSize: 18, fontWeight: '700', color: '#fff' },
  notifIcon: { fontSize: 22, color: '#fff' },
  scroll: { padding: 16, gap: 0 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statTile: { flex: 1, backgroundColor: CC.surface, borderRadius: 12, padding: 14, borderLeftWidth: 4, borderWidth: 1, borderColor: CC.borderSubtle },
  statValue: { fontSize: 20, fontWeight: '700', color: CC.text },
  statLabel: { fontSize: 12, color: CC.textMuted, marginTop: 2 },
  card: { backgroundColor: CC.surface, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: CC.borderSubtle },
  cardTitle: { fontSize: 13, color: CC.textMuted, marginBottom: 6 },
  cardMain: { fontSize: 17, fontWeight: '600', color: CC.text },
  cardSub: { fontSize: 14, color: CC.textMuted, marginTop: 2 },
  cardBtn: { marginTop: 12 },
  cardBtnText: { fontSize: 14, color: CC.primary, fontWeight: '600' },
  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  quickBtn: { flex: 1, backgroundColor: CC.surface, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: CC.borderSubtle },
  quickBtnText: { fontSize: 12, color: CC.text, fontWeight: '600', textAlign: 'center' },
});

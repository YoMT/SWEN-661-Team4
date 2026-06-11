import { View, ScrollView, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppointmentContext } from '@/context/appointment-context';
import { PeggyFab } from '@/components/shared/peggy-fab';
import { CCText } from '@/components/shared/cc-text';
import { CC } from '@/constants/theme';
import type { Appointment } from '@/models/appointment';

function ApptCard({ appt, onReschedule }: { appt: Appointment; onReschedule: () => void }) {
  const isVideo = appt.type === 'video';
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>{isVideo ? '📹' : '🏥'}</Text>
        </View>
        <View style={styles.cardInfo}>
          <CCText size={16} style={styles.cardDoctor}>{appt.doctorName}</CCText>
          <CCText size={13} style={styles.cardSpecialty}>{appt.specialty}</CCText>
          <CCText size={13} style={styles.cardLocation}>{appt.location}</CCText>
          <CCText size={13} style={styles.cardTime}>{new Date(appt.dateTime).toLocaleString()}</CCText>
        </View>
      </View>
      <View style={styles.cardActions}>
        {isVideo && (
          <TouchableOpacity style={styles.joinBtn} accessibilityLabel="Join video call">
            <CCText size={14} style={styles.joinBtnText}>📹 Join video call</CCText>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onReschedule} style={styles.rescheduleBtn} accessibilityLabel="Reschedule appointment">
          <CCText size={14} style={styles.rescheduleBtnText}>Reschedule</CCText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AppointmentScreen() {
  const router = useRouter();
  const { todayAppointments, upcomingAppointments, errorMessage } = useAppointmentContext();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <CCText size={20} style={styles.title}>Appointments</CCText>
        <TouchableOpacity onPress={() => router.push('/(tabs)/appointments/new')} style={styles.addBtn} accessibilityLabel="Book appointment">
          <CCText size={14} style={styles.addBtnText}>+ Book</CCText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {errorMessage && <CCText size={14} style={styles.error}>{errorMessage}</CCText>}

        {todayAppointments.length > 0 && (
          <>
            <CCText size={16} style={styles.sectionTitle}>Today</CCText>
            {todayAppointments.map((a) => (
              <ApptCard key={a.id} appt={a} onReschedule={() => router.push('/(tabs)/appointments/reschedule')} />
            ))}
          </>
        )}

        {upcomingAppointments.length > 0 && (
          <>
            <CCText size={16} style={styles.sectionTitle}>Upcoming</CCText>
            {upcomingAppointments.map((a) => (
              <ApptCard key={a.id} appt={a} onReschedule={() => router.push('/(tabs)/appointments/reschedule')} />
            ))}
          </>
        )}

        {todayAppointments.length === 0 && upcomingAppointments.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📅</Text>
            <CCText size={15} style={styles.emptyText}>No appointments scheduled</CCText>
          </View>
        )}
      </ScrollView>

      <PeggyFab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CC.bg },
  header: { backgroundColor: CC.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: CC.borderSubtle },
  title: { fontSize: 20, fontWeight: '700', color: CC.text },
  addBtn: { backgroundColor: CC.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  scroll: { padding: 16 },
  error: { color: CC.error, fontSize: 14, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: CC.text, marginBottom: 10 },
  card: { backgroundColor: CC.surface, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: CC.borderSubtle },
  cardRow: { flexDirection: 'row', gap: 12 },
  cardIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: CC.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  cardIconText: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardDoctor: { fontSize: 16, fontWeight: '600', color: CC.text },
  cardSpecialty: { fontSize: 13, color: CC.textMuted },
  cardLocation: { fontSize: 13, color: CC.textMuted },
  cardTime: { fontSize: 13, color: CC.primary, marginTop: 4 },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  joinBtn: { flex: 1, backgroundColor: CC.primary, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  joinBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  rescheduleBtn: { flex: 1, borderWidth: 1.5, borderColor: CC.primary, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  rescheduleBtnText: { color: CC.primary, fontWeight: '600', fontSize: 14 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: CC.textMuted },
});

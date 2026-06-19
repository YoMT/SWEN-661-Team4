import { useCallback, useMemo, memo } from 'react';
import { View, SectionList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppointmentContext } from '@/features/appointments/appointment-context';
import { PeggyFab } from '@/features/ai-assistant/components/peggy-fab';
import { CCText } from '@/shared/components/cc-text';
import { CC } from '@/constants/theme';
import { shared } from '@/constants/shared-styles';
import type { Appointment } from '@/features/appointments/appointment';

const ApptCard = memo(function ApptCard({ appt, onReschedule }: { appt: Appointment; onReschedule: () => void }) {
  const isVideo = appt.type === 'video';
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText} accessible={false}>{isVideo ? '📹' : '🏥'}</Text>
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
          <TouchableOpacity style={styles.joinBtn} accessibilityLabel="Join video call" accessibilityRole="button">
            <CCText size={14} style={styles.joinBtnText}>📹 Join video call</CCText>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onReschedule} style={styles.rescheduleBtn} accessibilityLabel="Reschedule appointment" accessibilityRole="button">
          <CCText size={14} style={styles.rescheduleBtnText}>Reschedule</CCText>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function AppointmentScreen() {
  const router = useRouter();
  const { todayAppointments, upcomingAppointments } = useAppointmentContext();

  const handleBook = useCallback(() => router.push('/(tabs)/appointments/new'), [router]);
  const handleReschedule = useCallback(() => router.push('/(tabs)/appointments/reschedule'), [router]);

  const sections = useMemo(() => {
    const result = [];
    if (todayAppointments.length > 0) result.push({ title: 'Today', data: todayAppointments });
    if (upcomingAppointments.length > 0) result.push({ title: 'Upcoming', data: upcomingAppointments });
    return result;
  }, [todayAppointments, upcomingAppointments]);

  const renderItem = useCallback(
    ({ item }: { item: Appointment }) => <ApptCard appt={item} onReschedule={handleReschedule} />,
    [handleReschedule],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => (
      <CCText size={16} style={styles.sectionTitle}>{section.title}</CCText>
    ),
    [],
  );

  return (
    <SafeAreaView style={shared.safeArea}>
      <View style={shared.screenHeader}>
        <CCText size={20} style={styles.title}>Appointments</CCText>
        <TouchableOpacity onPress={handleBook} style={styles.addBtn} accessibilityLabel="Book appointment" accessibilityRole="button">
          <CCText size={14} style={styles.addBtnText}>+ Book</CCText>
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={[shared.scrollContent, sections.length === 0 && styles.emptyContainer]}
        ListEmptyComponent={
          <View style={shared.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <CCText size={15} style={styles.emptyText}>No appointments scheduled</CCText>
          </View>
        }
        stickySectionHeadersEnabled={false}
        removeClippedSubviews
      />

      <PeggyFab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700', color: CC.text },
  addBtn: { backgroundColor: CC.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: CC.text, marginBottom: 10, marginTop: 4 },
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
  emptyContainer: { flexGrow: 1 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: CC.textMuted },
});

import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMedicationContext } from '@/context/medication-context';
import { PeggyFab } from '@/components/shared/peggy-fab';
import { CCText } from '@/components/shared/cc-text';
import { CC } from '@/constants/theme';
import type { DoseTimeSlot, Medication } from '@/models/medication';

const SLOTS: { slot: DoseTimeSlot; label: string; emoji: string }[] = [
  { slot: 'morning', label: 'Morning', emoji: '🌅' },
  { slot: 'afternoon', label: 'Afternoon', emoji: '☀️' },
  { slot: 'evening', label: 'Evening', emoji: '🌆' },
  { slot: 'night', label: 'Night', emoji: '🌙' },
];

const STATUS_COLOR: Record<string, string> = {
  upcoming: CC.textMuted,
  dueNow: CC.warning,
  given: CC.success,
  missed: CC.error,
};

function MedCard({ med, onTake }: { med: Medication; onTake: () => void }) {
  return (
    <View style={styles.medCard}>
      <View style={styles.medInfo}>
        <CCText size={16} style={styles.medName}>{med.name}</CCText>
        <CCText size={13} style={styles.medDosage}>{med.dosage} · {med.instruction}</CCText>
        <CCText size={13} style={styles.medTime}>{med.scheduledTime}</CCText>
      </View>
      <View style={styles.medRight}>
        <CCText size={12} style={[styles.medStatus, { color: STATUS_COLOR[med.status] }]}>{med.status}</CCText>
        {med.status !== 'given' && (
          <TouchableOpacity onPress={onTake} style={styles.takeBtn} accessibilityLabel={`Mark ${med.name} as taken`}>
            <CCText size={13} style={styles.takeBtnText}>✓ Taken</CCText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function MedicationListScreen() {
  const router = useRouter();
  const { byTimeSlot, givenDoses, totalDoses, markTaken, errorMessage } = useMedicationContext();

  const adherence = totalDoses > 0 ? Math.round((givenDoses / totalDoses) * 100) : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <CCText size={20} style={styles.title}>Medications</CCText>
        <TouchableOpacity onPress={() => router.push('/(tabs)/medications/new')} style={styles.addBtn} accessibilityLabel="Add medication">
          <CCText size={14} style={styles.addBtnText}>+ Add</CCText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {errorMessage && <CCText size={14} style={styles.error}>{errorMessage}</CCText>}

        <View style={styles.progressCard}>
          <CCText size={13} style={styles.progressLabel}>Today's adherence</CCText>
          <CCText size={18} style={styles.progressValue}>{givenDoses}/{totalDoses} doses · {adherence}%</CCText>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${adherence}%` }]} />
          </View>
        </View>

        {SLOTS.map(({ slot, label, emoji }) => {
          const meds = byTimeSlot(slot);
          if (meds.length === 0) return null;
          return (
            <View key={slot} style={styles.slotSection}>
              <CCText size={16} style={styles.slotTitle}>{emoji} {label}</CCText>
              {meds.map((m) => <MedCard key={m.id} med={m} onTake={() => markTaken(m.id)} />)}
            </View>
          );
        })}
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
  progressCard: { backgroundColor: CC.surface, borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: CC.borderSubtle },
  progressLabel: { fontSize: 13, color: CC.textMuted },
  progressValue: { fontSize: 18, fontWeight: '700', color: CC.text, marginVertical: 4 },
  progressBar: { height: 8, backgroundColor: CC.borderSubtle, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: CC.success, borderRadius: 4 },
  slotSection: { marginBottom: 20 },
  slotTitle: { fontSize: 16, fontWeight: '600', color: CC.text, marginBottom: 10 },
  medCard: { flexDirection: 'row', backgroundColor: CC.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: CC.borderSubtle },
  medInfo: { flex: 1 },
  medName: { fontSize: 16, fontWeight: '600', color: CC.text },
  medDosage: { fontSize: 13, color: CC.textMuted, marginTop: 2 },
  medTime: { fontSize: 13, color: CC.textMuted },
  medRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  medStatus: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  takeBtn: { marginTop: 8, backgroundColor: CC.success, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  takeBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});

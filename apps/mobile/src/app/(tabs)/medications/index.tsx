import { useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMedicationContext } from '@/features/medications/medication-context';
import { PeggyFab } from '@/features/ai-assistant/components/peggy-fab';
import { MedCard } from '@/features/medications/components/med-card';
import { CCText } from '@/shared/components/cc-text';
import { CC } from '@/constants/theme';
import { shared } from '@/constants/shared-styles';
import type { DoseTimeSlot } from '@/features/medications/medication';

const SLOTS: { slot: DoseTimeSlot; label: string; emoji: string }[] = [
  { slot: 'morning', label: 'Morning', emoji: '🌅' },
  { slot: 'afternoon', label: 'Afternoon', emoji: '☀️' },
  { slot: 'evening', label: 'Evening', emoji: '🌆' },
  { slot: 'night', label: 'Night', emoji: '🌙' },
];

export default function MedicationListScreen() {
  const router = useRouter();
  const { byTimeSlot, givenDoses, totalDoses, markTaken } = useMedicationContext();

  const adherence = totalDoses > 0 ? Math.round((givenDoses / totalDoses) * 100) : 0;

  const handleAdd = useCallback(() => router.push('/(tabs)/medications/new'), [router]);

  return (
    <SafeAreaView style={shared.safeArea}>
      <View style={shared.screenHeader}>
        <CCText size={20} style={styles.title}>Medications</CCText>
        <TouchableOpacity onPress={handleAdd} style={styles.addBtn} accessibilityLabel="Add medication">
          <CCText size={14} style={styles.addBtnText}>+ Add</CCText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={shared.scrollContent}>
        <View style={[shared.card, styles.progressCard]}>
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
              {meds.map((m) => (
                <MedCard key={m.id} med={m} onTake={() => markTaken(m.id)} />
              ))}
            </View>
          );
        })}
      </ScrollView>

      <PeggyFab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700', color: CC.text },
  addBtn: { backgroundColor: CC.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  progressCard: { marginBottom: 20 },
  progressLabel: { fontSize: 13, color: CC.textMuted },
  progressValue: { fontSize: 18, fontWeight: '700', color: CC.text, marginVertical: 4 },
  progressBar: { height: 8, backgroundColor: CC.borderSubtle, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: CC.success, borderRadius: 4 },
  slotSection: { marginBottom: 20 },
  slotTitle: { fontSize: 16, fontWeight: '600', color: CC.text, marginBottom: 10 },
});

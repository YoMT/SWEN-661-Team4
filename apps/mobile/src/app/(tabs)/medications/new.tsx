import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTextField } from '@/shared/components/app-text-field';
import { AppButton } from '@/shared/components/app-button';
import { CCText } from '@/shared/components/cc-text';
import { useMedicationContext } from '@/features/medications/medication-context';
import { CC } from '@/constants/theme';
import type { DoseTimeSlot } from '@/features/medications/medication';

const SLOTS: DoseTimeSlot[] = ['morning', 'afternoon', 'evening', 'night'];

export default function MedicationFormScreen() {
  const router = useRouter();
  const { addMedication } = useMedicationContext();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [instruction, setInstruction] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [timeSlot, setTimeSlot] = useState<DoseTimeSlot>('morning');
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    if (!name.trim()) { setError('Medication name is required.'); return; }
    if (!dosage.trim()) { setError('Dosage is required.'); return; }
    setError(null);
    addMedication({ name, dosage, instruction: instruction || 'Take as directed', scheduledTime: scheduledTime || '8:00 AM', timeSlot, status: 'upcoming', notes: undefined });
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <CCText size={16} style={styles.back}>← Back</CCText>
        </TouchableOpacity>
        <CCText size={18} style={styles.title}>Add Medication</CCText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {error && <CCText size={14} style={styles.error}>{error}</CCText>}

        <AppTextField label="Medication name" placeholder="e.g. Levodopa" value={name} onChangeText={setName} />
        <AppTextField label="Dosage" placeholder="e.g. 100mg" value={dosage} onChangeText={setDosage} />
        <AppTextField label="Instructions" placeholder="e.g. Take with food" value={instruction} onChangeText={setInstruction} />
        <AppTextField label="Scheduled time" placeholder="e.g. 8:00 AM" value={scheduledTime} onChangeText={setScheduledTime} />

        <CCText size={14} style={styles.slotLabel}>Time of day</CCText>
        <View style={styles.slotRow}>
          {SLOTS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.slotBtn, timeSlot === s && styles.slotBtnActive]}
              onPress={() => setTimeSlot(s)}
              accessibilityLabel={s}
              accessibilityRole="radio"
              accessibilityState={{ checked: timeSlot === s }}
            >
              <CCText size={13} style={[styles.slotBtnText, timeSlot === s && styles.slotBtnTextActive]}>{s}</CCText>
            </TouchableOpacity>
          ))}
        </View>

        <AppButton label="Save Medication" onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CC.bg },
  header: { backgroundColor: CC.surface, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: CC.borderSubtle },
  back: { color: CC.primary, fontSize: 16 },
  title: { fontSize: 18, fontWeight: '700', color: CC.text },
  scroll: { padding: 16 },
  error: { color: CC.error, fontSize: 14, marginBottom: 12 },
  slotLabel: { fontSize: 14, fontWeight: '600', color: CC.text, marginBottom: 8 },
  slotRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  slotBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1.5, borderColor: CC.borderSubtle, alignItems: 'center' },
  slotBtnActive: { borderColor: CC.primary, backgroundColor: CC.surfaceAlt },
  slotBtnText: { fontSize: 13, color: CC.textMuted, textTransform: 'capitalize' },
  slotBtnTextActive: { color: CC.primary, fontWeight: '600' },
});

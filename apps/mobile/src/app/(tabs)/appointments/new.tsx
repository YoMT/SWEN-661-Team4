import { useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTextField } from '@/shared/components/app-text-field';
import { AppButton } from '@/shared/components/app-button';
import { CCText } from '@/shared/components/cc-text';
import { useAppointmentContext } from '@/features/appointments/appointment-context';
import { CC } from '@/constants/theme';
import type { AppointmentType } from '@/features/appointments/appointment';

export default function NewAppointmentScreen() {
  const router = useRouter();
  const { addAppointment } = useAppointmentContext();
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [type, setType] = useState<AppointmentType>('inPerson');
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    if (!doctorName.trim()) { setError('Doctor name is required.'); return; }
    if (!dateTime.trim()) { setError('Date and time are required.'); return; }
    setError(null);
    addAppointment({ doctorName, specialty: specialty || 'General', location: location || 'TBD', dateTime: new Date(dateTime).toISOString(), type, status: 'upcoming', notes: undefined });
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <CCText size={16} style={styles.back}>← Back</CCText>
        </TouchableOpacity>
        <CCText size={18} style={styles.title}>Book Appointment</CCText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {error && <CCText size={14} style={styles.error}>{error}</CCText>}
        <AppTextField label="Doctor name" placeholder="e.g. Dr. Sarah Chen" value={doctorName} onChangeText={setDoctorName} />
        <AppTextField label="Specialty" placeholder="e.g. Neurology" value={specialty} onChangeText={setSpecialty} />
        <AppTextField label="Location" placeholder="e.g. City Medical Center" value={location} onChangeText={setLocation} />
        <AppTextField label="Date & time" placeholder="e.g. 2026-06-15 10:00 AM" value={dateTime} onChangeText={setDateTime} />

        <CCText size={14} style={styles.typeLabel}>Appointment type</CCText>
        <View style={styles.typeRow}>
          {(['inPerson', 'video'] as AppointmentType[]).map((t) => (
            <TouchableOpacity key={t} style={[styles.typeBtn, type === t && styles.typeBtnActive]} onPress={() => setType(t)}>
              <CCText size={14} style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>{t === 'inPerson' ? '🏥 In person' : '📹 Video'}</CCText>
            </TouchableOpacity>
          ))}
        </View>

        <AppButton label="Book Appointment" onPress={handleSave} />
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
  typeLabel: { fontSize: 14, fontWeight: '600', color: CC.text, marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1.5, borderColor: CC.borderSubtle, alignItems: 'center' },
  typeBtnActive: { borderColor: CC.primary, backgroundColor: CC.surfaceAlt },
  typeBtnText: { fontSize: 14, color: CC.textMuted },
  typeBtnTextActive: { color: CC.primary, fontWeight: '600' },
});

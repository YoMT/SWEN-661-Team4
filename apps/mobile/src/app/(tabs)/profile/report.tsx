import { View, ScrollView, TouchableOpacity, Alert, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMedicationContext } from '@/features/medications/medication-context';
import { useAppointmentContext } from '@/features/appointments/appointment-context';
import { useSymptomContext } from '@/features/symptoms/symptom-context';
import { PeggyFab } from '@/features/ai-assistant/components/peggy-fab';
import { CCText } from '@/shared/components/cc-text';
import { useAccessibilityContext } from '@/features/accessibility/accessibility-context';
import { CC } from '@/constants/theme';
import { adherenceRate } from '@/features/profile/care-report';

function ReportRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.reportRow}>
      <Text style={styles.rowIcon} accessible={false}>{icon}</Text>
      <View style={styles.rowInfo}>
        <CCText size={14} style={styles.rowLabel}>{label}</CCText>
        <CCText size={16} style={styles.rowValue}>{value}</CCText>
      </View>
    </View>
  );
}

export default function ProviderReportScreen() {
  const router = useRouter();
  const { touchTarget } = useAccessibilityContext();
  const { totalDoses, givenDoses, medications } = useMedicationContext();
  const { appointments } = useAppointmentContext();
  const { logs } = useSymptomContext();

  const missedDoses = medications.filter((m) => m.status === 'missed').length;
  const report = { patientName: 'Gloria Washington', totalDoses, takenDoses: givenDoses, missedDoses, symptomSummary: logs.length > 0 ? `${logs.length} symptom(s) logged` : 'No symptoms logged', nextAppointment: appointments[0] ? `${appointments[0].doctorName} – ${new Date(appointments[0].dateTime).toLocaleDateString()}` : 'None scheduled' };
  const rate = adherenceRate(report);

  function handleShare() {
    Alert.alert('Share Report', 'Do you want to share this report with the care team?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: () => Alert.alert('Shared', 'Report shared with care team.') },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" accessibilityRole="button" style={{ minHeight: touchTarget, justifyContent: 'center' }}>
          <CCText size={16} style={styles.back}>← Back</CCText>
        </TouchableOpacity>
        <CCText size={18} style={styles.title}>Provider Report</CCText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <CCText size={20} style={styles.patientName}>Care Report for {report.patientName}</CCText>

        <View style={styles.card}>
          <ReportRow icon="💊" label="Medication adherence" value={`${rate.toFixed(1)}%`} />
          <ReportRow icon="✅" label="Doses taken" value={`${report.takenDoses} of ${report.totalDoses}`} />
          <ReportRow icon="⚠️" label="Missed doses" value={String(report.missedDoses)} />
          <ReportRow icon="❤️" label="Symptom summary" value={report.symptomSummary} />
          <ReportRow icon="📅" label="Next appointment" value={report.nextAppointment} />
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} accessibilityLabel="Share with care team" accessibilityRole="button">
          <CCText size={16} style={styles.shareBtnText}>📤  Share with Care Team</CCText>
        </TouchableOpacity>
      </ScrollView>

      <PeggyFab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CC.bg },
  header: { backgroundColor: CC.surface, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: CC.borderSubtle },
  back: { color: CC.primary, fontSize: 16 },
  title: { fontSize: 18, fontWeight: '700', color: CC.text },
  scroll: { padding: 16 },
  patientName: { fontSize: 20, fontWeight: '700', color: CC.text, marginBottom: 16 },
  card: { backgroundColor: CC.surface, borderRadius: 12, borderWidth: 1, borderColor: CC.borderSubtle, marginBottom: 20, overflow: 'hidden' },
  reportRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: CC.borderSubtle, gap: 12 },
  rowIcon: { fontSize: 24 },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 14, color: CC.textMuted },
  rowValue: { fontSize: 16, fontWeight: '600', color: CC.text, marginTop: 2 },
  shareBtn: { backgroundColor: CC.primary, borderRadius: 12, paddingVertical: 18, alignItems: 'center' },
  shareBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

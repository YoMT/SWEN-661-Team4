import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSymptomContext } from '@/context/symptom-context';
import { useAccessibilityContext } from '@/context/accessibility-context';
import { PeggyFab } from '@/components/shared/peggy-fab';
import { AppButton } from '@/components/shared/app-button';
import { CCText, useFS } from '@/components/shared/cc-text';
import type { SymptomType } from '@/models/symptom-log';
import { CC } from '@/constants/theme';

const SYMPTOMS: { type: SymptomType; label: string; emoji: string }[] = [
  { type: 'pain', label: 'Pain', emoji: '😣' },
  { type: 'dizzy', label: 'Dizzy', emoji: '😵' },
  { type: 'breath', label: 'Breath', emoji: '😮‍💨' },
  { type: 'tired', label: 'Tired', emoji: '😴' },
  { type: 'nausea', label: 'Nausea', emoji: '🤢' },
  { type: 'other', label: 'Other', emoji: '❓' },
];

export default function SymptomLogScreen() {
  const { logs, addLog, errorMessage } = useSymptomContext();
  const { touchTarget } = useAccessibilityContext();
  const fs = useFS();
  const [selected, setSelected] = useState<SymptomType | null>(null);
  const [severity, setSeverity] = useState(5);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const dotSize = Math.max(touchTarget * 0.55, 26);

  function handleSave() {
    if (!selected) return;
    addLog({ symptom: selected, severity, note: note.trim() || undefined });
    setSelected(null);
    setSeverity(5);
    setNote('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><CCText size={20} style={styles.title}>Log a symptom</CCText></View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {errorMessage && <CCText size={14} style={styles.error}>{errorMessage}</CCText>}
        {saved && <View style={styles.savedBanner}><CCText size={14} style={styles.savedText}>✓ Symptom logged</CCText></View>}

        <CCText size={15} style={styles.sectionLabel}>What are you experiencing?</CCText>
        <View style={styles.symptomsGrid}>
          {SYMPTOMS.map((s) => (
            <TouchableOpacity
              key={s.type}
              style={[styles.symptomBtn, { minHeight: Math.max(touchTarget, 72) }, selected === s.type && styles.symptomBtnActive]}
              onPress={() => setSelected(s.type)}
              accessibilityLabel={s.label}
              accessibilityRole="button"
              accessibilityState={{ selected: selected === s.type }}
            >
              <Text style={styles.symptomEmoji}>{s.emoji}</Text>
              <CCText size={12} style={[styles.symptomLabel, selected === s.type && styles.symptomLabelActive]}>{s.label}</CCText>
            </TouchableOpacity>
          ))}
        </View>

        <CCText size={15} style={styles.sectionLabel}>Severity: {severity}/10</CCText>
        <View style={styles.severityRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => setSeverity(n)}
              style={[styles.severityDot, { width: dotSize, height: dotSize, borderRadius: dotSize / 2 }, n <= severity && styles.severityDotFilled]}
              accessibilityLabel={`Severity ${n}`}
            />
          ))}
        </View>

        <CCText size={15} style={styles.sectionLabel}>Note (optional)</CCText>
        <TextInput
          style={[styles.noteInput, { fontSize: fs(15) }]}
          placeholder="Describe what you're feeling…"
          placeholderTextColor={CC.textMuted}
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
        />

        <AppButton label="Save Log" onPress={handleSave} disabled={!selected} />

        {logs.length > 0 && (
          <>
            <CCText size={15} style={[styles.sectionLabel, { marginTop: 24 }]}>Recent entries</CCText>
            {logs.slice(0, 5).map((log) => (
              <View key={log.id} style={styles.logEntry}>
                <CCText size={15} style={styles.logSymptom}>{SYMPTOMS.find((s) => s.type === log.symptom)?.emoji} {log.symptom}</CCText>
                <CCText size={13} style={styles.logSeverity}>Severity {log.severity}/10</CCText>
                {log.note && <CCText size={13} style={styles.logNote}>{log.note}</CCText>}
                <CCText size={12} style={styles.logDate}>{new Date(log.createdAt).toLocaleString()}</CCText>
              </View>
            ))}
          </>
        )}
      </ScrollView>
      <PeggyFab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CC.bg },
  header: { backgroundColor: CC.surface, padding: 16, borderBottomWidth: 1, borderBottomColor: CC.borderSubtle },
  title: { fontSize: 20, fontWeight: '700', color: CC.text },
  scroll: { padding: 16 },
  error: { color: CC.error, fontSize: 14, marginBottom: 12 },
  savedBanner: { backgroundColor: '#EDF7EE', borderRadius: 8, padding: 12, marginBottom: 12 },
  savedText: { color: CC.success, fontWeight: '600' },
  sectionLabel: { fontSize: 15, fontWeight: '600', color: CC.text, marginBottom: 10, marginTop: 4 },
  symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  symptomBtn: { width: '30%', aspectRatio: 1, backgroundColor: CC.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: CC.borderSubtle },
  symptomBtnActive: { borderColor: CC.primary, backgroundColor: CC.surfaceAlt },
  symptomEmoji: { fontSize: 28 },
  symptomLabel: { fontSize: 12, color: CC.textMuted, marginTop: 4 },
  symptomLabelActive: { color: CC.primary, fontWeight: '600' },
  severityRow: { flexDirection: 'row', gap: 6, marginBottom: 20, flexWrap: 'wrap' },
  severityDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: CC.borderSubtle },
  severityDotFilled: { backgroundColor: CC.primary },
  noteInput: { borderWidth: 2, borderColor: CC.borderStrong, borderRadius: 12, padding: 14, fontSize: 15, color: CC.text, marginBottom: 20, textAlignVertical: 'top', minHeight: 80 },
  logEntry: { backgroundColor: CC.surface, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: CC.borderSubtle },
  logSymptom: { fontSize: 15, fontWeight: '600', color: CC.text },
  logSeverity: { fontSize: 13, color: CC.textMuted },
  logNote: { fontSize: 13, color: CC.text, marginTop: 4 },
  logDate: { fontSize: 12, color: CC.textMuted, marginTop: 6 },
});

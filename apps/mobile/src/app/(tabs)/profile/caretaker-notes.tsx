import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCaretakerContext } from '@/context/caretaker-context';
import { useMedicationContext } from '@/context/medication-context';
import { useSymptomContext } from '@/context/symptom-context';
import { useAppointmentContext } from '@/context/appointment-context';
import { PeggyFab } from '@/components/shared/peggy-fab';
import { CCText, useFS } from '@/components/shared/cc-text';
import { CC } from '@/constants/theme';

export default function CaretakerNotesScreen() {
  const router = useRouter();
  const { notes, addReply } = useCaretakerContext();
  const { givenDoses, totalDoses } = useMedicationContext();
  const { logs } = useSymptomContext();
  const { appointments } = useAppointmentContext();
  const fs = useFS();
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const adherence = totalDoses > 0 ? Math.round((givenDoses / totalDoses) * 100) : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <CCText size={16} style={styles.back}>← Back</CCText>
        </TouchableOpacity>
        <CCText size={18} style={styles.title}>Caretaker Notes</CCText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.summaryRow}>
          <View style={[styles.statPill, { borderLeftColor: CC.success }]}>
            <CCText size={20} style={styles.statVal}>{adherence}%</CCText>
            <CCText size={12} style={styles.statKey}>Adherence</CCText>
          </View>
          <View style={[styles.statPill, { borderLeftColor: CC.warning }]}>
            <CCText size={20} style={styles.statVal}>{logs.length}</CCText>
            <CCText size={12} style={styles.statKey}>Symptoms</CCText>
          </View>
          <View style={[styles.statPill, { borderLeftColor: CC.primary }]}>
            <CCText size={20} style={styles.statVal}>{appointments.length}</CCText>
            <CCText size={12} style={styles.statKey}>Appointments</CCText>
          </View>
        </View>

        <CCText size={16} style={styles.sectionTitle}>Notes from care team</CCText>
        {notes.map((note) => (
          <View key={note.id} style={styles.noteCard}>
            <CCText size={14} style={styles.noteAuthor}>{note.authorName}</CCText>
            <CCText size={15} style={styles.noteContent}>{note.content}</CCText>
            <CCText size={12} style={styles.noteDate}>{new Date(note.createdAt).toLocaleDateString()}</CCText>
            {note.replyContent && (
              <View style={styles.reply}>
                <CCText size={12} style={styles.replyLabel}>Your reply:</CCText>
                <CCText size={14} style={styles.replyText}>{note.replyContent}</CCText>
              </View>
            )}
            {!note.replyContent && (
              <View style={styles.replyInput}>
                <TextInput
                  style={[styles.replyField, { fontSize: fs(14) }]}
                  placeholder="Add a reply…"
                  placeholderTextColor={CC.textMuted}
                  value={replyText[note.id] ?? ''}
                  onChangeText={(t) => setReplyText((prev) => ({ ...prev, [note.id]: t }))}
                />
                <TouchableOpacity
                  onPress={() => { addReply(note.id, replyText[note.id] ?? ''); setReplyText((prev) => ({ ...prev, [note.id]: '' })); }}
                  style={styles.replyBtn}
                  accessibilityLabel="Submit reply"
                >
                  <CCText size={14} style={styles.replyBtnText}>Reply</CCText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
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
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statPill: { flex: 1, backgroundColor: CC.surface, borderRadius: 10, padding: 12, borderLeftWidth: 4, borderWidth: 1, borderColor: CC.borderSubtle },
  statVal: { fontSize: 20, fontWeight: '700', color: CC.text },
  statKey: { fontSize: 12, color: CC.textMuted },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: CC.text, marginBottom: 10 },
  noteCard: { backgroundColor: CC.surface, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: CC.borderSubtle },
  noteAuthor: { fontSize: 14, fontWeight: '600', color: CC.primary },
  noteContent: { fontSize: 15, color: CC.text, marginTop: 6, lineHeight: 22 },
  noteDate: { fontSize: 12, color: CC.textMuted, marginTop: 6 },
  reply: { marginTop: 12, backgroundColor: CC.surfaceAlt, borderRadius: 8, padding: 10 },
  replyLabel: { fontSize: 12, color: CC.textMuted },
  replyText: { fontSize: 14, color: CC.text, marginTop: 2 },
  replyInput: { marginTop: 12, flexDirection: 'row', gap: 8 },
  replyField: { flex: 1, borderWidth: 1.5, borderColor: CC.borderStrong, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 14, color: CC.text },
  replyBtn: { backgroundColor: CC.primary, borderRadius: 8, paddingHorizontal: 14, justifyContent: 'center' },
  replyBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});

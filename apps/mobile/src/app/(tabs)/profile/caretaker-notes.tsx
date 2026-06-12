import { useState, useCallback, useMemo, memo } from 'react';
import { View, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCaretakerContext } from '@/features/caretaker/caretaker-context';
import { useMedicationContext } from '@/features/medications/medication-context';
import { useSymptomContext } from '@/features/symptoms/symptom-context';
import { useAppointmentContext } from '@/features/appointments/appointment-context';
import { PeggyFab } from '@/features/ai-assistant/components/peggy-fab';
import { CCText, useFS } from '@/shared/components/cc-text';
import { CC } from '@/constants/theme';
import { shared } from '@/constants/shared-styles';
import type { CaretakerNote } from '@/features/caretaker/caretaker-note';

const NoteCard = memo(function NoteCard({
  note,
  replyValue,
  onChangeReply,
  onSubmitReply,
}: {
  note: CaretakerNote;
  replyValue: string;
  onChangeReply: (id: string, text: string) => void;
  onSubmitReply: (id: string) => void;
}) {
  const fs = useFS();
  return (
    <View style={styles.noteCard}>
      <CCText size={14} style={styles.noteAuthor}>{note.authorName}</CCText>
      <CCText size={15} style={styles.noteContent}>{note.content}</CCText>
      <CCText size={12} style={styles.noteDate}>{new Date(note.createdAt).toLocaleDateString()}</CCText>
      {note.replyContent ? (
        <View style={styles.reply}>
          <CCText size={12} style={styles.replyLabel}>Your reply:</CCText>
          <CCText size={14} style={styles.replyText}>{note.replyContent}</CCText>
        </View>
      ) : (
        <View style={styles.replyInput}>
          <TextInput
            style={[styles.replyField, { fontSize: fs(14) }]}
            placeholder="Add a reply…"
            placeholderTextColor={CC.textMuted}
            value={replyValue}
            onChangeText={(t) => onChangeReply(note.id, t)}
            accessibilityLabel="Reply to note"
          />
          <TouchableOpacity
            onPress={() => onSubmitReply(note.id)}
            style={styles.replyBtn}
            accessibilityLabel="Submit reply"
          >
            <CCText size={14} style={styles.replyBtnText}>Reply</CCText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

export default function CaretakerNotesScreen() {
  const router = useRouter();
  const { notes, addReply } = useCaretakerContext();
  const { givenDoses, totalDoses } = useMedicationContext();
  const { logs } = useSymptomContext();
  const { appointments } = useAppointmentContext();
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const adherence = totalDoses > 0 ? Math.round((givenDoses / totalDoses) * 100) : 0;

  const handleChangeReply = useCallback((id: string, text: string) => {
    setReplyText((prev) => ({ ...prev, [id]: text }));
  }, []);

  const handleSubmitReply = useCallback((id: string) => {
    addReply(id, replyText[id] ?? '');
    setReplyText((prev) => ({ ...prev, [id]: '' }));
  }, [replyText, addReply]);

  const renderItem = useCallback(
    ({ item }: { item: CaretakerNote }) => (
      <NoteCard
        note={item}
        replyValue={replyText[item.id] ?? ''}
        onChangeReply={handleChangeReply}
        onSubmitReply={handleSubmitReply}
      />
    ),
    [replyText, handleChangeReply, handleSubmitReply],
  );

  const ListHeader = useMemo(() => (
    <>
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
    </>
  ), [adherence, logs.length, appointments.length]);

  return (
    <SafeAreaView style={shared.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <CCText size={16} style={styles.back}>← Back</CCText>
        </TouchableOpacity>
        <CCText size={18} style={styles.title}>Caretaker Notes</CCText>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={shared.scrollContent}
        removeClippedSubviews
      />

      <PeggyFab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: CC.surface, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: CC.borderSubtle },
  back: { color: CC.primary, fontSize: 16 },
  title: { fontSize: 18, fontWeight: '700', color: CC.text },
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

import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CCText } from '@/shared/components/cc-text';
import { CC } from '@/constants/theme';
import type { Medication } from '@/features/medications/medication';

function fmtTime(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

const STATUS_COLOR: Record<string, string> = {
  upcoming: CC.textMuted,
  dueNow: CC.warning,
  given: CC.success,
  missed: CC.error,
};

interface MedCardProps {
  med: Medication;
  onTake: () => void;
}

export const MedCard = memo(function MedCard({ med, onTake }: MedCardProps) {
  return (
    <View style={styles.medCard}>
      <View style={styles.medInfo}>
        <CCText size={16} style={styles.medName}>{med.name}</CCText>
        <CCText size={13} style={styles.medDosage}>{med.dosage} · {med.instruction}</CCText>
        <CCText size={13} style={styles.medTime}>{fmtTime(med.scheduledTime)}</CCText>
      </View>
      <View style={styles.medRight}>
        <CCText size={12} style={[styles.medStatus, { color: STATUS_COLOR[med.status] ?? CC.textMuted }]}>
          {med.status}
        </CCText>
        {med.status !== 'given' && (
          <TouchableOpacity
            onPress={onTake}
            style={styles.takeBtn}
            accessibilityLabel={`Mark ${med.name} as taken`}
            accessibilityRole="button"
          >
            <CCText size={13} style={styles.takeBtnText}>✓ Taken</CCText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
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

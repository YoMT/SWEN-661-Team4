import { useState, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEmergencyContext } from '@/features/emergency/emergency-context';
import { useAccessibilityContext } from '@/features/accessibility/accessibility-context';
import { CCText, useFS } from '@/shared/components/cc-text';
import { getInitials } from '@/features/emergency/emergency-contact';
import { CC } from '@/constants/theme';

export default function EmergencyContactScreen() {
  const router = useRouter();
  const { contacts, incidentNote, incidentSaved, setIncidentNote, saveIncident } = useEmergencyContext();
  const { touchTarget } = useAccessibilityContext();
  const fs = useFS();
  const [sosActive, setSosActive] = useState(false);
  const sosPressTime = useRef<number>(0);

  function handleSosPressIn() {
    sosPressTime.current = Date.now();
    setSosActive(true);
  }

  function handleSosPressOut() {
    const held = Date.now() - sosPressTime.current;
    setSosActive(false);
    if (held >= 2000) {
      Alert.alert('Calling 911', 'Emergency services have been notified.', [{ text: 'OK' }]);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ minHeight: touchTarget, justifyContent: 'center' }}>
          <CCText size={16} style={styles.back}>← Back</CCText>
        </TouchableOpacity>
        <CCText size={18} style={styles.title}>Emergency</CCText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          style={[styles.sosCard, sosActive && styles.sosCardActive]}
          onPressIn={handleSosPressIn}
          onPressOut={handleSosPressOut}
          activeOpacity={0.9}
          accessibilityLabel="Call 911. Hold for 2 seconds to confirm."
          accessibilityRole="button"
        >
          <Text style={styles.sosEmoji}>🆘</Text>
          <CCText size={26} style={styles.sosPrimary}>Call 911</CCText>
          <CCText size={14} style={styles.sosSub}>Hold for 2 seconds to confirm</CCText>
        </TouchableOpacity>

        <CCText size={16} style={styles.sectionTitle}>Emergency contacts</CCText>
        {contacts.map((c) => (
          <View key={c.id} style={[styles.contactCard, { minHeight: touchTarget }]}>
            <View style={styles.contactAvatar}>
              <CCText size={16} style={styles.contactInitials}>{getInitials(c.name)}</CCText>
            </View>
            <View style={styles.contactInfo}>
              <CCText size={16} style={styles.contactName}>{c.name}</CCText>
              <CCText size={13} style={styles.contactRelation}>{c.relationship}</CCText>
              <CCText size={14} style={styles.contactPhone}>{c.phone}</CCText>
            </View>
          </View>
        ))}

        <CCText size={16} style={styles.sectionTitle}>Quick incident log</CCText>
        <View style={styles.incidentCard}>
          <CCText size={13} style={styles.incidentTimestamp}>📅 {new Date().toLocaleString()}</CCText>
          <TextInput
            style={[styles.incidentInput, { fontSize: fs(15) }]}
            placeholder="What happened? Describe the situation…"
            placeholderTextColor={CC.textMuted}
            value={incidentNote}
            onChangeText={setIncidentNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity style={[styles.saveBtn, { minHeight: touchTarget }]} onPress={saveIncident} accessibilityLabel="Save incident log">
            <CCText size={16} style={styles.saveBtnText}>{incidentSaved ? '✓ Saved' : 'Save Incident Log'}</CCText>
          </TouchableOpacity>
        </View>
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
  sosCard: { backgroundColor: CC.error, borderRadius: 16, padding: 28, alignItems: 'center', marginBottom: 24 },
  sosCardActive: { backgroundColor: '#A03030' },
  sosEmoji: { fontSize: 48, marginBottom: 8 },
  sosPrimary: { fontSize: 26, fontWeight: '700', color: '#fff' },
  sosSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: CC.text, marginBottom: 10 },
  contactCard: { flexDirection: 'row', backgroundColor: CC.surface, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: CC.borderSubtle, alignItems: 'center', gap: 12 },
  contactAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: CC.primary, alignItems: 'center', justifyContent: 'center' },
  contactInitials: { color: '#fff', fontWeight: '700', fontSize: 16 },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: '600', color: CC.text },
  contactRelation: { fontSize: 13, color: CC.textMuted },
  contactPhone: { fontSize: 14, color: CC.primary, marginTop: 2 },
  incidentCard: { backgroundColor: CC.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: CC.borderSubtle },
  incidentTimestamp: { fontSize: 13, color: CC.textMuted, marginBottom: 10 },
  incidentInput: { borderWidth: 1.5, borderColor: CC.borderStrong, borderRadius: 10, padding: 12, fontSize: 15, color: CC.text, minHeight: 96, marginBottom: 14 },
  saveBtn: { backgroundColor: CC.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

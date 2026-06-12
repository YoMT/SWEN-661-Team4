import { useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTextField } from '@/shared/components/app-text-field';
import { AppButton } from '@/shared/components/app-button';
import { CCText } from '@/shared/components/cc-text';
import { CC } from '@/constants/theme';

export default function RescheduleScreen() {
  const router = useRouter();
  const [dateTime, setDateTime] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <CCText size={16} style={styles.back}>← Back</CCText>
        </TouchableOpacity>
        <CCText size={18} style={styles.title}>Reschedule Appointment</CCText>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <AppTextField label="New date & time" placeholder="e.g. 2026-06-20 2:00 PM" value={dateTime} onChangeText={setDateTime} />
        <AppButton label="Confirm Reschedule" onPress={() => router.back()} />
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
});

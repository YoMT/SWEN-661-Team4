import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfileContext } from '@/features/profile/profile-context';
import { useAuthContext } from '@/features/auth/auth-context';
import { useAccessibilityContext } from '@/features/accessibility/accessibility-context';
import { PeggyFab } from '@/features/ai-assistant/components/peggy-fab';
import { CCText } from '@/shared/components/cc-text';
import { CC } from '@/constants/theme';

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoTile}>
      <CCText size={12} style={styles.infoLabel}>{label}</CCText>
      <CCText size={15} style={styles.infoValue}>{value}</CCText>
    </View>
  );
}

function LinkRow({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  const { touchTarget } = useAccessibilityContext();
  return (
    <TouchableOpacity style={[styles.linkRow, { minHeight: touchTarget }]} onPress={onPress} accessibilityRole="button">
      <Text style={styles.linkIcon}>{icon}</Text>
      <CCText size={15} style={styles.linkLabel}>{label}</CCText>
      <CCText size={20} style={styles.linkChevron}>›</CCText>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { profile } = useProfileContext();
  const { logout } = useAuthContext();

  const initials = profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <CCText size={20} style={styles.title}>Profile</CCText>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile/edit')} accessibilityLabel="Edit profile">
          <CCText size={16} style={styles.editBtn}>Edit</CCText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <CCText size={28} style={styles.avatarText}>{initials}</CCText>
          </View>
          <CCText size={22} style={styles.name}>{profile.name}</CCText>
          <CCText size={14} style={styles.role}>Caregiver</CCText>
          {profile.careeName && <CCText size={14} style={styles.caring}>Caring for {profile.careeName}</CCText>}
        </View>

        <View style={styles.infoCard}>
          <InfoTile label="Email" value={profile.email} />
          {profile.phone && <InfoTile label="Phone" value={profile.phone} />}
          {profile.bloodType && <InfoTile label="Blood type" value={profile.bloodType} />}
        </View>

        <View style={styles.linksCard}>
          <LinkRow icon="⚙️" label="Accessibility settings" onPress={() => router.push('/(tabs)/profile/accessibility')} />
          <LinkRow icon="📋" label="Provider report" onPress={() => router.push('/(tabs)/profile/report')} />
          <LinkRow icon="🆘" label="Emergency contacts" onPress={() => router.push('/(tabs)/profile/emergency')} />
          <LinkRow icon="📓" label="Caretaker notes" onPress={() => router.push('/(tabs)/profile/caretaker-notes')} />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout} accessibilityLabel="Sign out">
          <CCText size={16} style={styles.logoutText}>Sign out</CCText>
        </TouchableOpacity>
      </ScrollView>

      <PeggyFab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CC.bg },
  header: { backgroundColor: CC.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: CC.borderSubtle },
  title: { fontSize: 20, fontWeight: '700', color: CC.text },
  editBtn: { color: CC.primary, fontSize: 16, fontWeight: '600' },
  scroll: { padding: 16 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: CC.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  name: { fontSize: 22, fontWeight: '700', color: CC.text },
  role: { fontSize: 14, color: CC.textMuted, marginTop: 4 },
  caring: { fontSize: 14, color: CC.primary, marginTop: 4 },
  infoCard: { backgroundColor: CC.surface, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: CC.borderSubtle, gap: 12 },
  infoTile: {},
  infoLabel: { fontSize: 12, color: CC.textMuted },
  infoValue: { fontSize: 15, color: CC.text, marginTop: 2 },
  linksCard: { backgroundColor: CC.surface, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: CC.borderSubtle, overflow: 'hidden' },
  linkRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: CC.borderSubtle },
  linkIcon: { fontSize: 20, marginRight: 12 },
  linkLabel: { flex: 1, fontSize: 15, color: CC.text },
  linkChevron: { fontSize: 20, color: CC.textMuted },
  logoutBtn: { padding: 16, alignItems: 'center' },
  logoutText: { fontSize: 16, color: CC.error, fontWeight: '600' },
});

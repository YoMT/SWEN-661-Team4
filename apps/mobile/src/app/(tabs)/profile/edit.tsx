import { useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTextField } from '@/shared/components/app-text-field';
import { AppButton } from '@/shared/components/app-button';
import { CCText } from '@/shared/components/cc-text';
import { useProfileContext } from '@/features/profile/profile-context';
import { CC } from '@/constants/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, update } = useProfileContext();
  const [name, setName] = useState(profile?.name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [careeName, setCareeName] = useState(profile?.careeName ?? '');
  const [bloodType, setBloodType] = useState(profile?.bloodType ?? '');

  if (!profile) return null;

  function handleSave() {
    update({ name, email, phone: phone || undefined, careeName: careeName || undefined, bloodType: bloodType || undefined });
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <CCText size={16} style={styles.back}>← Back</CCText>
        </TouchableOpacity>
        <CCText size={18} style={styles.title}>Edit Profile</CCText>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <AppTextField label="Full name" value={name} onChangeText={setName} autoCapitalize="words" />
        <AppTextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <AppTextField label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <AppTextField label="Caree name" value={careeName} onChangeText={setCareeName} />
        <AppTextField label="Blood type" value={bloodType} onChangeText={setBloodType} autoCapitalize="characters" />
        <AppButton label="Save Changes" onPress={handleSave} />
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

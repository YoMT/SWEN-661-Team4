import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/shared/app-button';
import { AppTextField } from '@/components/shared/app-text-field';
import { CCText } from '@/components/shared/cc-text';
import { useAuthContext } from '@/context/auth-context';
import { CC } from '@/constants/theme';

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading, errorMessage } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSignup() {
    if (!name.trim()) { setLocalError('Please enter your name.'); return; }
    if (!email.includes('@')) { setLocalError('Please enter a valid email.'); return; }
    if (password.length < 6) { setLocalError('Password must be at least 6 characters.'); return; }
    setLocalError(null);
    await signup(name, email, password);
  }

  const displayError = localError ?? errorMessage;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logoIcon}>❤️</Text>
          <CCText size={26} style={styles.brand}>CareConnect</CCText>
        </View>

        <View style={styles.card}>
          <CCText size={20} style={styles.cardTitle}>Create account</CCText>

          {displayError && (
            <View style={styles.errorRow}>
              <CCText size={14} style={styles.errorText}>⚠️ {displayError}</CCText>
            </View>
          )}

          <AppTextField label="Full name" placeholder="Your name" value={name} onChangeText={setName} autoCapitalize="words" />
          <AppTextField label="Email address" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <AppTextField label="Password" placeholder="Create a password" value={password} onChangeText={setPassword} obscureToggle />

          <AppButton label="Create Account" onPress={handleSignup} isLoading={isLoading} />
        </View>

        <View style={styles.loginRow}>
          <CCText size={14} style={styles.loginText}>Already have an account? </CCText>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <CCText size={14} style={styles.loginLink}>Sign in</CCText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CC.bg },
  scroll: { flexGrow: 1 },
  header: { backgroundColor: CC.primary, padding: 40, alignItems: 'center' },
  logoIcon: { fontSize: 40, marginBottom: 8 },
  brand: { fontSize: 26, fontWeight: '700', color: '#fff' },
  card: { margin: 20, padding: 20, backgroundColor: CC.surface, borderRadius: 16, borderWidth: 1.5, borderColor: CC.borderSubtle },
  cardTitle: { fontSize: 20, fontWeight: '700', color: CC.text, marginBottom: 16 },
  errorRow: { backgroundColor: '#FEF2F2', borderRadius: 8, padding: 12, marginBottom: 16 },
  errorText: { fontSize: 14, color: CC.error },
  loginRow: { flexDirection: 'row', justifyContent: 'center', padding: 16 },
  loginText: { fontSize: 14, color: CC.textMuted },
  loginLink: { fontSize: 14, fontWeight: '600', color: CC.primary },
});

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/shared/components/app-button';
import { AppTextField } from '@/shared/components/app-text-field';
import { CCText } from '@/shared/components/cc-text';
import { useAuthContext } from '@/features/auth/auth-context';
import { CC } from '@/constants/theme';
import { validate } from '@/services/validation';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, errorMessage } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = useCallback(async () => {
    const err = validate.loginForm(email, password);
    if (err) { setLocalError(err); return; }
    setLocalError(null);
    await login(email, password);
  }, [email, password, login]);

  const displayError = localError ?? errorMessage;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logoIcon}>❤️</Text>
          <CCText size={26} style={styles.brand}>CareConnect</CCText>
          <CCText size={14} style={styles.tagline}>Care management built for caregivers with tremors</CCText>
        </View>

        <View style={styles.card}>
          <CCText size={20} style={styles.cardTitle}>Sign in</CCText>

          {displayError && (
            <View style={styles.errorRow} accessibilityLiveRegion="assertive">
              <CCText size={14} style={styles.errorText}>⚠️ {displayError}</CCText>
            </View>
          )}

          <AppTextField
            label="Email address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AppTextField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            obscureToggle
          />

          <AppButton label="Sign In" onPress={handleLogin} isLoading={isLoading} />
          <View style={styles.gap} />
          <AppButton label="🔒  Sign in with Biometrics" variant="outline" onPress={() => {}} />

          <TouchableOpacity style={styles.forgotBtn}>
            <CCText size={14} style={styles.forgotText}>Forgot password?</CCText>
          </TouchableOpacity>
        </View>

        <View style={styles.signupRow}>
          <CCText size={14} style={styles.signupText}>Don't have an account? </CCText>
          <TouchableOpacity onPress={() => router.replace('/(auth)/signup')}>
            <CCText size={14} style={styles.signupLink}>Create account</CCText>
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
  brand: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 8 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  card: { margin: 20, padding: 20, backgroundColor: CC.surface, borderRadius: 16, borderWidth: 1.5, borderColor: CC.borderSubtle },
  cardTitle: { fontSize: 20, fontWeight: '700', color: CC.text, marginBottom: 16 },
  errorRow: { backgroundColor: '#FEF2F2', borderRadius: 8, padding: 12, marginBottom: 16 },
  errorText: { fontSize: 14, color: CC.error },
  gap: { height: 12 },
  forgotBtn: { alignItems: 'center', marginTop: 16 },
  forgotText: { fontSize: 14, color: CC.primary },
  signupRow: { flexDirection: 'row', justifyContent: 'center', padding: 16 },
  signupText: { fontSize: 14, color: CC.textMuted },
  signupLink: { fontSize: 14, fontWeight: '600', color: CC.primary },
});

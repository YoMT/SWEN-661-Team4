import { View, Image, ScrollView, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/shared/app-button';
import { CCText } from '@/components/shared/cc-text';
import { CC, LANDING_BG, HEADLINE_BROWN } from '@/constants/theme';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <View style={styles.logoIconBox}>
            <Text style={styles.logoIconText}>❤️</Text>
          </View>
          <CCText size={17} style={styles.logoName}>CareConnect</CCText>
        </View>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')} accessibilityLabel="Sign in" accessibilityRole="button">
          <CCText size={14} style={styles.signInLink}>Sign in</CCText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>❤️</Text>
          <CCText size={13} style={styles.badgeText}>Made for caregivers</CCText>
        </View>

        {/* Headline with brown accent */}
        <CCText size={32} style={styles.headlinePlain}>
          {'A '}
          <Text style={styles.headlineBrown}>{'gentle helping hand'}</Text>
          {' through every day.'}
        </CCText>

        {/* Subtext */}
        <CCText size={16} style={styles.subtext}>
          Keep track of medicines, visits, and little moments — without the worry. We'll remember the details so you don't have to.
        </CCText>

        {/* Hero image */}
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/images/hero_photo.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
            accessibilityLabel="A caregiver and elderly woman sharing a warm moment"
          />
        </View>

        {/* CTAs */}
        <View style={styles.ctas}>
          <AppButton
            label="Get started — it's free  →"
            onPress={() => router.push('/(auth)/signup')}
          />
          <View style={styles.ctaGap} />
          <AppButton
            label="I already have an account"
            variant="outline"
            onPress={() => router.push('/(auth)/login')}
          />
        </View>

        {/* AI pill button */}
        <View style={styles.aiRow}>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => router.push('/(auth)/login')}
            accessibilityLabel="Ask CareConnect AI assistant"
            accessibilityRole="button"
          >
            <CCText size={14} style={styles.aiButtonText}>+ Ask CareConnect</CCText>
            <View style={styles.aiLiveDot} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: LANDING_BG },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: CC.primary,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: CC.primary,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: { fontSize: 18 },
  logoName: { color: '#fff', fontWeight: '700' },
  signInLink: { color: 'rgba(255,255,255,0.9)', fontWeight: '600' },

  scroll: { paddingHorizontal: 24, paddingBottom: 32 },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: CC.surface,
    borderWidth: 1,
    borderColor: CC.borderSubtle,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 24,
    marginBottom: 20,
    gap: 6,
  },
  badgeIcon: { fontSize: 14 },
  badgeText: { color: CC.primary, fontWeight: '500' },

  headlinePlain: {
    fontWeight: '700',
    color: CC.text,
    lineHeight: 40,
    marginBottom: 16,
  },
  headlineBrown: { color: HEADLINE_BROWN },

  subtext: {
    color: CC.textMuted,
    lineHeight: 24,
    marginBottom: 24,
  },

  heroContainer: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 28,
  },
  heroImage: { width: '100%', height: '100%' },

  ctas: { marginBottom: 20 },
  ctaGap: { height: 12 },

  aiRow: { alignItems: 'center' },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CC.primary,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  aiButtonText: { color: '#fff', fontWeight: '600' },
  aiLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
});

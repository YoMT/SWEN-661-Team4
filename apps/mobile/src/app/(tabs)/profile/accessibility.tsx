import { View, Switch, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccessibilityContext } from '@/context/accessibility-context';
import { CCText } from '@/components/shared/cc-text';
import { CC } from '@/constants/theme';
import type { TextSizeLevel } from '@/models/accessibility';

const TEXT_SIZES: TextSizeLevel[] = ['standard', 'large', 'largest'];

function SettingRow({ label, description, value, onToggle, touchTarget }: { label: string; description?: string; value: boolean; onToggle: (v: boolean) => void; touchTarget: number }) {
  return (
    <View style={[styles.settingRow, { minHeight: touchTarget }]}>
      <View style={styles.settingInfo}>
        <CCText size={15} style={styles.settingLabel}>{label}</CCText>
        {description && <CCText size={13} style={styles.settingDesc}>{description}</CCText>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: CC.borderSubtle, true: CC.primary }}
        thumbColor="#fff"
        accessibilityLabel={label}
      />
    </View>
  );
}

export default function AccessibilityScreen() {
  const router = useRouter();
  const { settings, update, touchTarget } = useAccessibilityContext();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ minHeight: touchTarget, justifyContent: 'center' }}>
          <CCText size={16} style={styles.back}>← Back</CCText>
        </TouchableOpacity>
        <CCText size={18} style={styles.title}>Accessibility</CCText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <CCText size={16} style={styles.sectionTitle}>Text size</CCText>
        <View style={styles.textSizeRow}>
          {TEXT_SIZES.map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.sizeBtn, { minHeight: touchTarget }, settings.textSize === size && styles.sizeBtnActive]}
              onPress={() => update({ textSize: size })}
              accessibilityRole="radio"
              accessibilityState={{ checked: settings.textSize === size }}
            >
              <CCText
                size={size === 'standard' ? 13 : size === 'large' ? 15 : 17}
                style={[styles.sizeBtnText, settings.textSize === size && styles.sizeBtnTextActive]}
              >
                {size}
              </CCText>
            </TouchableOpacity>
          ))}
        </View>

        <CCText size={16} style={styles.sectionTitle}>Display & Motion</CCText>
        <View style={[styles.card, settings.highContrast && styles.cardHighContrast]}>
          <SettingRow touchTarget={touchTarget} label="Tremor mode" description="Larger touch targets and buttons" value={settings.tremorMode} onToggle={(v) => update({ tremorMode: v })} />
          <SettingRow touchTarget={touchTarget} label="Reduce motion" description="Minimizes animations" value={settings.reduceMotion} onToggle={(v) => update({ reduceMotion: v })} />
          <SettingRow touchTarget={touchTarget} label="High contrast" description="Stronger border colors" value={settings.highContrast} onToggle={(v) => update({ highContrast: v })} />
        </View>

        <CCText size={16} style={styles.sectionTitle}>Reminders</CCText>
        <View style={[styles.card, settings.highContrast && styles.cardHighContrast]}>
          <SettingRow touchTarget={touchTarget} label="Read aloud" description="Speak medication reminders" value={settings.readAloud} onToggle={(v) => update({ readAloud: v })} />
          <SettingRow touchTarget={touchTarget} label="Confirm actions" description="Extra confirmation for important actions" value={settings.confirmActions} onToggle={(v) => update({ confirmActions: v })} />
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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: CC.text, marginBottom: 10, marginTop: 4 },
  textSizeRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  sizeBtn: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1.5, borderColor: CC.borderSubtle, alignItems: 'center', justifyContent: 'center' },
  sizeBtnActive: { borderColor: CC.primary, backgroundColor: CC.surfaceAlt },
  sizeBtnText: { color: CC.textMuted, textTransform: 'capitalize' },
  sizeBtnTextActive: { color: CC.primary, fontWeight: '600' },
  card: { backgroundColor: CC.surface, borderRadius: 12, borderWidth: 1, borderColor: CC.borderSubtle, marginBottom: 20, overflow: 'hidden' },
  cardHighContrast: { borderColor: CC.borderStrong, borderWidth: 2 },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: CC.borderSubtle },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 15, color: CC.text },
  settingDesc: { fontSize: 13, color: CC.textMuted, marginTop: 2 },
});

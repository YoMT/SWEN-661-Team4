import { Tabs, Redirect } from 'expo-router';
import { useAuthContext } from '@/features/auth/auth-context';
import { useAccessibilityContext } from '@/features/accessibility/accessibility-context';
import { CC } from '@/constants/theme';
import { View, Text, StyleSheet } from 'react-native';

type TabIconProps = { focused: boolean; icon: string; label: string };

function TabIcon({ focused, icon, label }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{icon}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const { isLoggedIn } = useAuthContext();
  const { tabHeight } = useAccessibilityContext();
  if (!isLoggedIn) return <Redirect href="/(auth)" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { height: tabHeight + 16, backgroundColor: CC.surface, borderTopColor: CC.borderSubtle },
        tabBarActiveTintColor: CC.primary,
        tabBarInactiveTintColor: CC.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🏠" label="Home" />,
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Meds',
          tabBarAccessibilityLabel: 'Medications tab',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="💊" label="Meds" />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Schedule',
          tabBarAccessibilityLabel: 'Appointments tab',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="📅" label="Schedule" />,
        }}
      />
      <Tabs.Screen
        name="symptoms"
        options={{
          title: 'Symptoms',
          tabBarAccessibilityLabel: 'Symptoms tab',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="❤️" label="Symptoms" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="👤" label="Profile" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center', paddingTop: 4 },
  tabIcon: { fontSize: 20, opacity: 0.5 },
  tabIconFocused: { opacity: 1 },
  tabLabel: { fontSize: 11, color: CC.textMuted, marginTop: 2 },
  tabLabelFocused: { color: CC.primary, fontWeight: '600' },
});

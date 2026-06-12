import { Tabs, Redirect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthContext } from '@/features/auth/auth-context';
import { useAccessibilityContext } from '@/features/accessibility/accessibility-context';
import { CC } from '@/constants/theme';
import { Text, StyleSheet } from 'react-native';

function TabEmoji({ focused, icon }: { focused: boolean; icon: string }) {
  return <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{icon}</Text>;
}

export default function TabsLayout() {
  const { isLoggedIn } = useAuthContext();
  const { tabHeight } = useAccessibilityContext();
  const insets = useSafeAreaInsets();
  if (!isLoggedIn) return <Redirect href="/(auth)" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: tabHeight + insets.bottom + 24,
          paddingBottom: insets.bottom,
          backgroundColor: CC.surface,
          borderTopWidth: 1,
          borderTopColor: CC.borderSubtle,
        },
        tabBarItemStyle: { flex: 1, paddingVertical: 4 },
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: CC.primary,
        tabBarInactiveTintColor: CC.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ focused }) => <TabEmoji focused={focused} icon="🏠" />,
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Meds',
          tabBarAccessibilityLabel: 'Medications tab',
          tabBarIcon: ({ focused }) => <TabEmoji focused={focused} icon="💊" />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Schedule',
          tabBarAccessibilityLabel: 'Appointments tab',
          tabBarIcon: ({ focused }) => <TabEmoji focused={focused} icon="📅" />,
        }}
      />
      <Tabs.Screen
        name="symptoms"
        options={{
          title: 'Symptoms',
          tabBarAccessibilityLabel: 'Symptoms tab',
          tabBarIcon: ({ focused }) => <TabEmoji focused={focused} icon="❤️" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab',
          tabBarIcon: ({ focused }) => <TabEmoji focused={focused} icon="👤" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: { fontSize: 22, opacity: 0.5 },
  tabIconFocused: { opacity: 1 },
  tabLabel: { fontSize: 10, marginTop: 0 },
});

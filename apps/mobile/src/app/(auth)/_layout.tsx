import { Stack, Redirect } from 'expo-router';
import { useAuthContext } from '@/features/auth/auth-context';

export default function AuthLayout() {
  const { isLoggedIn } = useAuthContext();
  if (isLoggedIn) return <Redirect href="/(tabs)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

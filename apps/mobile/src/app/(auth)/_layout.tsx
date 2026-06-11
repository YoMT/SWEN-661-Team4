import { Stack, Redirect } from 'expo-router';
import { useAuthContext } from '@/context/auth-context';

export default function AuthLayout() {
  const { isLoggedIn } = useAuthContext();
  if (isLoggedIn) return <Redirect href="/(tabs)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

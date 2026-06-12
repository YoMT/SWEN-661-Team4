import { Redirect } from 'expo-router';
import { useAuthContext } from '@/features/auth/auth-context';

export default function Index() {
  const { isLoggedIn } = useAuthContext();
  return <Redirect href={isLoggedIn ? '/(tabs)' : '/(auth)'} />;
}

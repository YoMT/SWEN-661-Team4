import { Redirect } from 'expo-router';
import { useAuthContext } from '@/context/auth-context';

export default function Index() {
  const { isLoggedIn } = useAuthContext();
  return <Redirect href={isLoggedIn ? '/(tabs)' : '/(auth)'} />;
}

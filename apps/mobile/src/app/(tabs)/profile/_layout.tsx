import { Stack } from 'expo-router';
import { CC } from '@/constants/theme';

export default function ProfileLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: CC.bg } }} />;
}

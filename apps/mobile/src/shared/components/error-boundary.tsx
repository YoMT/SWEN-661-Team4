import React, { Component, type ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CC } from '@/constants/theme';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <ErrorScreen message={this.state.error.message} onReset={() => this.setState({ error: null })} />;
    }
    return this.props.children;
  }
}

function ErrorScreen({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.btn} onPress={onReset} accessibilityRole="button" accessibilityLabel="Try again">
        <Text style={styles.btnText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CC.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: CC.text, textAlign: 'center', marginBottom: 8 },
  message: { fontSize: 14, color: CC.textMuted, textAlign: 'center', marginBottom: 24 },
  btn: { backgroundColor: CC.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

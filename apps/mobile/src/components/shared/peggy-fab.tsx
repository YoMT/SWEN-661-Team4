import React, { useState, useCallback, memo } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView } from 'react-native';
import { CC } from '@/constants/theme';
import { useAiAssistantContext } from '@/context/ai-assistant-context';
import type { ChatMessage } from '@/models/chat-message';

const ChatBubble = memo(function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
      <Text style={styles.bubbleText}>{msg.content}</Text>
    </View>
  );
});

const TypingDots = memo(function TypingDots() {
  return (
    <View style={[styles.bubble, styles.bubbleAssistant]}>
      <Text style={styles.bubbleText}>Peggy is typing…</Text>
    </View>
  );
});

const EmptyChat = memo(function EmptyChat() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🤖</Text>
      <Text style={styles.emptyText}>{"Hi, I'm Peggy!\nHow can I help you today?"}</Text>
    </View>
  );
});

export function PeggyFab() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const { messages, isTyping, sendMessage } = useAiAssistantContext();

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');
    await sendMessage(trimmed);
  }, [text, sendMessage]);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => <ChatBubble msg={item} />,
    [],
  );

  return (
    <>
      <TouchableOpacity
        onPress={handleOpen}
        style={styles.fab}
        accessibilityLabel="Open Peggy assistant"
        accessibilityRole="button"
      >
        <Text style={styles.fabIcon}>🤖</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
        <SafeAreaView style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerIcon}>🤖</Text>
            <Text style={styles.headerTitle}>Peggy</Text>
            <TouchableOpacity onPress={handleClose} accessibilityLabel="Close assistant">
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={renderItem}
            ListEmptyComponent={EmptyChat}
            ListFooterComponent={isTyping ? <TypingDots /> : null}
            contentContainerStyle={styles.messageList}
            removeClippedSubviews
          />

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Ask me anything…"
                placeholderTextColor={CC.textMuted}
                value={text}
                onChangeText={setText}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                accessibilityLabel="Message input"
              />
              <TouchableOpacity onPress={handleSend} style={styles.sendBtn} accessibilityLabel="Send message" accessibilityRole="button">
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CC.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabIcon: { fontSize: 24 },
  sheet: { flex: 1, backgroundColor: CC.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: CC.borderSubtle },
  headerIcon: { fontSize: 22, marginRight: 8 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: CC.text },
  closeBtn: { fontSize: 18, color: CC.textMuted, padding: 4 },
  messageList: { padding: 12, flexGrow: 1 },
  bubble: { maxWidth: '80%', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginVertical: 4 },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: CC.surfaceAlt },
  bubbleAssistant: { alignSelf: 'flex-start', backgroundColor: CC.surface, borderWidth: 1, borderColor: CC.borderSubtle },
  bubbleText: { fontSize: 15, color: CC.text },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: CC.textMuted, textAlign: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: CC.borderSubtle, gap: 8, backgroundColor: CC.surface },
  input: { flex: 1, borderWidth: 2, borderColor: CC.borderStrong, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: CC.text },
  sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: CC.primary, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { fontSize: 18, color: '#fff' },
});

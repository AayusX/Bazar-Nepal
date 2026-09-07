import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, Linking, Image, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send, CheckCheck, Phone, ShieldCheck, User } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';
import { ChatMessage } from '../constants/mockData';

const QUICK_PROMPTS = [
  'Namaste! Is this item available?',
  'What is the final price for today?',
  'Can we meet in Kathmandu for inspection?',
  'Is Bluebook / bill included?',
];

export default function ChatScreen({ route, navigation }: any) {
  const {
    sellerId = '',
    productId = '',
    sellerName = 'Seller',
    sellerPhone = '',
    initialMessage = '',
  } = route?.params || {};

  const convKey = `conv_${sellerId}_${productId}`;
  const { chatMessages, sendMessage, getChatForConversation, currentUser } = useApp();
  const messages: ChatMessage[] = getChatForConversation(convKey);

  const [inputText, setInputText] = useState(initialMessage);
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    // Send initial message if provided and chat is empty
    if (initialMessage && messages.length === 0) {
      sendMessage(convKey, initialMessage, sellerName);
      setInputText('');
    }
  }, [initialMessage, convKey, messages.length, sellerName, sendMessage]);

  const handleSend = useCallback((textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    sendMessage(convKey, content, sellerName);
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      listRef.current?.scrollToEnd({ animated: true });
    }, 1300);
  }, [inputText, convKey, sellerName, sendMessage]);

  const handleCallSeller = useCallback(() => {
    if (!sellerPhone) {
      Alert.alert('Contact Unavailable', 'Seller has not provided a direct phone number.');
      return;
    }
    const cleanNumber = sellerPhone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      Alert.alert('Call Failed', `Could not dial ${sellerPhone}. Please try again.`);
    });
  }, [sellerPhone]);

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => {
    const isMine = item.isMine;
    const timeStr = new Date(item.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={[styles.msgRow, isMine ? styles.msgRowMine : styles.msgRowTheirs]}>
        {!isMine && (
          <View style={styles.avatarWrap}>
            <User size={16} color="#64748B" />
          </View>
        )}
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.bubbleText, isMine ? styles.bubbleTextMine : styles.bubbleTextTheirs]}>
            {item.content}
          </Text>
          <View style={styles.bubbleFooter}>
            <Text style={[styles.bubbleTime, isMine ? styles.bubbleTimeMine : styles.bubbleTimeTheirs]}>
              {timeStr}
            </Text>
            {isMine && <CheckCheck size={13} color="rgba(255, 255, 255, 0.85)" />}
          </View>
        </View>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>{sellerName}</Text>
          <View style={styles.headerBadge}>
            <ShieldCheck size={12} color="#047857" />
            <Text style={styles.headerSub}>Bazaar Nepal member</Text>
          </View>
        </View>

        {sellerPhone ? (
          <TouchableOpacity style={styles.callBtn} onPress={handleCallSeller} activeOpacity={0.8}>
            <Phone size={16} color="#B91C1C" />
            <Text style={styles.callBtnText}>Call</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Message List */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <ShieldCheck size={40} color="#B91C1C" />
            <Text style={styles.emptyTitle}>Chat with {sellerName}</Text>
            <Text style={styles.emptySub}>
              Direct negotiation and verified Nepali trade. Tap a quick response below or type your message.
            </Text>
          </View>
        }
      />

      {/* Typing indicator */}
      {isTyping && (
        <View style={styles.typingWrap}>
          <Text style={styles.typingText}>{sellerName} is typing...</Text>
        </View>
      )}

      {/* Quick response chips */}
      <View style={styles.quickWrap}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={QUICK_PROMPTS}
          keyExtractor={(item, i) => `qp_${i}`}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.quickChip} onPress={() => handleSend(item)}>
              <Text style={styles.quickChipText}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      {/* Input Bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#94A3B8"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
          >
            <Send size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  headerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  headerSub: { fontSize: 11, color: '#047857', fontWeight: '600' },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  callBtnText: { fontSize: 13, color: '#B91C1C', fontWeight: '800' },
  listContainer: { padding: 16, flexGrow: 1, gap: 10 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginVertical: 4 },
  msgRowMine: { justifyContent: 'flex-end' },
  msgRowTheirs: { justifyContent: 'flex-start' },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  bubbleMine: {
    backgroundColor: '#B91C1C',
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextMine: { color: '#FFFFFF', fontWeight: '500' },
  bubbleTextTheirs: { color: '#0F172A', fontWeight: '500' },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  bubbleTime: { fontSize: 10 },
  bubbleTimeMine: { color: 'rgba(255, 255, 255, 0.75)' },
  bubbleTimeTheirs: { color: '#94A3B8' },
  typingWrap: { paddingHorizontal: 20, paddingBottom: 6 },
  typingText: { fontSize: 12, color: '#B91C1C', fontStyle: 'italic', fontWeight: '600' },
  quickWrap: { paddingVertical: 8, backgroundColor: '#F8FAFC' },
  quickChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickChipText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#B91C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#CBD5E1' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 19 },
});

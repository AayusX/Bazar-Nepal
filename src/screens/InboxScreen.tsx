import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, ChevronRight, User, ShieldCheck } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

export default function InboxScreen({ navigation }: any) {
  const { chatMessages, currentUser } = useApp();

  // Aggregate only real conversations (each chat is keyed by `conv_<sellerId>_<productId>`)
  const displayConversations = Object.entries(chatMessages).map(([key, msgs]) => {
    const lastMsg = msgs[msgs.length - 1];
    const isFromSeller = !lastMsg?.isMine;
    const rest = key.startsWith('conv_') ? key.slice(5) : key;
    const pIdx = rest.lastIndexOf('_p_');
    const sellerId = pIdx === -1 ? rest : rest.slice(0, pIdx);
    const productId = pIdx === -1 ? '' : rest.slice(pIdx + 1);
    return {
      id: key,
      name: lastMsg?.senderName || 'Bazaar Member',
      lastMessage: lastMsg?.content || 'Inquired about listing.',
      time: lastMsg?.sentAt
        ? new Date(lastMsg.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : 'Today',
      unread: isFromSeller,
      sellerId,
      productId,
    };
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>BAZAAR NEPAL</Text>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
      </View>

      <FlatList
        data={displayConversations}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.convCard}
            onPress={() => navigation.navigate('Chat', {
              sellerName: item.name,
              sellerId: item.sellerId,
              productId: item.productId,
            })}
            activeOpacity={0.85}
          >
            <View style={styles.avatarWrap}>
              <User size={22} color="#64748B" />
              {item.unread && <View style={styles.unreadBadge} />}
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.cardTopRow}>
                <Text style={styles.sellerName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <Text style={[styles.previewText, item.unread && styles.previewTextUnread]} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>

            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  headerSub: { fontSize: 11, fontWeight: '800', color: '#B91C1C', letterSpacing: 1.2 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#0F172A' },
  list: { padding: 16, gap: 10 },
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#B91C1C',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardInfo: { flex: 1 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  sellerName: { fontSize: 14, fontWeight: '800', color: '#0F172A', maxWidth: '75%' },
  timeText: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  previewText: { fontSize: 13, color: '#64748B' },
  previewTextUnread: { color: '#0F172A', fontWeight: '700' },
});

import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, MessageCircle, ShieldCheck, Package, Tag, Trash2, CheckCircle2 } from 'lucide-react-native';
import { useApp, AppNotification } from '../context/AppContext';
import { colors } from '../theme';

const getNotifIcon = (type: AppNotification['type']) => {
  switch (type) {
    case 'listing': return <Package size={18} color="#B91C1C" />;
    case 'message': return <MessageCircle size={18} color="#047857" />;
    case 'escrow': return <ShieldCheck size={18} color="#047857" />;
    case 'offer': return <Tag size={18} color="#D97706" />;
    default: return <Bell size={18} color="#B91C1C" />;
  }
};

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleDateString('en-NP', { month: 'short', day: 'numeric' });
};

export default function NotificationsScreen({ navigation }: any) {
  const { notifications, markNotificationsRead, clearNotifications } = useApp();

  useEffect(() => {
    // Automatically mark notifications as read when opening screen
    markNotificationsRead();
  }, [markNotificationsRead]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 ? (
          <TouchableOpacity style={styles.clearBtn} onPress={clearNotifications}>
            <Trash2 size={16} color="#DC2626" />
          </TouchableOpacity>
        ) : <View style={{ width: 38 }} />}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}>
            <View style={styles.iconWrap}>
              {getNotifIcon(item.type)}
            </View>
            <View style={styles.cardContent}>
              <View style={styles.titleRow}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.timeText}>{fmtTime(item.createdAt)}</Text>
              </View>
              <Text style={styles.bodyText}>{item.body}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Bell size={44} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptySub}>
              You don't have any unread alerts. You will receive updates about your listings, chats, and escrow transactions here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  clearBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { padding: 16, gap: 10 },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  notifCardUnread: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FECACA',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  titleText: { fontSize: 14, fontWeight: '800', color: '#0F172A', maxWidth: '75%' },
  timeText: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  bodyText: { fontSize: 13, color: '#475569', lineHeight: 18 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 14 },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 20 },
});

import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Store, MessageCircle, User } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { Product } from '../constants/mockData';
import ProductCard from '../components/ProductCard';

export default function SellerProfileScreen({ route, navigation }: any) {
  const { sellerId, sellerName, sellerAvatar } = route.params || {};
  const { savedItems, toggleSavedItem, currentUser, products, getSeller } = useApp();

  const seller = getSeller(sellerId);
  const items: Product[] = useMemo(
    () => products.filter(p => p.sellerId === sellerId),
    [products, sellerId],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        isSaved={savedItems.includes(item.id)}
        onSave={() => toggleSavedItem(item.id)}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      />
    ),
    [savedItems, toggleSavedItem, navigation],
  );

  const isSelf = currentUser?.id === sellerId;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{sellerName || seller?.name || 'Seller Profile'}</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Seller Bio Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <User size={30} color="#64748B" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name} numberOfLines={1}>{sellerName || seller?.name || 'Bazaar Member'}</Text>
          {seller?.location ? (
            <Text style={styles.metaText}>{seller.location}</Text>
          ) : null}
          <Text style={styles.itemsCount}>{items.length} Active Listing{items.length === 1 ? '' : 's'}</Text>
        </View>
        {!isSelf && items.length > 0 ? (
          <TouchableOpacity
            style={styles.msgBtn}
            onPress={() =>
              navigation.navigate('Chat', {
                sellerId,
                productId: items[0]?.id,
                sellerName: sellerName || 'Seller',
                sellerPhone: seller?.phone,
              })
            }
          >
            <MessageCircle size={16} color="#B91C1C" />
            <Text style={styles.msgBtnText}>Chat</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Store size={40} color="#94A3B8" />
          <Text style={styles.emptyTitle}>No active listings</Text>
          <Text style={styles.emptySub}>This seller does not have any live posts right now.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={renderItem}
          ListHeaderComponent={<Text style={styles.listTitle}>Live Listings</Text>}
        />
      )}
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  metaText: { fontSize: 11, color: '#047857', fontWeight: '700' },
  itemsCount: { fontSize: 11, color: '#64748B', marginTop: 2, fontWeight: '500' },
  msgBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  msgBtnText: { fontSize: 13, fontWeight: '800', color: '#B91C1C' },
  listTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', paddingHorizontal: 16, marginVertical: 12 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6 },
});

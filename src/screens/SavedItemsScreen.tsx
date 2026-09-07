import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, ArrowLeft } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { Product } from '../constants/mockData';
import { colors } from '../theme';
import ProductCard from '../components/ProductCard';

export default function SavedItemsScreen({ navigation }: any) {
  const { savedItems, toggleSavedItem, products } = useApp();

  const savedProducts: Product[] = useMemo(
    () => products.filter(p => savedItems.includes(p.id)),
    [products, savedItems],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        isSaved
        onSave={() => toggleSavedItem(item.id)}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      />
    ),
    [toggleSavedItem, navigation],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Listings</Text>
        <View style={{ width: 38 }} />
      </View>

      {savedProducts.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Heart size={44} color="#B91C1C" />
          <Text style={styles.emptyTitle}>No saved items yet</Text>
          <Text style={styles.emptySub}>
            Tap the heart icon on any product across Bazaar Nepal to bookmark it here for later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={renderItem}
          ListHeaderComponent={
            <Text style={styles.countText}>{savedProducts.length} Saved Product{savedProducts.length === 1 ? '' : 's'}</Text>
          }
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
  countText: { fontSize: 13, color: '#64748B', fontWeight: '700', paddingHorizontal: 16, marginVertical: 12 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 14 },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 20 },
});

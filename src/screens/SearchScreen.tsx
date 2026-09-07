import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, Modal, Pressable,
  KeyboardAvoidingView, Platform, TextInput, ListRenderItem, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SlidersHorizontal, Package, Search, X, WifiOff } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { CATEGORIES, Product } from '../constants/mockData';
import { colors } from '../theme';
import ProductCard from '../components/ProductCard';

type Filters = {
  minPrice: string;
  maxPrice: string;
};

const EMPTY_FILTERS: Filters = { minPrice: '', maxPrice: '' };

export default function SearchScreen({ navigation }: any) {
  const {
    products, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    filteredProducts, savedItems, toggleSavedItem, recentSearches, addRecentSearch,
    clearRecentSearches, isServerConnected,
  } = useApp();

  const inputRef = useRef<TextInput>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draftMin, setDraftMin] = useState('');
  const [draftMax, setDraftMax] = useState('');

  const isSearching =
    searchQuery.trim().length > 0 ||
    selectedCategory !== null ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '';

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of products) {
      map[p.category] = (map[p.category] || 0) + 1;
    }
    return map;
  }, [products]);

  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim()) addRecentSearch(searchQuery.trim());
  }, [searchQuery, addRecentSearch]);

  const handleRecentTap = useCallback((term: string) => {
    setSearchQuery(term);
    addRecentSearch(term);
  }, [setSearchQuery, addRecentSearch]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory(null);
    setFilters(EMPTY_FILTERS);
    inputRef.current?.focus();
  }, [setSearchQuery, setSelectedCategory]);

  const displayedItems = useMemo(() => {
    let items = filteredProducts;
    if (filters.minPrice) {
      items = items.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      items = items.filter(p => p.price <= Number(filters.maxPrice));
    }
    return items;
  }, [filteredProducts, filters]);

  const renderProduct: ListRenderItem<Product> = useCallback(
    ({ item }) => (
      <ProductCard
        product={item}
        isSaved={savedItems.includes(item.id)}
        onSave={() => toggleSavedItem(item.id)}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      />
    ),
    [savedItems, toggleSavedItem, navigation],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSub}>DISCOVER</Text>
        <Text style={styles.headerTitle}>Search Bazaar</Text>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search electronics, vehicles, furniture..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            accessibilityLabel="Search listings"
          />
          {(searchQuery.length > 0 || selectedCategory) && (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Clear search"
            >
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setDrawerOpen(true)}
          accessibilityLabel="Open filters"
          accessibilityRole="button"
        >
          <SlidersHorizontal size={18} color={colors.brand} />
        </TouchableOpacity>
      </View>

      {!isServerConnected && (
        <View style={styles.offlineBanner}>
          <WifiOff size={14} color={colors.textSecondary} />
          <Text style={styles.offlineText}>
            You're offline — showing a saved copy. It will refresh automatically.
          </Text>
        </View>
      )}

      {!isSearching ? (
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={clearRecentSearches} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tagRow}>
                {recentSearches.map((s, i) => (
                  <TouchableOpacity
                    key={`s_${i}`}
                    style={styles.tagChip}
                    onPress={() => handleRecentTap(s)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.tagChipText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            <View style={styles.catGrid}>
              {CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.name] || 0;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.catCard}
                    onPress={() => setSelectedCategory(cat.name)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.catName}>{cat.name}</Text>
                    <Text style={styles.catSub}>{count} item{count === 1 ? '' : 's'}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChips}
          >
            <TouchableOpacity
              style={[styles.filterChip, !selectedCategory && styles.filterChipActive]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[styles.filterChipText, !selectedCategory && styles.filterChipTextActive]}>All</Text>
            </TouchableOpacity>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.filterChip, selectedCategory === cat.name && styles.filterChipActive]}
                onPress={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              >
                <Text style={[styles.filterChipText, selectedCategory === cat.name && styles.filterChipTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.resultsCount}>
            {displayedItems.length} result{displayedItems.length === 1 ? '' : 's'}
            {filters.minPrice || filters.maxPrice ? ' · price filtered' : ''}
          </Text>

          <FlatList
            data={displayedItems}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 }}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Package size={36} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>No matching listings found</Text>
                <Text style={styles.emptySub}>Try a different keyword, category, or price range.</Text>
                <TouchableOpacity style={styles.emptyResetBtn} onPress={handleClear}>
                  <Text style={styles.emptyResetText}>Clear Search</Text>
                </TouchableOpacity>
              </View>
            }
            renderItem={renderProduct}
          />
        </View>
      )}

      {/* Filter Modal */}
      <Modal visible={drawerOpen} transparent animationType="slide" onRequestClose={() => setDrawerOpen(false)}>
        <KeyboardAvoidingView style={styles.drawerRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.backdrop} onPress={() => setDrawerOpen(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Price Filter (NPR)</Text>
              <Pressable onPress={() => setDrawerOpen(false)} accessibilityLabel="Close filters">
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>

            <View style={styles.sheetBody}>
              <View style={styles.priceRow}>
                <TextInput
                  style={styles.sheetInput}
                  placeholder="Min NPR"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={draftMin}
                  onChangeText={setDraftMin}
                />
                <Text style={styles.dashText}>—</Text>
                <TextInput
                  style={styles.sheetInput}
                  placeholder="Max NPR"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={draftMax}
                  onChangeText={setDraftMax}
                />
              </View>

              <View style={styles.sheetFooter}>
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={() => {
                    setDraftMin('');
                    setDraftMax('');
                    setFilters(EMPTY_FILTERS);
                    setDrawerOpen(false);
                  }}
                >
                  <Text style={styles.resetBtnText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={() => {
                    setFilters({ minPrice: draftMin, maxPrice: draftMax });
                    setDrawerOpen(false);
                  }}
                >
                  <Text style={styles.applyBtnText}>Apply Filter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 6 },
  headerSub: { fontSize: 11, fontWeight: '800', color: colors.brand, letterSpacing: 1.2 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: colors.text },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, fontWeight: '500', padding: 0 },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.brandSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.dangerBorder,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.goldSurface,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  offlineText: { flex: 1, fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  clearAllText: { fontSize: 13, color: colors.brand, fontWeight: '700' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  tagChipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    width: '48%',
  },
  catName: { fontSize: 14, fontWeight: '800', color: colors.text },
  catSub: { fontSize: 11, color: colors.brand, marginTop: 3, fontWeight: '700' },
  filterChips: { paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  filterChipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '700' },
  filterChipTextActive: { color: colors.onBrand },
  resultsCount: { paddingHorizontal: 20, paddingBottom: 10, fontSize: 13, fontWeight: '700', color: colors.textMuted },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 12 },
  emptySub: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 6 },
  emptyResetBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.brandSurface,
    borderWidth: 1.5,
    borderColor: colors.dangerBorder,
  },
  emptyResetText: { fontSize: 13, fontWeight: '800', color: colors.brand },
  drawerRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', inset: 0, backgroundColor: colors.scrim },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 16, fontWeight: '900', color: colors.text },
  closeText: { fontSize: 14, color: colors.brand, fontWeight: '800' },
  sheetBody: { gap: 16 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sheetInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  dashText: { fontSize: 16, color: colors.textMuted },
  sheetFooter: { flexDirection: 'row', gap: 10, marginTop: 8 },
  resetBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
  },
  resetBtnText: { fontSize: 14, color: colors.textSecondary, fontWeight: '700' },
  applyBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.brand,
    alignItems: 'center',
  },
  applyBtnText: { fontSize: 14, color: colors.onBrand, fontWeight: '900' },
});

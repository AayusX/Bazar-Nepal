import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Image, Dimensions, ListRenderItem
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin, Bell, Clock, ChevronRight, Heart,
  ShieldCheck, Award, Store, Edit3, Eye, Package
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { CATEGORIES, Product } from '../constants/mockData';
import { colors } from '../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

type StatCardProps = { label: string; value: string; color: string; sub: string };
const StatCard = ({ label, value, color, sub }: StatCardProps) => (
  <View style={[styles.statCard, { borderTopColor: color }]}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statSub}>{sub}</Text>
  </View>
);

type ProductCardProps = {
  product: Product;
  onPress: () => void;
  isSaved: boolean;
  onSave: () => void;
  isMine?: boolean;
};

const ProductCard = ({ product, onPress, isSaved, onSave, isMine }: ProductCardProps) => (
  <TouchableOpacity style={styles.productCard} onPress={onPress} activeOpacity={0.88}>
    <View style={styles.productImageWrap}>
      {product.images && product.images[0] ? (
        <Image source={{ uri: product.images[0] }} style={styles.productImage} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Package size={28} color="#94A3B8" />
        </View>
      )}
      <TouchableOpacity style={styles.heartBtn} onPress={onSave} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Heart size={16} color={isSaved ? '#DC2626' : '#64748B'} fill={isSaved ? '#DC2626' : 'transparent'} />
      </TouchableOpacity>
      {isMine && (
        <View style={styles.mineBadge}>
          <Text style={styles.mineBadgeText}>Your Listing</Text>
        </View>
      )}
      {product.isEscrowEligible && !isMine && (
        <View style={styles.escrowBadge}>
          <ShieldCheck size={10} color="#fff" />
          <Text style={styles.escrowText}>Escrow</Text>
        </View>
      )}
    </View>
    <View style={styles.productInfo}>
      <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
      <Text style={styles.productPrice}>NPR {product.price.toLocaleString()}</Text>
      <View style={styles.productMeta}>
        <MapPin size={11} color="#B91C1C" />
        <Text style={styles.productLocation} numberOfLines={1}>
          {product.location.split(',')[0].trim()}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }: any) {
  const { products, savedItems, toggleSavedItem, currentUser, unreadNotificationCount } = useApp();
  const featured = products.slice(0, 8);
  const myListings = products.filter(p => p.sellerId === currentUser?.id);
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
  const activeCategories = new Set(products.map(p => p.category).filter(Boolean)).size;

  const renderProduct: ListRenderItem<Product> = useCallback(({ item }) => (
    <ProductCard
      product={item}
      isSaved={savedItems.includes(item.id)}
      onSave={() => toggleSavedItem(item.id)}
      isMine={item.sellerId === currentUser?.id}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    />
  ), [savedItems, toggleSavedItem, currentUser, navigation]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Nepali Brand Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.badgeRow}>
              <Award size={12} color="#B91C1C" />
              <Text style={styles.headerSub}>BAZAAR NEPAL · NATIONAL MARKETPLACE</Text>
            </View>
            <Text style={styles.headerTitle}>Discover Nepal</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.locationChip}>
              <MapPin size={12} color="#B91C1C" />
              <Text style={styles.locationText}>Nepal</Text>
            </View>
            {/* NOTIFICATION BELL BUTTON WITH NAVIGATION */}
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => navigation.navigate('Notifications')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.8}
            >
              <Bell size={18} color="#0F172A" />
              {unreadNotificationCount > 0 && <View style={styles.bellDot} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Marketplace Stats Row */}
        <View style={styles.statsRow}>
          <StatCard label="Live Listings" value={String(products.length)} color="#B91C1C" sub="Across Nepal" />
          <StatCard label="Total Views" value={totalViews.toLocaleString()} color="#047857" sub="All listings" />
          <StatCard label="Categories" value={String(activeCategories)} color="#D97706" sub="Active now" />
        </View>

        {/* My Live Listings (if any) */}
        {myListings.length > 0 && (
          <View style={styles.myListingsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Store size={15} color="#047857" />
                <Text style={styles.sectionTitle}>Your Live Listings ({myListings.length})</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Sell')}>
                <Text style={styles.addMoreText}>+ Post Another</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.myListingsScroll}>
              {myListings.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.myListingCard}
                  onPress={() => navigation.navigate('ProductDetails', { product: item })}
                  activeOpacity={0.88}
                >
                  {item.images && item.images[0] ? (
                    <Image source={{ uri: item.images[0] }} style={styles.myListingImg} />
                  ) : (
                    <View style={[styles.myListingImg, styles.imagePlaceholder]}>
                      <Package size={18} color="#94A3B8" />
                    </View>
                  )}
                  <View style={styles.myListingBody}>
                    <Text style={styles.myListingTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.myListingPrice}>NPR {item.price.toLocaleString()}</Text>
                    <View style={styles.editActionRow}>
                      <Edit3 size={12} color="#B91C1C" />
                      <Text style={styles.editText}>Tap to View & Edit</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Categories Bar */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {CATEGORIES.map((cat) => {
            const catCount = products.filter(p => p.category === cat.name).length;
            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryChip}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Explore')}
              >
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryCount}>{catCount}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Listings */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Clock size={15} color="#B91C1C" />
            <Text style={styles.sectionTitle}>Live Classifieds Feed</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <ChevronRight size={18} color="#B91C1C" />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={featured}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
          renderItem={renderProduct}
        />

        {/* Developer Credit Bar */}
        <View style={styles.creditBar}>
          <Text style={styles.creditApp}>BAZAAR NEPAL</Text>
          <Text style={styles.creditDev}>Developed by Mr.Aayush Bhandari (Root Spectra)</Text>
          <Text style={styles.creditStudio}>Nepal's Community Classifieds</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  headerSub: { fontSize: 10, fontWeight: '800', color: '#B91C1C', letterSpacing: 1.2 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  headerRight: { alignItems: 'flex-end', gap: 8 },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  locationText: { fontSize: 12, color: '#B91C1C', fontWeight: '800' },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 18 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderTopWidth: 3.5,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: { fontSize: 16, fontWeight: '900', color: '#0F172A' },
  statLabel: { fontSize: 11, color: '#475569', marginTop: 2, fontWeight: '700' },
  statSub: { fontSize: 9, color: '#94A3B8', marginTop: 2, fontWeight: '600' },
  myListingsSection: { marginBottom: 18 },
  myListingsScroll: { paddingLeft: 16 },
  myListingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    width: 240,
    gap: 10,
  },
  myListingImg: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#E2E8F0' },
  myListingBody: { flex: 1 },
  myListingTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  myListingPrice: { fontSize: 13, fontWeight: '900', color: '#B91C1C', marginTop: 2 },
  editActionRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  editText: { fontSize: 10, color: '#B91C1C', fontWeight: '700' },
  addMoreText: { fontSize: 12, color: '#047857', fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, marginBottom: 10 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#0F172A' },
  seeAll: { fontSize: 13, color: '#B91C1C', fontWeight: '800' },
  categoryScroll: { paddingLeft: 16, marginBottom: 20 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryName: { fontSize: 13, fontWeight: '800', color: '#334155' },
  categoryCount: { fontSize: 10, fontWeight: '700', color: '#B91C1C', backgroundColor: '#FEF2F2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  infographicCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  infographicTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infographicCardTitle: { fontSize: 14, fontWeight: '900', color: '#0F172A' },
  peakBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  peakBadgeText: { fontSize: 10, color: '#B91C1C', fontWeight: '800' },
  trendBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 62, marginBottom: 8 },
  trendBarWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  trendBar: { width: '100%', borderRadius: 4 },
  trendDay: { fontSize: 10, color: '#94A3B8', marginTop: 4, fontWeight: '700' },
  infographicCaption: { fontSize: 11, color: '#64748B', textAlign: 'center', marginTop: 4, lineHeight: 16 },
  regionCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  regionList: { gap: 8 },
  regionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  regionName: { width: 110, fontSize: 11, color: '#334155', fontWeight: '700' },
  regionBarBg: { flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  regionBarFill: { height: 8, backgroundColor: '#047857', borderRadius: 4 },
  regionCount: { width: 65, fontSize: 10, color: '#64748B', fontWeight: '600', textAlign: 'right' },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  productImageWrap: { width: '100%', height: 135, position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9' },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mineBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#B91C1C',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  mineBadgeText: { fontSize: 9, color: '#FFFFFF', fontWeight: '900' },
  escrowBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#047857',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  escrowText: { fontSize: 9, color: '#FFFFFF', fontWeight: '800' },
  productInfo: { padding: 12 },
  productTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 4, lineHeight: 18 },
  productPrice: { fontSize: 15, fontWeight: '900', color: '#B91C1C', marginBottom: 4 },
  productMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  productLocation: { fontSize: 11, color: '#64748B', flex: 1, fontWeight: '500' },
  creditBar: { marginTop: 32, paddingVertical: 20, alignItems: 'center', borderTopWidth: 1.5, borderTopColor: '#E2E8F0' },
  creditApp: { fontSize: 14, fontWeight: '900', color: '#B91C1C', letterSpacing: 1.5, marginBottom: 2 },
  creditDev: { fontSize: 12, color: '#334155', fontWeight: '700', marginBottom: 2 },
  creditStudio: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
});

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings, Package, Heart, LogOut, ChevronRight, User, Bell, Edit3, PlusCircle
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

const MenuRow = ({ icon, label, sub, onPress }: { icon: React.ReactNode; label: string; sub?: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
    <View style={styles.menuIcon}>{icon}</View>
    <View style={styles.menuText}>
      <Text style={styles.menuLabel}>{label}</Text>
      {sub ? <Text style={styles.menuSub}>{sub}</Text> : null}
    </View>
    {onPress ? <ChevronRight size={16} color="#94A3B8" /> : null}
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }: any) {
  const { currentUser, products, savedItems, logout } = useApp();

  if (!currentUser) {
    return (
      <SafeAreaView style={[styles.container, styles.loggedOutWrap]} edges={['top']}>
        <View style={styles.loggedOutCard}>
          <View style={styles.loggedOutIcon}>
            <User size={44} color="#94A3B8" />
          </View>
          <Text style={styles.loggedOutTitle}>Sign in to your account</Text>
          <Text style={styles.loggedOutSub}>View your profile, listings, and saved items.</Text>
          <TouchableOpacity style={styles.signInBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const myListings = products.filter(p => p.sellerId === currentUser.id);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.overline}>MY ACCOUNT</Text>
          <Text style={styles.headerTitle}>Merchant Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <User size={32} color="#64748B" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser.name}</Text>
            {currentUser.joinDate ? (
              <Text style={styles.joinText}>
                Member since {new Date(currentUser.joinDate).toLocaleDateString('en-NP', { month: 'long', year: 'numeric' })}
              </Text>
            ) : (
              <Text style={styles.joinText}>{currentUser.location || 'Bazaar Nepal Member'}</Text>
            )}
            {currentUser.phone && <Text style={styles.phoneText}>{currentUser.phone}</Text>}
          </View>
          <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
            <Settings size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{myListings.length}</Text>
            <Text style={styles.statLabel}>Live Listings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{savedItems.length}</Text>
            <Text style={styles.statLabel}>Saved Items</Text>
          </View>
          {currentUser.itemsSold != null && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{currentUser.itemsSold}</Text>
                <Text style={styles.statLabel}>Items Sold</Text>
              </View>
            </>
          )}
        </View>

        {/* My Active Listings with Edit Action */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Your Active Listings ({myListings.length})</Text>
            <TouchableOpacity style={styles.postNewBtn} onPress={() => navigation.navigate('Sell')}>
              <PlusCircle size={14} color="#B91C1C" />
              <Text style={styles.postNewText}>Post New</Text>
            </TouchableOpacity>
          </View>

          {myListings.length > 0 ? (
            myListings.map((item) => (
              <View key={item.id} style={styles.listingCard}>
                <TouchableOpacity
                  style={styles.listingCardContent}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('ProductDetails', { product: item })}
                >
                  <Image source={{ uri: item.images[0] }} style={styles.listingImg} />
                  <View style={styles.listingInfo}>
                    <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.listingPrice}>NPR {item.price.toLocaleString()}</Text>
                    <Text style={styles.listingMeta}>{item.views ?? 0} views • {item.category}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => navigation.navigate('Sell', { editProduct: item })}
                >
                  <Edit3 size={15} color="#B91C1C" />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyListings}>
              <Package size={32} color="#CBD5E1" />
              <Text style={styles.emptyListingsText}>You haven't posted any listings yet.</Text>
            </View>
          )}
        </View>

        {/* Quick Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Services</Text>
          <View style={styles.menuCard}>
            <MenuRow
              icon={<Heart size={18} color="#DC2626" />}
              label="Saved Listings"
              sub={`${savedItems.length} items bookmarked`}
              onPress={() => navigation.navigate('SavedItems')}
            />
            <View style={styles.menuDivider} />
            <MenuRow
              icon={<Bell size={18} color="#B91C1C" />}
              label="Notifications"
              sub="Marketplace activity & alerts"
              onPress={() => navigation.navigate('Notifications')}
            />
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={logout} activeOpacity={0.8}>
          <LogOut size={16} color="#DC2626" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loggedOutWrap: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  overline: { fontSize: 10, fontWeight: '800', color: '#B91C1C', letterSpacing: 1.2 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#0F172A' },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 2 },
  joinText: { fontSize: 11, color: '#047857', fontWeight: '700' },
  phoneText: { fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: '600' },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  statBlock: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  statLabel: { fontSize: 11, fontWeight: '700', color: '#B91C1C', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#E2E8F0' },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '900', color: '#0F172A' },
  postNewBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postNewText: { fontSize: 12, fontWeight: '800', color: '#B91C1C' },
  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  listingCardContent: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  listingImg: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#E2E8F0' },
  listingInfo: { flex: 1 },
  listingTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  listingPrice: { fontSize: 14, fontWeight: '900', color: '#B91C1C', marginBottom: 2 },
  listingMeta: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  editBtnText: { fontSize: 12, fontWeight: '800', color: '#B91C1C' },
  emptyListings: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyListingsText: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  menuSub: { fontSize: 11, color: '#64748B', marginTop: 1 },
  menuDivider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 62 },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  signOutText: { fontSize: 14, color: '#DC2626', fontWeight: '800' },
  loggedOutCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  loggedOutIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loggedOutTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 6 },
  loggedOutSub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20 },
  signInBtn: {
    width: '100%',
    backgroundColor: '#B91C1C',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  signInBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
});

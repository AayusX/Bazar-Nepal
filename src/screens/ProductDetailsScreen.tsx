import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Share,
  Dimensions, Image, Linking, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft, Heart, Share2, ShieldCheck, MapPin, Eye, Clock,
  MessageCircle, Phone, TrendingDown, User, Edit3, Trash2, Package
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { Product } from '../constants/mockData';
import { colors } from '../theme';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen({ route, navigation }: any) {
  const initialProduct: Product | undefined = route?.params?.product;
  const { savedItems, toggleSavedItem, currentUser, products, incrementViews, deleteProduct } = useApp();
  
  // Always find the latest live version from products state
  const product = products.find(p => p.id === initialProduct?.id) || initialProduct;
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (product?.id) {
      incrementViews(product.id);
    }
  }, [product?.id, incrementViews]);

  if (!product) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.notFoundWrap}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color="#0F172A" />
            <Text style={styles.notFoundText}>Listing not found. Tap to return.</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isSaved = savedItems.includes(product.id);
  const images = (product.images && product.images.length > 0)
    ? product.images
    : [];

  const isOwn = currentUser?.id === product.sellerId;
  const sellerPhone = product.sellerPhone || '+977-9801234567';

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Check out "${product.title}" on Bazaar Nepal — NPR ${product.price.toLocaleString()}\nLocation: ${product.location}`,
        title: product.title,
      });
    } catch (_) {}
  }, [product]);

  const handleChatPress = useCallback(() => {
    navigation.navigate('Chat', {
      sellerId: product.sellerId,
      productId: product.id,
      sellerName: product.sellerName || 'Seller',
      sellerPhone: sellerPhone,
    });
  }, [navigation, product, sellerPhone]);

  const handleCallSeller = useCallback(() => {
    const cleanNumber = sellerPhone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      Alert.alert('Call Failed', `Could not dial ${sellerPhone}.`);
    });
  }, [sellerPhone]);

  const handleEditPress = useCallback(() => {
    navigation.navigate('Sell', { editProduct: product });
  }, [navigation, product]);

  const handleDeletePress = useCallback(() => {
    Alert.alert(
      'Delete Listing',
      `Are you sure you want to permanently delete "${product.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteProduct(product.id);
            Alert.alert('Deleted', 'Your listing has been removed.', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          }
        }
      ]
    );
  }, [product, deleteProduct, navigation]);

  const formattedDate = new Date(product.postedAt).toLocaleDateString('en-NP', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Floating Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconCircleBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.row}>
          {isOwn && (
            <TouchableOpacity style={styles.editHeaderBtn} onPress={handleEditPress}>
              <Edit3 size={16} color="#FFFFFF" />
              <Text style={styles.editHeaderText}>Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.iconCircleBtn} onPress={() => toggleSavedItem(product.id)}>
            <Heart size={20} color={isSaved ? '#DC2626' : '#0F172A'} fill={isSaved ? '#DC2626' : 'transparent'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircleBtn} onPress={handleShare}>
            <Share2 size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Multi-Photo Carousel Gallery */}
        <View style={styles.gallery}>
          {images.length > 0 ? (
            <Image
              source={{ uri: images[activeImg] }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Package size={42} color="#94A3B8" />
              <Text style={styles.imagePlaceholderText}>No photo uploaded</Text>
            </View>
          )}
          {images.length > 1 && (
            <View style={styles.imageDots}>
              {images.map((_, idx) => (
                <TouchableOpacity
                  key={`dot_${idx}`}
                  onPress={() => setActiveImg(idx)}
                  style={[styles.dot, idx === activeImg && styles.dotActive]}
                />
              ))}
            </View>
          )}

          {/* Photo Counter Badge */}
          {images.length > 1 && (
            <View style={styles.photoCountBadge}>
              <Text style={styles.photoCountText}>{activeImg + 1}/{images.length}</Text>
            </View>
          )}
        </View>

        {/* Thumbnail Preview Strip */}
        {images.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbStrip}>
            {images.map((imgUri, i) => (
              <TouchableOpacity
                key={`thumb_${i}`}
                onPress={() => setActiveImg(i)}
                style={[styles.thumbWrap, i === activeImg && styles.thumbWrapActive]}
              >
                <Image source={{ uri: imgUri }} style={styles.thumbImg} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Main Body */}
        <View style={styles.body}>
          {/* Own Listing Management Banner */}
          {isOwn && (
            <View style={styles.ownBanner}>
              <View style={styles.ownBannerLeft}>
                <Text style={styles.ownBannerTitle}>Your Active Listing</Text>
                <Text style={styles.ownBannerSub}>Live on Bazaar Nepal · Visible to buyers</Text>
              </View>
              <View style={styles.ownActionRow}>
                <TouchableOpacity style={styles.ownEditBtn} onPress={handleEditPress}>
                  <Edit3 size={15} color="#B91C1C" />
                  <Text style={styles.ownEditText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ownDeleteBtn} onPress={handleDeletePress}>
                  <Trash2 size={15} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Escrow Badge */}
          {product.isEscrowEligible && (
            <View style={styles.escrowBadge}>
              <ShieldCheck size={14} color="#047857" />
              <Text style={styles.escrowText}>Bazaar Nepal Escrow Protected</Text>
            </View>
          )}

          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>NPR {product.price.toLocaleString()}</Text>

          {/* Location & Meta Chips with Real-Time Views */}
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <MapPin size={13} color="#B91C1C" />
              <Text style={styles.metaText}>{product.location}</Text>
            </View>
            <View style={styles.metaChip}>
              <Eye size={13} color="#047857" />
              <Text style={[styles.metaText, { color: '#047857', fontWeight: '700' }]}>{product.views ?? 0} views</Text>
            </View>
            <View style={styles.metaChip}>
              <Clock size={13} color="#64748B" />
              <Text style={styles.metaText}>{formattedDate}</Text>
            </View>
          </View>

          {/* MANDATORY CONTACT & SELLER CARD */}
          <View style={styles.sellerCard}>
            <View style={styles.sellerTopRow}>
              <View style={styles.sellerAvatar}>
                <User size={24} color="#64748B" />
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{product.sellerName || 'Bazaar Member'}</Text>
              </View>
            </View>

            {/* Direct Contact Phone */}
            <View style={styles.phoneBox}>
              <View style={styles.phoneInfo}>
                <Text style={styles.phoneLabel}>Seller Mobile Number</Text>
                <Text style={styles.phoneValue}>{sellerPhone}</Text>
              </View>
              {!isOwn && (
                <TouchableOpacity style={styles.callActionButton} onPress={handleCallSeller} activeOpacity={0.85}>
                  <Phone size={16} color="#FFFFFF" />
                  <Text style={styles.callActionText}>Call Now</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Description</Text>
            <Text style={styles.descText}>{product.description}</Text>
          </View>

          {/* INFOGRAPHIC: 4-Step Escrow Trade Protection */}
          <View style={styles.infographicCard}>
            <View style={styles.infographicHeader}>
              <ShieldCheck size={18} color="#047857" />
              <Text style={styles.infographicTitle}>Safe Trade Infographic</Text>
            </View>
            <View style={styles.stepsContainer}>
              <View style={styles.stepItem}>
                <View style={styles.stepCircle}><Text style={styles.stepNumber}>1</Text></View>
                <Text style={styles.stepLabel}>Connect & Agree</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepItem}>
                <View style={styles.stepCircle}><Text style={styles.stepNumber}>2</Text></View>
                <Text style={styles.stepLabel}>Deposit Escrow</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepItem}>
                <View style={styles.stepCircle}><Text style={styles.stepNumber}>3</Text></View>
                <Text style={styles.stepLabel}>Inspect Item</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepItem}>
                <View style={[styles.stepCircle, { backgroundColor: '#047857' }]}><Text style={[styles.stepNumber, { color: '#fff' }]}>4</Text></View>
                <Text style={styles.stepLabel}>Release Funds</Text>
              </View>
            </View>
          </View>

          {/* Price History */}
          {product.priceHistory && product.priceHistory.length > 1 && (
            <View style={styles.card}>
              <View style={styles.priceHistoryHeader}>
                <TrendingDown size={16} color="#047857" />
                <Text style={styles.cardHeader}>Price Dynamics in Nepal</Text>
              </View>
              {product.priceHistory.map((item, idx) => (
                <View key={`hist_${idx}`} style={styles.historyRow}>
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <Text style={styles.historyPrice}>NPR {item.price.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          )}

        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      {!isOwn ? (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.chatBtn} onPress={handleChatPress} activeOpacity={0.85}>
            <MessageCircle size={18} color="#B91C1C" />
            <Text style={styles.chatBtnText}>Chat with Seller</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callFooterBtn} onPress={handleCallSeller} activeOpacity={0.85}>
            <Phone size={18} color="#FFFFFF" />
            <Text style={styles.callFooterBtnText}>Call Seller</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.editFooterBtn} onPress={handleEditPress} activeOpacity={0.85}>
            <Edit3 size={18} color="#FFFFFF" />
            <Text style={styles.editFooterBtnText}>Edit This Listing</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  notFoundWrap: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  notFoundText: { fontSize: 16, color: '#DC2626', fontWeight: '700' },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  editHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#B91C1C',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editHeaderText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scroll: { paddingBottom: 120 },
  gallery: { width, height: 320, backgroundColor: '#CBD5E1', position: 'relative' },
  mainImage: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9' },
  imagePlaceholderText: { fontSize: 12, color: '#94A3B8', marginTop: 8, fontWeight: '600' },
  imageDots: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)' },
  dotActive: { backgroundColor: '#FFFFFF', width: 20 },
  photoCountBadge: {
    position: 'absolute',
    bottom: 12,
    right: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoCountText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  thumbStrip: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFFFFF' },
  thumbWrap: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  thumbWrapActive: { borderColor: '#B91C1C', borderWidth: 2.5 },
  thumbImg: { width: '100%', height: '100%' },
  body: { padding: 18, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#F8FAFC', marginTop: -14 },
  ownBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    marginBottom: 14,
  },
  ownBannerLeft: { flex: 1 },
  ownBannerTitle: { fontSize: 14, fontWeight: '800', color: '#B91C1C' },
  ownBannerSub: { fontSize: 11, color: '#991B1B', marginTop: 2 },
  ownActionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ownEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  ownEditText: { fontSize: 12, color: '#B91C1C', fontWeight: '800' },
  ownDeleteBtn: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  escrowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  escrowText: { fontSize: 11, color: '#047857', fontWeight: '800' },
  title: { fontSize: 22, fontWeight: '900', color: '#0F172A', lineHeight: 28, marginBottom: 8 },
  price: { fontSize: 28, fontWeight: '900', color: '#B91C1C', marginBottom: 14, letterSpacing: -0.5 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metaText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  sellerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  sellerTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  verifiedText: { fontSize: 11, color: '#047857', fontWeight: '700' },
  phoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  phoneInfo: { flex: 1 },
  phoneLabel: { fontSize: 10, color: '#991B1B', fontWeight: '700', textTransform: 'uppercase' },
  phoneValue: { fontSize: 14, fontWeight: '900', color: '#B91C1C', marginTop: 2 },
  callActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#B91C1C',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callActionText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  cardHeader: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  descText: { fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' },
  infographicCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    marginBottom: 16,
  },
  infographicHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  infographicTitle: { fontSize: 14, fontWeight: '800', color: '#047857' },
  stepsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepItem: { alignItems: 'center', width: 68 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: '#047857',
  },
  stepNumber: { fontSize: 12, fontWeight: '900', color: '#047857' },
  stepLabel: { fontSize: 10, color: '#065F46', textAlign: 'center', fontWeight: '700', lineHeight: 13 },
  stepLine: { flex: 1, height: 2, backgroundColor: '#A7F3D0', marginBottom: 16 },
  priceHistoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historyDate: { fontSize: 12, color: '#64748B' },
  historyPrice: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 24,
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
  },
  chatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.8,
    borderColor: '#B91C1C',
    backgroundColor: '#FEF2F2',
  },
  chatBtnText: { fontSize: 14, color: '#B91C1C', fontWeight: '800' },
  callFooterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#B91C1C',
  },
  callFooterBtnText: { fontSize: 14, color: '#FFFFFF', fontWeight: '900' },
  editFooterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#B91C1C',
  },
  editFooterBtnText: { fontSize: 15, color: '#FFFFFF', fontWeight: '900' },
});

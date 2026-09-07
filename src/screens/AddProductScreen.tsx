import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, ScrollView, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon, MapPin, DollarSign, Phone, ShieldCheck, Check, X, Trash2, Edit3 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';
import { CATEGORIES, Product } from '../constants/mockData';
import { colors } from '../theme';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export default function AddProductScreen({ route, navigation }: any) {
  const editProduct: Product | undefined = route?.params?.editProduct;
  const isEditing = !!editProduct;

  const { addProduct, updateProduct, deleteProduct, currentUser } = useApp();

  const [title, setTitle] = useState(editProduct?.title || '');
  const [description, setDescription] = useState(editProduct?.description || '');
  const [price, setPrice] = useState(editProduct ? String(editProduct.price) : '');
  const [phone, setPhone] = useState(editProduct?.sellerPhone || currentUser?.phone || '+977-9801234567');
  const [selectedCat, setSelectedCat] = useState<string | null>(editProduct?.category || null);
  const [location, setLocation] = useState(editProduct?.location || currentUser?.location || 'New Road, Kathmandu');
  const [isEscrow, setIsEscrow] = useState(editProduct ? editProduct.isEscrowEligible : true);
  const [images, setImages] = useState<string[]>(editProduct?.images || []);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editProduct) {
      setTitle(editProduct.title);
      setDescription(editProduct.description);
      setPrice(String(editProduct.price));
      setPhone(editProduct.sellerPhone || '+977-9801234567');
      setSelectedCat(editProduct.category);
      setLocation(editProduct.location);
      setIsEscrow(editProduct.isEscrowEligible);
      setImages(editProduct.images || []);
    }
  }, [editProduct]);

  const validateAndAddAsset = (asset: ImagePicker.ImagePickerAsset) => {
    const size = asset.fileSize;
    if (typeof size === 'number' && size > MAX_IMAGE_SIZE_BYTES) {
      const mbSize = (size / (1024 * 1024)).toFixed(1);
      Alert.alert(
        'Photo Too Large',
        `This photo is ${mbSize} MB. Please select or crop a photo smaller than 5 MB.`
      );
      return;
    }

    if (images.length >= 5) {
      Alert.alert('Maximum Reached', 'You can upload up to 5 photos per listing.');
      return;
    }

    setImages(prev => [...prev, asset.uri]);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        result.assets.forEach(asset => validateAndAddAsset(asset));
      }
    } catch (e) {
      Alert.alert('Gallery Error', 'Could not open image gallery.');
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Camera Permission', 'Please allow camera access in device settings to take product photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        validateAndAddAsset(result.assets[0]);
      }
    } catch (e) {
      Alert.alert('Camera Error', 'Could not access device camera.');
    }
  };

  const removePhoto = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = useCallback(() => {
    if (!editProduct) return;
    Alert.alert(
      'Delete Listing',
      `Are you sure you want to permanently remove "${editProduct.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteProduct(editProduct.id);
            Alert.alert('Listing Deleted', 'Your item has been removed.', [
              { text: 'OK', onPress: () => navigation.navigate('Home') }
            ]);
          }
        }
      ]
    );
  }, [editProduct, deleteProduct, navigation]);

  const handleSubmit = useCallback(async () => {
    if (!currentUser) {
      Alert.alert(
        'Sign in required',
        'Please sign in to your Bazaar Nepal account before posting a listing.',
        [{ text: 'Not now' }, { text: 'Sign in', onPress: () => navigation.navigate('Login') }]
      );
      return;
    }
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a clear title for your product.');
      return;
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price in NPR.');
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 9) {
      Alert.alert(
        'Mandatory Contact Required',
        'Please enter a valid Nepali contact mobile number (e.g., 98XXXXXXXX) so buyers can reach you.'
      );
      return;
    }
    if (!selectedCat) {
      Alert.alert('Select Category', 'Please choose a category for your listing.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Missing Location', 'Please enter city and area (e.g., New Road, Kathmandu).');
      return;
    }
    if (images.length === 0) {
      Alert.alert('Missing Photos', 'Please add at least 1 photo of the product.');
      return;
    }

    setSubmitting(true);

    if (isEditing && editProduct) {
      await updateProduct(editProduct.id, {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        sellerPhone: phone.trim(),
        category: selectedCat,
        location: location.trim(),
        isEscrowEligible: isEscrow,
        images: images,
      });
      setSubmitting(false);
      Alert.alert(
        'Listing Updated',
        'Your changes are now live across Bazaar Nepal!',
        [{ text: 'View Updated Listing', onPress: () => navigation.navigate('Home') }]
      );
    } else {
      const res = await addProduct({
        title: title.trim(),
        description: description.trim() || 'No description provided by seller.',
        price: Number(price),
        currency: 'NPR',
        category: selectedCat,
        sellerPhone: phone.trim(),
        location: location.trim(),
        isEscrowEligible: isEscrow,
        images: images,
      });
      setSubmitting(false);

      if (res.ok) {
        Alert.alert(
          'Listing Published Live',
          'Your product is now live on Bazaar Nepal! Buyers across Nepal can now discover, chat, and call you directly.',
          [{ text: 'View on Home', onPress: () => navigation.navigate('Home') }]
        );
      }
    }
  }, [isEditing, editProduct, title, price, phone, selectedCat, location, description, isEscrow, images, updateProduct, addProduct, navigation, currentUser]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <X size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Listing' : 'Post New Listing'}</Text>
        {isEditing ? (
          <TouchableOpacity style={styles.trashBtn} onPress={handleDelete}>
            <Trash2 size={18} color="#DC2626" />
          </TouchableOpacity>
        ) : <View style={{ width: 38 }} />}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          
          {/* Photo Section with Multi-photo Support */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Product Photos ({images.length}/5)</Text>
            <Text style={styles.sectionNotice}>Max 5 MB each</Text>
          </View>

          <View style={styles.photoBox}>
            {images.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoStrip}>
                {images.map((uri, idx) => (
                  <View key={`img_${idx}`} style={styles.photoThumbWrap}>
                    <Image source={{ uri }} style={styles.photoThumb} />
                    <TouchableOpacity style={styles.removePhotoBtn} onPress={() => removePhoto(idx)}>
                      <X size={14} color="#fff" />
                    </TouchableOpacity>
                    {idx === 0 && (
                      <View style={styles.coverBadge}>
                        <Text style={styles.coverBadgeText}>Cover</Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            )}

            {images.length < 5 && (
              <View style={styles.photoActionRow}>
                <TouchableOpacity style={styles.photoActionBtn} onPress={takePhoto} activeOpacity={0.8}>
                  <Camera size={20} color="#B91C1C" />
                  <Text style={styles.photoActionText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoActionBtn} onPress={pickImage} activeOpacity={0.8}>
                  <ImageIcon size={20} color="#B91C1C" />
                  <Text style={styles.photoActionText}>From Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Details Section */}
          <Text style={styles.sectionTitle}>Listing Details</Text>
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. MacBook Air M2 8GB / 256GB"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
              maxLength={80}
            />

            <Text style={styles.inputLabel}>Price in NPR *</Text>
            <View style={styles.inputWithIcon}>
              <Text style={styles.currencyPrefix}>NPR</Text>
              <TextInput
                style={[styles.textInput, { flex: 1, borderWidth: 0, paddingLeft: 8 }]}
                placeholder="0"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            {/* MANDATORY CONTACT INFO */}
            <View style={styles.mandatoryContactBox}>
              <View style={styles.mandatoryHeaderRow}>
                <Phone size={16} color="#B91C1C" />
                <Text style={styles.mandatoryContactTitle}>Seller Mobile Number (Mandatory) *</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="+977-98XXXXXXXX"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <Text style={styles.mandatoryNotice}>
                Buyers can directly call or message you for faster inspection and delivery.
              </Text>
            </View>

            <Text style={styles.inputLabel}>City / Location *</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={18} color="#94A3B8" />
              <TextInput
                style={[styles.textInput, { flex: 1, borderWidth: 0, paddingLeft: 8 }]}
                placeholder="e.g. New Road, Kathmandu"
                placeholderTextColor="#94A3B8"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Provide details about condition, bill, box, battery health, or reason for selling..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Category Chips */}
          <Text style={styles.sectionTitle}>Category *</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, selectedCat === cat.name && styles.catChipActive]}
                onPress={() => setSelectedCat(cat.name)}
                activeOpacity={0.8}
              >
                <Text style={[styles.catChipText, selectedCat === cat.name && styles.catChipTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Escrow Protection */}
          <TouchableOpacity
            style={styles.escrowCard}
            onPress={() => setIsEscrow(!isEscrow)}
            activeOpacity={0.85}
          >
            <View style={styles.escrowLeft}>
              <View style={styles.escrowTitleRow}>
                <ShieldCheck size={18} color="#047857" />
                <Text style={styles.escrowTitle}>Escrow Trade Protection</Text>
              </View>
              <Text style={styles.escrowDesc}>
                Buyers pay into Bazaar Nepal escrow. Funds are securely released when inspection is confirmed.
              </Text>
            </View>
            <View style={[styles.checkbox, isEscrow && styles.checkboxActive]}>
              {isEscrow && <Check size={14} color="#fff" />}
            </View>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Publish / Update Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.publishBtn, submitting && styles.publishBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.85}
        >
          <Text style={styles.publishBtnText}>
            {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Listing'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  flex: { flex: 1 },
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
  trashBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  scroll: { padding: 16, paddingBottom: 40 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginTop: 14, marginBottom: 8 },
  sectionNotice: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  photoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  photoStrip: { flexDirection: 'row', marginBottom: 12 },
  photoThumbWrap: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  photoThumb: { width: '100%', height: '100%' },
  removePhotoBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#B91C1C',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  coverBadgeText: { fontSize: 9, color: '#fff', fontWeight: '800' },
  photoActionRow: { flexDirection: 'row', gap: 10 },
  photoActionBtn: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#B91C1C',
    backgroundColor: '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoActionText: { fontSize: 13, color: '#B91C1C', fontWeight: '700' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 6, marginTop: 10 },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
  },
  currencyPrefix: { fontSize: 14, fontWeight: '800', color: '#B91C1C' },
  textArea: { height: 90, textAlignVertical: 'top' },
  mandatoryContactBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    marginVertical: 12,
  },
  mandatoryHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  mandatoryContactTitle: { fontSize: 13, fontWeight: '800', color: '#B45309' },
  mandatoryNotice: { fontSize: 11, color: '#92400E', marginTop: 6, lineHeight: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  catChipActive: { backgroundColor: '#B91C1C', borderColor: '#B91C1C' },
  catChipText: { fontSize: 13, color: '#475569', fontWeight: '700' },
  catChipTextActive: { color: '#FFFFFF' },
  escrowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    marginBottom: 20,
  },
  escrowLeft: { flex: 1, paddingRight: 12 },
  escrowTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  escrowTitle: { fontSize: 14, fontWeight: '800', color: '#047857' },
  escrowDesc: { fontSize: 11, color: '#065F46', lineHeight: 16 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: '#047857' },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
  },
  publishBtn: {
    backgroundColor: '#B91C1C',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  publishBtnDisabled: { backgroundColor: '#CBD5E1' },
  publishBtnText: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
});

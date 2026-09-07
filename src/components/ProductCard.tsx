import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, ShieldCheck } from 'lucide-react-native';
import { Product } from '../constants/mockData';
import { colors, radius, spacing, useGridCardWidth } from '../theme';
import RemoteImage from './RemoteImage';
import PriceText from './PriceText';

type ProductCardProps = {
  product: Product;
  onPress: () => void;
  isSaved?: boolean;
  onSave?: () => void;
  width?: number;
};

export default function ProductCard({
  product,
  onPress,
  isSaved = false,
  onSave,
  width,
}: ProductCardProps) {
  const cardWidth = width ?? useGridCardWidth();

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={product.title}
    >
      <RemoteImage uri={product.images[0]} style={styles.image}>
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={onSave}
          disabled={!onSave}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? 'Remove from saved' : 'Save item'}
        >
          <Heart
            size={15}
            color={isSaved ? colors.danger : colors.textSecondary}
            fill={isSaved ? colors.danger : 'transparent'}
          />
        </TouchableOpacity>
        {product.isEscrowEligible && (
          <View style={styles.escrowBadge}>
            <ShieldCheck size={10} color={colors.brand} />
            <Text style={styles.escrowText}>Escrow</Text>
          </View>
        )}
      </RemoteImage>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <PriceText amount={product.price} size="md" />
        <Text style={styles.location} numberOfLines={1}>{product.location}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: '100%', height: 130, position: 'relative' },
  heartBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 6,
    elevation: 2,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  escrowBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.brandSurface,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  escrowText: { fontSize: 10, color: colors.brand, fontWeight: '700' },
  body: { padding: spacing.md },
  title: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 4, lineHeight: 18 },
  location: { fontSize: 11, color: colors.textMuted, fontWeight: '500', marginTop: 4 },
});

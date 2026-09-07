import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';

type BadgeProps = {
  label: string;
  variant?: 'brand' | 'neutral' | 'danger' | 'warning';
  icon?: React.ReactNode;
  style?: ViewStyle;
};

export default function Badge({ label, variant = 'neutral', icon, style }: BadgeProps) {
  return (
    <View style={[styles.base, variants[variant].bg, style]}>
      {icon}
      <Text style={[styles.label, variants[variant].text]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  label: { fontSize: 11, fontWeight: '700' },
});

const variants = {
  brand: {
    bg: { backgroundColor: colors.brandSurface } as ViewStyle,
    text: { color: colors.brand },
  },
  neutral: {
    bg: { backgroundColor: colors.surfaceMuted } as ViewStyle,
    text: { color: colors.textSecondary },
  },
  danger: {
    bg: { backgroundColor: colors.dangerSurface } as ViewStyle,
    text: { color: colors.danger },
  },
  warning: {
    bg: { backgroundColor: '#FFF7ED' } as ViewStyle,
    text: { color: colors.warning },
  },
};

import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { colors, typography } from '../theme';

type PriceTextProps = {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  style?: TextStyle;
};

export default function PriceText({ amount, size = 'md', style }: PriceTextProps) {
  return <Text style={[sizeStyles[size], style]}>NPR {amount.toLocaleString()}</Text>;
}

const sizeStyles = {
  sm: { fontSize: 14, fontWeight: '700', color: colors.brand } as TextStyle,
  md: { ...typography.price },
  lg: { ...typography.priceLarge },
};

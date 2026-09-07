import React from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator, StyleSheet,
  ViewStyle, TextStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[size],
        variantStyles[variant].container,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.brand : colors.onBrand}
        />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, variantStyles[variant].label, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  md: { paddingVertical: 12, paddingHorizontal: spacing.lg, gap: spacing.sm },
  lg: { paddingVertical: 15, paddingHorizontal: spacing.lg, gap: spacing.sm },
  disabled: { opacity: 0.5 },
  label: { ...typography.button },
});

const variantStyles = {
  primary: {
    container: { backgroundColor: colors.brand } as ViewStyle,
    label: { color: colors.onBrand } as TextStyle,
  },
  secondary: {
    container: { backgroundColor: colors.brandSurface } as ViewStyle,
    label: { color: colors.brand } as TextStyle,
  },
  outline: {
    container: { borderWidth: 1.5, borderColor: colors.borderStrong, backgroundColor: colors.surface } as ViewStyle,
    label: { color: colors.text } as TextStyle,
  },
  ghost: {
    container: { backgroundColor: 'transparent' } as ViewStyle,
    label: { color: colors.brand } as TextStyle,
  },
  danger: {
    container: { backgroundColor: colors.dangerSurface, borderWidth: 1.5, borderColor: colors.dangerBorder } as ViewStyle,
    label: { color: colors.danger } as TextStyle,
  },
};

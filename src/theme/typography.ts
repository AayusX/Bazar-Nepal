import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography = {
  overline: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.brand,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  } as TextStyle,

  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  } as TextStyle,

  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  } as TextStyle,

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  } as TextStyle,

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  } as TextStyle,

  body: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  } as TextStyle,

  bodySmall: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  } as TextStyle,

  caption: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  } as TextStyle,

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  } as TextStyle,

  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.brand,
  } as TextStyle,

  priceLarge: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: -0.5,
  } as TextStyle,

  button: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onBrand,
  } as TextStyle,

  buttonSmall: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.brand,
  } as TextStyle,
};

export type Typography = typeof typography;

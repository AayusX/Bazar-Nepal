import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MessageCircle, X } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors, radius, shadows, typography } from '../theme';
import { navigationRef, parseConvKeyForNav } from '../navigation/navigation';

const AUTO_DISMISS_MS = 6000;

/**
 * Themed in-app chat popup shown when a chat push arrives while Bazaar Nepal
 * is open. Tapping it jumps straight into that conversation.
 */
export default function ChatPopup() {
  const { chatPopup, dismissChatPopup } = useApp();
  const translateY = useRef(new Animated.Value(-160)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!chatPopup) return;
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
    timerRef.current = setTimeout(dismissChatPopup, AUTO_DISMISS_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [chatPopup, translateY, opacity, dismissChatPopup]);

  if (!chatPopup) return null;

  const onOpen = () => {
    dismissChatPopup();
    const { sellerId, productId } = parseConvKeyForNav(chatPopup.convKey);
    if (navigationRef.isReady() && sellerId && productId) {
      navigationRef.navigate('Chat', { sellerId, productId });
    }
  };

  return (
    <Animated.View style={[styles.wrap, { opacity, transform: [{ translateY }] }]} pointerEvents="box-none">
      <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onOpen}>
        <View style={styles.icon}>
          <MessageCircle color={colors.onBrand} size={20} strokeWidth={2.4} />
        </View>
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>{chatPopup.title}</Text>
          <Text style={styles.text} numberOfLines={2}>{chatPopup.body}</Text>
        </View>
        <Pressable hitSlop={10} onPress={dismissChatPopup} style={styles.close}>
          <X color={colors.textMuted} size={16} strokeWidth={2.6} />
        </Pressable>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 54,
    left: 12,
    right: 12,
    zIndex: 2000,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.floating,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, marginLeft: 12, marginRight: 8 },
  title: {
    ...typography.label,
    color: colors.brand,
    marginBottom: 2,
  },
  text: { ...typography.bodySmall, color: colors.text },
  close: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
});
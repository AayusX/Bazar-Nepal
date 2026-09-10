import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import ChatPopup from './src/components/ChatPopup';
import * as Notifications from 'expo-notifications';
import { setupNotificationHandler } from './src/services/notifications';
import { navigateToChat, navigateToProduct } from './src/navigation/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, typography } from './src/theme';

const SPLASH_MS = 1400;

function Splash({ onDone }: { onDone: () => void }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 320, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.04, duration: 320, useNativeDriver: true }),
      ]).start(() => onDone());
    }, SPLASH_MS);
    return () => clearTimeout(timer);
  }, [opacity, scale, onDone]);

  return (
    <Animated.View style={[styles.splash, { opacity, transform: [{ scale }] }]}>
      <Text style={styles.wordmark}>BAZAAR NEPAL</Text>
      <Text style={styles.tagline}>Buy and sell locally</Text>
    </Animated.View>
  );
}

/**
 * Glues push notifications to the UI:
 * - foreground chats → themed in-app popup
 * - notification taps (cold start or while running) → navigate
 */
function NotificationCenter() {
  const { products, showChatPopup } = useApp();
  const productsRef = useRef(products);
  useEffect(() => { productsRef.current = products; }, [products]);

  const handleNotificationData = useCallback((n: Notifications.Notification) => {
    const data = (n.request.content.data || {}) as Record<string, any>;
    if (data?.type === 'chat' && data.convKey) {
      showChatPopup({
        convKey: String(data.convKey),
        title: n.request.content.title || 'New message',
        body: n.request.content.body || '',
      });
    }
  }, [showChatPopup]);

  useEffect(() => {
    setupNotificationHandler();

    const received = Notifications.addNotificationReceivedListener(handleNotificationData);
    const responded = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = (response.notification.request.content.data || {}) as Record<string, any>;
      const type = String(data?.type || '');
      if (data?.convKey) {
        navigateToChat(String(data.convKey));
      } else if (data?.productId && (type === 'new_listing' || type === 'views')) {
        navigateToProduct(String(data.productId), productsRef.current);
      }
    });

    // Cold start: app launched directly by tapping a notification.
    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (!response) return;
        const data = (response.notification.request.content.data || {}) as Record<string, any>;
        if (data?.convKey) navigateToChat(String(data.convKey));
        else if (data?.productId) navigateToProduct(String(data.productId), productsRef.current);
      })
      .catch(() => {});

    return () => {
      received.remove();
      responded.remove();
    };
  }, [handleNotificationData, productsRef]);

  return null;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <View style={styles.root}>
          <AppNavigator />
          <NotificationCenter />
          <ChatPopup />
          {showSplash && <Splash onDone={() => setShowSplash(false)} />}
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  splash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  wordmark: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: 4,
  },
  tagline: { ...typography.bodySmall, marginTop: 10 },
});
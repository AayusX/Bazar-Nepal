import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './src/api/client';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
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

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="dark" />
          <View style={styles.root}>
            <AppNavigator />
            {showSplash && <Splash onDone={() => setShowSplash(false)} />}
          </View>
        </AppProvider>
      </SafeAreaProvider>
    </ApolloProvider>
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

/**
 * Bazaar Nepal — Push notification plumbing (expo-notifications).
 *
 * - Creates the branded "bazaar_nepal" Android channel (color #B91C1C).
 * - Registers the device's raw FCM token with the backend so the server can
 *   target this phone with new-listing, view-milestone and chat pushes.
 * - Exposes handlers/listeners used by the app shell to show the in-app
 *   themed chat popup and to navigate on notification taps.
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { registerPushToken } from '../services/api';

export const CHANNEL_ID = 'bazaar_nepal';
export const THEME_COLOR = '#B91C1C';

/** Lets the OS banner show while the app is running (foreground). */
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Bazaar Nepal',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 200, 180, 200],
    lightColor: THEME_COLOR,
  });
}

/**
 * Requests permission and registers the raw FCM device token with the
 * server. Returns the token (or null when permission was denied / not a
 * physical device). Safe to call repeatedly — the server just overwrites it.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  try {
    if (!Device.isDevice) return null;
    await ensureChannel();

    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== 'granted') return null;

    const deviceToken = await Notifications.getDevicePushTokenAsync();
    const token = String((deviceToken as any).data);
    if (!token) return null;

    await registerPushToken(token);
    console.log('[push] device registered', token.slice(0, 18) + '…');
    return token;
  } catch (e) {
    console.warn('[push] registration failed:', e);
    return null;
  }
}

/** Opens the chat screen for a conv_<sellerId>_<productId> key. */
export function parseConvKey(convKey: string): { sellerId: string; productId: string } {
  const rest = convKey.startsWith('conv_') ? convKey.slice(5) : convKey;
  const idx = rest.lastIndexOf('_p_');
  if (idx === -1) return { sellerId: '', productId: '' };
  return { sellerId: rest.slice(0, idx), productId: rest.slice(idx + 3) };
}
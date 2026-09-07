import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PROD_API_URL = 'https://server-production-b669.up.railway.app/graphql';
const PROD_WS_URL = 'wss://server-production-b669.up.railway.app/subscriptions';

const getDevApiHost = () => {
  const hostUri = Constants.expoConfig?.hostUri || (Constants.manifest as any)?.debuggerHost;
  if (typeof hostUri === 'string' && hostUri.length > 0) {
    return hostUri.split(':')[0];
  }

  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }

  return 'localhost';
};

const DEV_API_HOST = getDevApiHost();
const useLocalDevApi = process.env.EXPO_PUBLIC_USE_LOCAL_API === '1';

export const API_URL = __DEV__
  ? (useLocalDevApi ? `http://${DEV_API_HOST}:8080/graphql` : PROD_API_URL)
  : PROD_API_URL;

export const WS_URL = __DEV__
  ? (useLocalDevApi ? `ws://${DEV_API_HOST}:8080/subscriptions` : PROD_WS_URL)
  : PROD_WS_URL;

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
};

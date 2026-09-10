import { createNavigationContainerRef } from '@react-navigation/native';

/**
 * Global navigation reference. Attached to the NavigationContainer in
 * AppNavigator so notification taps can navigate from anywhere (including
 * the app shell / ChatPopup which render outside the navigator tree).
 */
export const navigationRef = createNavigationContainerRef<Record<string, object | undefined>>();

/** Splits a conv_<sellerId>_<productId> key into its parts. */
export function parseConvKeyForNav(convKey: string): { sellerId: string; productId: string } {
  const rest = convKey.startsWith('conv_') ? convKey.slice(5) : convKey;
  const idx = rest.lastIndexOf('_p_');
  if (idx === -1) return { sellerId: '', productId: '' };
  return { sellerId: rest.slice(0, idx), productId: rest.slice(idx + 3) };
}

/** Opens the chat screen for a conversation key. */
export function navigateToChat(convKey: string) {
  const { sellerId, productId } = parseConvKeyForNav(convKey);
  if (!navigationRef.isReady() || !sellerId || !productId) return;
  navigationRef.navigate('Chat', { sellerId, productId });
}

/** Opens the product details screen, falling back to a live fetch. */
export async function navigateToProduct(productId: string, products: { id: string }[]) {
  if (!navigationRef.isReady()) return;
  const local = products.find((p) => p.id === productId);
  if (local) {
    navigationRef.navigate('ProductDetails', { product: local });
    return;
  }
  try {
    const { fetchProduct } = await import('../services/api');
    const remote = await fetchProduct(productId);
    if (remote) navigationRef.navigate('ProductDetails', { product: remote });
  } catch {
    // Product not found — nothing to navigate to.
  }
}
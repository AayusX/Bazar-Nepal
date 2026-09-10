import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, User, ChatMessage } from '../constants/mockData';
import * as API from '../services/api';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  type: 'listing' | 'message' | 'offer' | 'escrow' | 'system';
  createdAt: string;
  isRead: boolean;
};

type AppContextType = {
  products: Product[];
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  filteredProducts: Product[];
  getSeller: (id: string) => User | undefined;
  savedItems: string[];
  toggleSavedItem: (id: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  isServerConnected: boolean;

  // Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'postedAt' | 'views' | 'priceHistory'> & { sellerPhone: string }) => Promise<{ ok: boolean; product: Product }>;
  updateProduct: (productId: string, updatedFields: Partial<Product>) => Promise<{ ok: boolean }>;
  deleteProduct: (productId: string) => Promise<{ ok: boolean }>;
  incrementViews: (productId: string) => void;

  // Chat Engine
  chatMessages: Record<string, ChatMessage[]>;
  sendMessage: (convKey: string, text: string, sellerName?: string) => Promise<void>;
  getChatForConversation: (convKey: string) => ChatMessage[];

  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationsRead: () => void;
  clearNotifications: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const SELLER_AUTO_RESPONSES: string[] = [];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQueryRaw] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(false);

  // Poll server for fresh product data every 15 seconds
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const productsRef = useRef<Product[]>([]);
  useEffect(() => { productsRef.current = products; }, [products]);

  // Offline-created listings are persisted under a per-listing key so they can
  // be pushed to the server automatically once the connection returns.
  const PENDING_PREFIX = '@bazaar_pending_';
  const pendingKey = (id: string) => PENDING_PREFIX + id;

  // ── Load from AsyncStorage on startup ──────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@bazaar_user_v4');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          // Only restore real server accounts (they carry an email). This also
          // purges any legacy mock user saved by earlier app versions.
          if (parsed && parsed.email && parsed.id) {
            setCurrentUser(parsed);
          } else {
            await AsyncStorage.removeItem('@bazaar_user_v4').catch(() => {});
          }
        }

        const storedSaved = await AsyncStorage.getItem('@bazaar_saved_v4');
        if (storedSaved) setSavedItems(JSON.parse(storedSaved));

        const storedSearches = await AsyncStorage.getItem('@bazaar_searches_v4');
        if (storedSearches) setRecentSearches(JSON.parse(storedSearches));

        const storedChats = await AsyncStorage.getItem('@bazaar_chats_v4');
        if (storedChats) setChatMessages(JSON.parse(storedChats));

        const storedNotifs = await AsyncStorage.getItem('@bazaar_notifs_v4');
        if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
      } catch (e) {
        console.error('Failed to load local storage', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // ── Notification helpers ───────────────────────────────────────
  const addNotification = useCallback((title: string, body: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title, body, type,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  // ── Connect to shared server & sync products ───────────────────
  const syncFromServer = useCallback(async () => {
    try {
      const serverProducts = await API.fetchAllProducts();
      setIsServerConnected(true);

      // Push any listings this device created while offline to the server.
      const pushedProducts: Product[] = [];
      const localIds = productsRef.current
        .filter(p => p.id.startsWith('p_local_'))
        .map(p => p.id);
      for (const localId of localIds) {
        try {
          const raw = await AsyncStorage.getItem(pendingKey(localId));
          if (!raw) continue;
          const payload = JSON.parse(raw);
          const serverProduct = await API.createProduct(payload);
          await AsyncStorage.removeItem(pendingKey(localId)).catch(() => {});
          pushedProducts.push(serverProduct as Product);
          addNotification(
            'Listing Published Live',
            `"${payload.title || 'your listing'}" was saved while offline and is now live on the server!`,
            'listing'
          );
        } catch {
          // Still offline for this listing — keep it local and retry next poll.
        }
      }

      setProducts(prev => {
        // Live server feed is the single source of truth. Keep only offline
        // listings that have not yet been pushed (p_local_* ids).
        const localOnly = prev.filter(p => p.id.startsWith('p_local_'));
        return [...pushedProducts, ...serverProducts, ...localOnly] as Product[];
      });
    } catch {
      setIsServerConnected(false);
    }
  }, [addNotification]);

  useEffect(() => {
    if (!isLoaded) return;
    // Initial sync
    syncFromServer();
    // Poll every 15 seconds for live updates
    pollIntervalRef.current = setInterval(syncFromServer, 15000);
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isLoaded, syncFromServer]);

  // ── Persist local-only data to AsyncStorage ────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    if (currentUser) {
      AsyncStorage.setItem('@bazaar_user_v4', JSON.stringify(currentUser)).catch(() => {});
    } else {
      AsyncStorage.removeItem('@bazaar_user_v4').catch(() => {});
    }
  }, [currentUser, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem('@bazaar_saved_v4', JSON.stringify(savedItems)).catch(() => {});
  }, [savedItems, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem('@bazaar_searches_v4', JSON.stringify(recentSearches)).catch(() => {});
  }, [recentSearches, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem('@bazaar_chats_v4', JSON.stringify(chatMessages)).catch(() => {});
  }, [chatMessages, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem('@bazaar_notifs_v4', JSON.stringify(notifications)).catch(() => {});
  }, [notifications, isLoaded]);

  // ── Notification helpers ───────────────────────────────────────
  const markNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const clearNotifications = useCallback(() => { setNotifications([]); }, []);

  const unreadNotificationCount = useMemo(() =>
    notifications.filter(n => !n.isRead).length, [notifications]);

  // ── Chat ──────────────────────────────────────────────────────
  const getChatForConversation = useCallback((convKey: string) =>
    chatMessages[convKey] || [], [chatMessages]);

  const sendMessage = useCallback(async (convKey: string, text: string, sellerName: string = 'Seller') => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      conversationId: convKey,
      senderId: currentUser?.id || 'u_guest',
      senderName: currentUser?.name || 'You',
      senderAvatar: currentUser?.avatar,
      content: text,
      sentAt: new Date().toISOString(),
      isMine: true,
      status: 'delivered',
    };

    setChatMessages(prev => ({
      ...prev,
      [convKey]: [...(prev[convKey] || []), userMsg],
    }));

    // Try to persist to server
    try {
      await API.postMessage(convKey, {
        senderId: currentUser?.id || 'u_guest',
        senderName: currentUser?.name || 'You',
        content: text,
        isMine: true,
      });
    } catch { /* no-op, local state already updated */ }
  }, [currentUser]);

  // ── Product CRUD (server-first, local fallback) ───────────────
  const addProduct = useCallback(async (
    productData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'postedAt' | 'views' | 'priceHistory'> & { sellerPhone: string }
  ) => {
    const optimisticId = `p_local_${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: optimisticId,
      sellerId: currentUser?.id || 'u1',
      sellerName: currentUser?.name || 'Bazaar Member',
      sellerPhone: productData.sellerPhone,
      sellerAvatar: currentUser?.avatar,
      postedAt: new Date().toISOString(),
      views: 1,
      priceHistory: [{ date: new Date().toISOString().split('T')[0], price: productData.price }],
    };

    // Optimistically add to local state immediately
    setProducts(prev => [newProduct, ...prev]);

    // Try to persist to shared server
    try {
      const serverProduct = await API.createProduct({
        ...productData,
        sellerId: currentUser?.id || 'u1',
        sellerName: currentUser?.name || 'Bazaar Member',
      });
      // Replace the optimistic local entry with the real server one
      setProducts(prev => prev.map(p => p.id === optimisticId ? serverProduct as Product : p));
      setIsServerConnected(true);
      addNotification('Listing Published Live', `"${productData.title}" is now live for all users across Nepal!`, 'listing');
      return { ok: true, product: serverProduct as Product };
    } catch {
      // Fallback: keep the optimistic local product and persist it so it is
      // automatically pushed to the server when connectivity returns.
      setIsServerConnected(false);
      const payload = {
        ...productData,
        sellerId: currentUser?.id || 'u1',
        sellerName: currentUser?.name || 'Bazaar Member',
      };
      AsyncStorage.setItem(pendingKey(optimisticId), JSON.stringify(payload)).catch(() => {});
      addNotification('Listing Saved Locally', `"${productData.title}" was saved to your device. It will sync automatically when the server is reachable.`, 'listing');
      return { ok: true, product: newProduct };
    }
  }, [currentUser, addNotification]);

  const updateProduct = useCallback(async (productId: string, updatedFields: Partial<Product>) => {
    // Optimistic local update
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const hasPriceChanged = updatedFields.price != null && updatedFields.price !== p.price;
      return {
        ...p, ...updatedFields,
        priceHistory: hasPriceChanged
          ? [...(p.priceHistory || []), { date: new Date().toISOString().split('T')[0], price: updatedFields.price! }]
          : p.priceHistory,
      };
    }));

    try {
      await API.updateProduct(productId, { ...updatedFields, sellerId: currentUser?.id });
      setIsServerConnected(true);
    } catch {
      setIsServerConnected(false);
    }

    addNotification('Listing Updated', `Changes to "${updatedFields.title || 'your product'}" saved and published live.`, 'listing');
    return { ok: true };
  }, [currentUser, addNotification]);

  const deleteProduct = useCallback(async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (productId.startsWith('p_local_')) {
      AsyncStorage.removeItem(pendingKey(productId)).catch(() => {});
    }
    try {
      await API.deleteProduct(productId, currentUser?.id || 'u1');
      setIsServerConnected(true);
    } catch {
      setIsServerConnected(false);
    }
    addNotification('Listing Removed', 'The item was removed from the marketplace.', 'listing');
    return { ok: true };
  }, [currentUser, addNotification]);

  const incrementViews = useCallback((productId: string) => {
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, views: (p.views || 0) + 1 } : p
    ));
    API.incrementViewCount(productId).catch(() => {});
  }, []);

  // ── Sellers / Filter / Search ──────────────────────────────────
  const getSeller = useCallback((id: string) => {
    if (currentUser && id === currentUser.id) return currentUser;
    for (const p of products) {
      if (p.sellerId === id) return {
        id: p.sellerId, name: p.sellerName || 'Bazaar Member',
        phone: p.sellerPhone, avatar: p.sellerAvatar,
        location: p.location,
      };
    }
    return { id: id || 'u_unknown', name: 'Bazaar Member', phone: '+977-9800000000' };
  }, [currentUser, products]);

  const toggleSavedItem = useCallback((id: string) => {
    setSavedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    setRecentSearches(prev => [query, ...prev.filter(s => s.toLowerCase() !== query.toLowerCase())].slice(0, 8));
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const setSearchQuery = useCallback((query: string) => { setSearchQueryRaw(query); }, []);

  const login = useCallback((user: User) => { setCurrentUser(user); }, []);
  const logout = useCallback(() => { setCurrentUser(null); }, []);

  const filteredProducts = useMemo(() =>
    products.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === '' ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    }),
    [products, searchQuery, selectedCategory]
  );

  const value = useMemo(() => ({
    products, currentUser, login, logout, searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory, filteredProducts, getSeller,
    savedItems, toggleSavedItem, recentSearches, addRecentSearch, clearRecentSearches,
    addProduct, updateProduct, deleteProduct, incrementViews,
    chatMessages, sendMessage, getChatForConversation,
    notifications, unreadNotificationCount, markNotificationsRead, clearNotifications,
    isServerConnected,
  }), [
    products, currentUser, login, logout, searchQuery, selectedCategory,
    filteredProducts, savedItems, recentSearches, getSeller, toggleSavedItem,
    setSearchQuery, addRecentSearch, clearRecentSearches, addProduct, updateProduct, deleteProduct,
    incrementViews, chatMessages, sendMessage, getChatForConversation,
    notifications, unreadNotificationCount, markNotificationsRead, clearNotifications,
    isServerConnected,
  ]);

  if (!isLoaded) return null;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};

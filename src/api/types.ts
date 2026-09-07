export type GQLUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string | null;
  whatsapp?: string | null;
  phoneVisibility: string;
  whatsappVisibility: string;
  emailVisibility: string;
  onlineStatus: string;
  accountStatus: string;
  isVerified: boolean;
  reputation: number;
  itemsSold: number;
  trustScore: number;
  rating: number;
  ratingCount: number;
  joinDate: string;
  lastSeen?: string | null;
  district?: string | null;
  province?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contactPreference: string;
  token?: string | null;
};

export type GQLProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  negotiable: boolean;
  condition?: string | null;
  brand?: string | null;
  quantity: number;
  stockStatus: string;
  category: GQLCategory;
  subcategory?: string | null;
  location: string;
  district?: string | null;
  province?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];
  videos: string[];
  tags: string[];
  seller: GQLUser;
  postedAt: string;
  views: number;
  favoriteCount: number;
  chatCount: number;
  isEscrowEligible: boolean;
  isBoosted: boolean;
  isDeliveryAvailable: boolean;
  isPickupAvailable: boolean;
  isActive: boolean;
  isSold: boolean;
  moderationStatus: string;
  priceHistory: GQLPriceEntry[];
};

export type GQLPriceEntry = {
  date: string;
  price: number;
};

export type GQLCategory = {
  id: string;
  name: string;
  icon: string;
};

export type GQLAuthPayload = {
  user: GQLUser;
  token: string;
  refreshToken: string;
};

export type GQLConversation = {
  id: string;
  buyer: GQLUser;
  seller: GQLUser;
  product?: GQLProduct | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadBuyer: number;
  unreadSeller: number;
  createdAt: string;
};

export type GQLMessage = {
  id: string;
  conversationId: string;
  sender: GQLUser;
  content: string;
  contentType: string;
  attachmentUrl?: string | null;
  isRead: boolean;
  isDelivered: boolean;
  sentAt: string;
  readAt?: string | null;
};

export type GQLNotification = {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  imageUrl?: string | null;
  actionUrl?: string | null;
  isRead: boolean;
  createdAt: string;
};

export type GQLReport = {
  id: string;
  reporter: GQLUser;
  targetType: string;
  targetId: string;
  reason: string;
  description?: string | null;
  status: string;
  createdAt: string;
};

export type GQLProductConnection = {
  items: GQLProduct[];
  totalCount: number;
  hasMore: boolean;
  page: number;
};

export type GQLUnreadCounts = {
  messages: number;
  notifications: number;
};

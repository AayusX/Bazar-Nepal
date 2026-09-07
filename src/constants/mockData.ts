export type User = {
  id: string;
  name: string;
  phone?: string;
  avatar?: string;
  reputation?: number;
  itemsSold?: number;
  joinDate?: string;
  location?: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone?: string;
  sellerAvatar?: string;
  location: string;
  province?: string;
  postedAt: string;
  views: number;
  isEscrowEligible: boolean;
  priceHistory: { date: string; price: number }[];
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  sentAt: string;
  isMine: boolean;
  status: 'sent' | 'delivered' | 'read';
};

export const CATEGORIES = [
  { id: 'cat-1', name: 'Electronics' },
  { id: 'cat-2', name: 'Vehicles' },
  { id: 'cat-3', name: 'Property' },
  { id: 'cat-4', name: 'Furniture' },
  { id: 'cat-5', name: 'Fashion' },
  { id: 'cat-6', name: 'Services' },
];

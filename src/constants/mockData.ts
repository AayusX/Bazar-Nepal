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

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Mr.Aayush Bhandari',
  phone: '+977-9801234567',
  location: 'Kathmandu, Bagmati',
};

export const MOCK_SELLERS: Record<string, User> = {
  'u1': CURRENT_USER,
  'u2': {
    id: 'u2',
    name: 'Suman Gurung',
    phone: '+977-9841567890',
    location: 'Pokhara, Gandaki',
  },
  'u3': {
    id: 'u3',
    name: 'Priya Sharma',
    phone: '+977-9812345678',
    location: 'Lalitpur, Bagmati',
  },
  'u4': {
    id: 'u4',
    name: 'Rohan Shrestha',
    phone: '+977-9861998877',
    location: 'Biratnagar, Koshi',
  }
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'MacBook Air M2 13-inch (Space Gray)',
    description: 'Barely used MacBook Air M2, 8GB Unified RAM, 256GB SSD. Battery health 99% (only 34 cycles). Includes original 30W MagSafe charger, Apple bill from Oliz Store, and box. Tested & escrow eligible.',
    price: 115000,
    currency: 'NPR',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80'
    ],
    sellerId: 'u2',
    sellerName: 'Suman Gurung',
    sellerPhone: '+977-9841567890',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    location: 'New Road, Kathmandu',
    province: 'Bagmati',
    postedAt: '2024-05-10T14:00:00Z',
    views: 482,
    isEscrowEligible: true,
    priceHistory: [
      { date: '2024-05-01', price: 125000 },
      { date: '2024-05-05', price: 120000 },
      { date: '2024-05-10', price: 115000 }
    ]
  },
  {
    id: 'p2',
    title: 'Royal Enfield Classic 350 Reborn',
    description: 'Single-hand driven Enfield Classic 350. Stealth Black color. Genuine 12,000 KM run. All periodic servicing at official showroom. Road tax cleared up to 2081/82 fiscal year. Bluebook on hand.',
    price: 365000,
    currency: 'NPR',
    category: 'Vehicles',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80'
    ],
    sellerId: 'u3',
    sellerName: 'Priya Sharma',
    sellerPhone: '+977-9812345678',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    location: 'Lakeside, Pokhara',
    province: 'Gandaki',
    postedAt: '2024-05-12T09:30:00Z',
    views: 1280,
    isEscrowEligible: true,
    priceHistory: [
      { date: '2024-05-01', price: 380000 },
      { date: '2024-05-12', price: 365000 }
    ]
  },
  {
    id: 'p3',
    title: 'Sony Alpha A7 III Full Frame Camera (Body Only)',
    description: 'Clean sensor with zero scratches. Shutter count 14k. Includes 2 original NP-FZ100 Sony batteries, Dual charger, neck strap, and 128GB SanDisk Extreme Pro V60 SD Card.',
    price: 155000,
    currency: 'NPR',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80'
    ],
    sellerId: 'u4',
    sellerName: 'Rohan Shrestha',
    sellerPhone: '+977-9861998877',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    location: 'Main Road, Biratnagar',
    province: 'Koshi',
    postedAt: '2024-05-13T16:45:00Z',
    views: 310,
    isEscrowEligible: true,
    priceHistory: [
      { date: '2024-05-08', price: 165000 },
      { date: '2024-05-13', price: 155000 }
    ]
  },
  {
    id: 'p4',
    title: 'Handcrafted Sheesham Solid Wood Study Table',
    description: 'Custom-built pure Sheesham wood office / study desk with 3 lockable drawers and wire pass cutout. Scratch-free glossy lacquer polish. Heavy and durable.',
    price: 18500,
    currency: 'NPR',
    category: 'Furniture',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80',
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80'
    ],
    sellerId: 'u1',
    sellerName: 'Mr.Aayush Bhandari',
    sellerPhone: '+977-9801234567',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    location: 'Jhamsikhel, Lalitpur',
    province: 'Bagmati',
    postedAt: '2024-05-14T11:15:00Z',
    views: 145,
    isEscrowEligible: true,
    priceHistory: [
      { date: '2024-05-10', price: 20000 },
      { date: '2024-05-14', price: 18500 }
    ]
  }
];

export const CATEGORIES = [
  { id: 'cat-1', name: 'Electronics' },
  { id: 'cat-2', name: 'Vehicles' },
  { id: 'cat-3', name: 'Property' },
  { id: 'cat-4', name: 'Furniture' },
  { id: 'cat-5', name: 'Fashion' },
  { id: 'cat-6', name: 'Services' },
];

export type Language = 'en' | 'te';

export type CategoryId = 
  | 'millets'
  | 'rice'
  | 'flours'
  | 'pulses'
  | 'oils'
  | 'spices'
  | 'ready-to-cook'
  | 'ready-to-eat'
  | 'natural-dairy'
  | 'sweets-snacks'
  | 'herbal-eco'
  | 'all';

export interface Category {
  id: CategoryId;
  name: string;
  teluguName: string;
  icon: string;
  description: string;
  teluguDescription: string;
  image: string;
  badge?: string;
  benefitEn?: string;
  benefitTe?: string;
}

export interface Product {
  id: string;
  slNo?: number;
  name: string;
  teluguName: string;
  category: CategoryId;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  quantity: string;
  unit: string;
  image: string;
  description: string;
  teluguDescription: string;
  available: boolean;
  isReadyToCook?: boolean;
  isReadyToEat?: boolean;
  isFeatured?: boolean;
  isNaturalProduct?: boolean;
  tags: string[];
  source: 'dds_catalog_1' | 'community_center_2' | 'gvkss_palle_santha';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface MonthlyPackItem {
  slNo?: number;
  name: string;
  teluguName?: string;
  quantity: string;
}

export interface MonthlyPack {
  id: string;
  name: string;
  teluguName: string;
  subtitle: string;
  teluguSubtitle: string;
  price: number;
  originalPrice: number;
  totalWeightApprox: string;
  itemCount: number;
  description: string;
  teluguDescription: string;
  items: MonthlyPackItem[];
  highlights: { en: string; te: string }[];
  image: string;
  badge: string;
}

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  notes?: string;
}

export interface Order {
  orderId: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'upi' | 'cod' | 'card';
  date: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
}

export interface FilterState {
  category: CategoryId;
  priceRange: [number, number];
  onlyInStock: boolean;
  onlyFeatured: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'name';
}

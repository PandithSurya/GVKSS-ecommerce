/**
 * @organic-store/shared-types
 * Shared domain definitions and API contracts across Storefront, Admin, and Backend
 */

export type CategoryId =
  | 'all'
  | 'millets'
  | 'ready-to-cook'
  | 'ready-to-eat'
  | 'flours'
  | 'cold-pressed-oils'
  | 'a2-ghee-butter'
  | 'natural-sweeteners'
  | 'spices-salts'
  | 'forest-honey'
  | 'herbal-eco'
  | 'sweets-snacks'
  | 'natural-dairy';

export interface Product {
  id: string;
  name: string;
  teluguName: string;
  category: CategoryId;
  price: number;
  originalPrice?: number;
  quantity: string;
  unit?: string;
  image: string;
  description: string;
  teluguDescription: string;
  inStock: boolean;
  stock?: number;
  tags: string[];
  isFeatured?: boolean;
  isReadyToCook?: boolean;
  isReadyToEat?: boolean;
  isNaturalProduct?: boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  teluguName: string;
  icon: string;
  description: string;
  teluguDescription: string;
  image: string;
  badge?: string;
  benefitEn: string;
  benefitTe: string;
  sortOrder?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'upi' | 'cod' | 'card' | 'netbanking';

export type PaymentStatus =
  | 'pending'
  | 'submitted'
  | 'confirmed'
  | 'rejected'
  | 'refunded';

export interface OrderItem {
  productId: string;
  name: string;
  teluguName?: string;
  price: number;
  quantity: number;
  lineTotal?: number;
  subtotal?: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  phone: string;
  secondaryPhone?: string;
  email?: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  utrNumber?: string;
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDelivery?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isVerified?: boolean;
  role?: string;
  addresses?: Address[];
  createdAt?: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  roleName: 'SUPER_ADMIN' | 'ADMIN' | 'ORDER_MANAGER' | 'PAYMENT_VERIFIER' | 'INVENTORY_MANAGER';
  mfaEnabled?: boolean;
  createdAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  pendingVerifications: number;
  lowStockCount: number;
  recentOrdersCount: number;
}

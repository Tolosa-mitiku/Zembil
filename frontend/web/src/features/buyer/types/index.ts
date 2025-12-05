/**
 * Shared Buyer Component Types
 * TypeScript interfaces and types used across buyer components
 */

// Product Types
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  seller: {
    _id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// Order Types
export interface Order {
  _id: string;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  estimatedDelivery?: string;
  tracking?: TrackingInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface TrackingInfo {
  status: string;
  message: string;
  timestamp: string;
  location?: string;
}

// Address Types
export interface Address {
  _id?: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

// Profile Types
export interface UserProfile {
  _id: string;
  uid: string;
  email: string;
  name: string;
  image?: string;
  phoneNumber?: string;
  role: 'buyer' | 'seller' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Wishlist Types
export interface WishlistItem {
  _id: string;
  product: Product;
  addedAt: string;
}

// Review Types
export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  product: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified?: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}


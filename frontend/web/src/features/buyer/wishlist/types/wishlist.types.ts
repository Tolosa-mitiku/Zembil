/**
 * Wishlist Types
 * TypeScript interfaces for wishlist data structures
 */

import type { Product } from '../../products/types/product.types';

// Wishlist Item
export interface WishlistItem {
  productId: string | Product;
  addedAt: string | Date;
  priceAtAdd?: number;
  notifyOnSale?: boolean;
  notifyBackInStock?: boolean;
}

// Wishlist
export interface Wishlist {
  _id: string;
  userId: string;
  products: WishlistItem[];
  metadata?: Record<string, any>;
  schemaVersion?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// API Response Types
export interface WishlistResponse {
  success: boolean;
  message?: string;
  data: Wishlist;
}

// Populated Wishlist Item (with full product data)
export interface PopulatedWishlistItem extends Omit<WishlistItem, 'productId'> {
  productId: Product;
}

// Populated Wishlist
export interface PopulatedWishlist extends Omit<Wishlist, 'products'> {
  products: PopulatedWishlistItem[];
}


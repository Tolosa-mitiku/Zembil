/**
 * User API
 * 
 * RTK Query API for user profile and related data
 */

import { api } from '@/core/http/api';

export interface UserProfile {
  _id: string;
  uid: string;
  email: string;
  name: string;
  image?: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  role: 'buyer' | 'seller' | 'admin';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  accountStatus: 'active' | 'suspended' | 'banned' | 'deleted';
  stats: {
    totalOrders: number;
    totalSpent: number;
    totalReviews: number;
    accountAge: number;
  };
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
  position?: number;
  isMain?: boolean;
}

export interface CartItem {
  _id: string;
  productId: {
    _id: string;
    title: string;
    images: ProductImage[];
    primaryImage?: string;
    pricing: {
      basePrice: number;
      salePrice?: number;
    };
    inventory: {
      stockQuantity: number;
    };
  };
  quantity: number;
  selectedVariant?: any;
  addedAt: string;
}

export interface WishlistItem {
  _id: string;
  productId: {
    _id: string;
    title: string;
    images: ProductImage[];
    primaryImage?: string;
    pricing: {
      basePrice: number;
      salePrice?: number;
    };
    inventory: {
      stockQuantity: number;
    };
  };
  addedAt: string;
}

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user profile
    getCurrentUser: builder.query<UserProfile, void>({
      query: () => '/me',
      transformResponse: (response: { success: boolean; user: UserProfile }) =>
        response.user,
      providesTags: ['Profile'],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // Get user's cart
    getCart: builder.query<CartItem[], void>({
      query: () => '/cart',
      transformResponse: (response: { success: boolean; data: { items: CartItem[] } }) =>
        response.data.items || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Cart' as const, id: _id })),
              { type: 'Cart' as const, id: 'LIST' },
            ]
          : [{ type: 'Cart' as const, id: 'LIST' }],
      // Keep cart data fresh - refetch every 30 seconds when focused
      keepUnusedDataFor: 30,
    }),

    // NOTE: Wishlist operations (getWishlist, addToWishlist, removeFromWishlist)
    // are handled by wishlistApi.ts to avoid endpoint name conflicts

    // Add to cart
    addToCart: builder.mutation<void, { productId: string; quantity: number; variantId?: string }>({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    // Update cart item quantity
    updateCartItem: builder.mutation<void, { itemId: string; quantity: number }>({
      query: ({ itemId, quantity }) => ({
        url: `/cart/${itemId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    // Remove from cart
    removeFromCart: builder.mutation<void, string>({
      query: (itemId) => ({
        url: `/cart/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetCartQuery,
  // Wishlist hooks are exported from wishlistApi.ts
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = userApi;

export default userApi;


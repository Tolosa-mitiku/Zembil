/**
 * Buyer Wishlist API
 * RTK Query API service for wishlist operations
 */

import { api } from "@/core/http/api";

// ============= INTERFACES =============

// Category can be either an ID string or a populated object
export interface PopulatedCategory {
  _id: string;
  name: string;
  slug?: string;
  icon?: string;
}

export interface WishlistProduct {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  category?: string | PopulatedCategory;
  pricing?: {
    basePrice: number;
    salePrice?: number;
    currency?: string;
    taxable?: boolean;
    compareAtPrice?: number;
  };
  images?: Array<{
    _id?: string;
    url: string;
    alt?: string;
    position?: number;
    isMain?: boolean;
  }>;
  discount?: {
    isActive?: boolean;
    percentage?: number;
    type?: string;
    value?: number;
    startDate?: string;
    endDate?: string;
  };
  inventory?: {
    stockQuantity?: number;
    availableQuantity?: number;
    lowStockThreshold?: number;
    trackInventory?: boolean;
  };
  analytics?: {
    averageRating?: number;
    totalReviews?: number;
  };
}

export interface WishlistItem {
  _id?: string;
  productId: WishlistProduct | string;
  addedAt: string;
  priceAtAdd?: number;
}

export interface Wishlist {
  _id: string;
  userId: string;
  products: WishlistItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistResponse {
  success: boolean;
  message?: string;
  data: Wishlist;
}

// ============= API SLICE =============

export const wishlistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's wishlist
    getWishlist: builder.query<Wishlist, void>({
      query: () => "/wishlist",
      transformResponse: (response: unknown) => {
        const resp = response as {
          success?: boolean;
          data?: Wishlist;
          products?: WishlistItem[];
        };

        // Handle different response structures
        if (resp?.data?.products !== undefined) {
          // Standard format: { success: true, data: { products: [...] } }
          return resp.data;
        } else if (resp?.products !== undefined) {
          // Already unwrapped format
          return resp as unknown as Wishlist;
        }

        // Fallback empty wishlist
        return { _id: "", userId: "", products: [] } as Wishlist;
      },
      providesTags: (result) => {
        if (!result?.products) {
          return [{ type: "Wishlist" as const, id: "LIST" }];
        }

        return [
          { type: "Wishlist" as const, id: "LIST" },
          ...result.products.map((item) => {
            const productId =
              typeof item.productId === "string"
                ? item.productId
                : (item.productId as WishlistProduct)._id;
            return { type: "Wishlist" as const, id: productId };
          }),
        ];
      },
      keepUnusedDataFor: 60,
    }),

    // Add product to wishlist
    addToWishlist: builder.mutation<Wishlist, string>({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: "POST",
      }),
      transformResponse: (response: WishlistResponse) => response.data,
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),

    // Remove product from wishlist
    removeFromWishlist: builder.mutation<Wishlist, string>({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: "DELETE",
      }),
      transformResponse: (response: WishlistResponse) => response.data,
      invalidatesTags: (_result, _error, productId) => [
        { type: "Wishlist", id: "LIST" },
        { type: "Wishlist", id: productId },
      ],
    }),

    // Clear entire wishlist
    clearWishlist: builder.mutation<Wishlist, void>({
      query: () => ({
        url: "/wishlist",
        method: "DELETE",
      }),
      transformResponse: (response: WishlistResponse) => response.data,
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} = wishlistApi;

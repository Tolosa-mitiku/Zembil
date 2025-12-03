/**
 * Buyer Cart API
 * RTK Query API service for cart operations
 */

import { api } from "@/core/http/api";

// ============= INTERFACES =============

export interface CartProductImage {
  _id?: string;
  url: string;
  alt?: string;
  position?: number;
  isMain?: boolean;
}

export interface CartProductPricing {
  basePrice: number;
  salePrice?: number;
  currency?: string;
}

export interface CartProductInventory {
  stockQuantity?: number;
  availableQuantity?: number;
  lowStockThreshold?: number;
  trackInventory?: boolean;
}

// Populated product from backend
export interface CartProduct {
  _id: string;
  title: string;
  images?: CartProductImage[];
  pricing?: CartProductPricing;
  inventory?: CartProductInventory;
  status?: string;
}

export interface CartItemVariant {
  name?: string;
  options?: Record<string, unknown>;
}

export interface CartItem {
  _id?: string;
  productId: CartProduct | string;
  sellerId?: string;
  title?: string;
  image?: string;
  price?: number;
  quantity: number;
  variant?: CartItemVariant;
  addedAt?: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total?: number;
  promoCode?: string;
  discount?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data: Cart;
}

export interface AddToCartPayload {
  productId: string;
  quantity?: number;
  variant?: CartItemVariant;
}

export interface UpdateCartItemPayload {
  productId: string;
  quantity: number;
}

// ============= HELPER FUNCTIONS =============

/**
 * Extract product data from populated or non-populated product reference
 */
export const getProductFromCartItem = (item: CartItem): {
  id: string;
  title: string;
  image: string;
  price: number;
  maxQuantity: number;
  inStock: boolean;
} => {
  const product = item.productId;
  
  if (typeof product === "string") {
    // Not populated - use cached data from cart item
    return {
      id: product,
      title: item.title || "Product",
      image: item.image || "",
      price: item.price || 0,
      maxQuantity: 99,
      inStock: true,
    };
  }
  
  // Populated product
  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
  const price = product.pricing?.salePrice || product.pricing?.basePrice || item.price || 0;
  const availableQty = product.inventory?.availableQuantity ?? product.inventory?.stockQuantity ?? 99;
  
  return {
    id: product._id,
    title: product.title || item.title || "Product",
    image: mainImage?.url || item.image || "",
    price,
    maxQuantity: Math.max(availableQty, item.quantity),
    inStock: product.status === "active" && availableQty > 0,
  };
};

// ============= API SLICE =============

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's cart
    getCart: builder.query<Cart, void>({
      query: () => "/cart",
      transformResponse: (response: unknown) => {
        const resp = response as CartResponse;
        
        if (resp?.data) {
          return resp.data;
        }
        
        // Fallback empty cart
        return {
          _id: "",
          userId: "",
          items: [],
          subtotal: 0,
          total: 0,
        } as Cart;
      },
      providesTags: (result) => {
        if (!result?.items) {
          return [{ type: "Cart" as const, id: "LIST" }];
        }

        return [
          { type: "Cart" as const, id: "LIST" },
          ...result.items.map((item) => {
            const productId =
              typeof item.productId === "string"
                ? item.productId
                : (item.productId as CartProduct)._id;
            return { type: "Cart" as const, id: productId };
          }),
        ];
      },
      keepUnusedDataFor: 60,
    }),

    // Add item to cart
    addToCart: builder.mutation<Cart, AddToCartPayload>({
      query: (payload) => ({
        url: "/cart",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: CartResponse) => response.data,
      // Optimistic update
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedCart } = await queryFulfilled;
          // Update the cache with the new cart
          dispatch(
            cartApi.util.updateQueryData("getCart", undefined, () => updatedCart)
          );
        } catch {
          // Query failed, refetch to sync
          dispatch(cartApi.util.invalidateTags([{ type: "Cart", id: "LIST" }]));
        }
      },
      invalidatesTags: [{ type: "Cart", id: "LIST" }],
    }),

    // Update cart item quantity
    updateCartItem: builder.mutation<Cart, UpdateCartItemPayload>({
      query: ({ productId, quantity }) => ({
        url: `/cart/${productId}`,
        method: "PUT",
        body: { quantity },
      }),
      transformResponse: (response: CartResponse) => response.data,
      // Optimistic update for smoother UX
      async onQueryStarted({ productId, quantity }, { dispatch, queryFulfilled }) {
        // Optimistically update the cart
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const item = draft.items.find((i) => {
              const id = typeof i.productId === "string" ? i.productId : i.productId._id;
              return id === productId;
            });
            if (item) {
              item.quantity = quantity;
              // Recalculate subtotal
              draft.subtotal = draft.items.reduce((sum, i) => {
                const price = typeof i.productId === "string" 
                  ? (i.price || 0) 
                  : (i.productId.pricing?.salePrice || i.productId.pricing?.basePrice || i.price || 0);
                return sum + price * i.quantity;
              }, 0);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic update on failure
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Cart", id: "LIST" },
        { type: "Cart", id: productId },
      ],
    }),

    // Remove item from cart
    removeFromCart: builder.mutation<Cart, string>({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: "DELETE",
      }),
      transformResponse: (response: CartResponse) => response.data,
      // Optimistic update for instant feedback
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            draft.items = draft.items.filter((i) => {
              const id = typeof i.productId === "string" ? i.productId : i.productId._id;
              return id !== productId;
            });
            // Recalculate subtotal
            draft.subtotal = draft.items.reduce((sum, i) => {
              const price = typeof i.productId === "string" 
                ? (i.price || 0) 
                : (i.productId.pricing?.salePrice || i.productId.pricing?.basePrice || i.price || 0);
              return sum + price * i.quantity;
            }, 0);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, productId) => [
        { type: "Cart", id: "LIST" },
        { type: "Cart", id: productId },
      ],
    }),

    // Clear entire cart
    clearCart: builder.mutation<Cart, void>({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      transformResponse: (response: CartResponse) => response.data,
      // Optimistic update
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            draft.items = [];
            draft.subtotal = 0;
            draft.total = 0;
            draft.discount = 0;
            draft.promoCode = undefined;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Cart", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;



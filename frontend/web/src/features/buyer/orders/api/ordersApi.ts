/**
 * Buyer Orders API
 * RTK Query API service for buyer order operations
 */

import { api } from '@/core/http/api';

// ============= INTERFACES =============

export interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    title: string;
    images?: Array<{
      url: string;
      isMain?: boolean;
    }>;
    pricing?: {
      price: number;
      salePrice?: number;
    };
  };
  sellerId?: {
    _id: string;
    businessName: string;
  };
  quantity: number;
  price: number;
  totalPrice: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface TrackingInfo {
  status: 'pending' | 'processing' | 'shipped' | 'in-transit' | 'delivered' | 'cancelled' | 'refunded';
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  currentLocation?: string;
  history?: Array<{
    status: string;
    timestamp: string;
    location?: string;
    description?: string;
  }>;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyerId: string;
  items: OrderItem[];
  
  // Pricing
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount?: number;
  total: number;
  
  // Shipping
  shippingAddress: ShippingAddress;
  
  // Payment
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  
  // Tracking
  tracking: TrackingInfo;
  
  // Notes
  orderNotes?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface OrdersQueryParams {
  status?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedOrdersResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============= API SLICE =============

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's orders with filters and pagination
    getUserOrders: builder.query<PaginatedOrdersResponse, OrdersQueryParams>({
      query: (params = {}) => ({
        url: '/orders',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.status && params.status !== 'all' && { status: params.status }),
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
        },
      }),
      transformResponse: (response: { 
        success: boolean; 
        data: Order[]; 
        pagination: PaginatedOrdersResponse['pagination'];
      }) => ({
        data: response.data,
        pagination: response.pagination,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Orders' as const, id: _id })),
              { type: 'Orders' as const, id: 'LIST' },
            ]
          : [{ type: 'Orders' as const, id: 'LIST' }],
      // Keep orders data for 2 minutes
      keepUnusedDataFor: 120,
    }),

    // Get order by ID
    getOrderById: builder.query<Order, string>({
      query: (orderId) => `/orders/${orderId}`,
      transformResponse: (response: { success: boolean; data: Order }) =>
        response.data,
      providesTags: (result, error, orderId) => [
        { type: 'Orders', id: orderId },
      ],
      keepUnusedDataFor: 300,
    }),

    // Get recent orders (simplified query for profile page)
    getRecentOrders: builder.query<Order[], { limit?: number }>({
      query: ({ limit = 3 } = {}) => ({
        url: '/orders',
        params: {
          page: 1,
          limit,
        },
      }),
      transformResponse: (response: { 
        success: boolean; 
        data: Order[]; 
      }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Orders' as const, id: _id })),
              { type: 'Orders' as const, id: 'RECENT' },
            ]
          : [{ type: 'Orders' as const, id: 'RECENT' }],
      keepUnusedDataFor: 120,
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useGetRecentOrdersQuery,
} = ordersApi;


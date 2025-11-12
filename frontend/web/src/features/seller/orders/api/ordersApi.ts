import { api } from '@/core/http/api';
import { OrderStatus } from '@/core/constants';
import { mockOrders, getMockOrdersPage } from '../data/mockOrders';

// Toggle this to switch between mock and real API
const USE_MOCK_DATA = true;

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const sellerOrdersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSellerOrders: builder.query<OrdersResponse, {
      page?: number;
      limit?: number;
      status?: string;
    }>({
      queryFn: async (params) => {
        // Use mock data if enabled
        if (USE_MOCK_DATA) {
          const page = params.page || 1;
          const limit = params.limit || 12;
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Get paginated mock data
          const result = getMockOrdersPage(page, limit, params.status);
          
          return { data: result };
        }
        
        // Use real API
        return {
          data: await fetch('/sellers/me/orders?' + new URLSearchParams(params as any))
            .then(res => res.json())
            .then(response => response.data || response)
        };
      },
      providesTags: ['SellerOrders'],
    }),

    getSellerOrderById: builder.query<Order, string>({
      queryFn: async (id) => {
        // Use mock data if enabled
        if (USE_MOCK_DATA) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const order = mockOrders.find(o => o._id === id);
          if (!order) {
            return { error: { status: 404, data: 'Order not found' } };
          }
          
          return { data: order };
        }
        
        // Use real API
        return {
          data: await fetch(`/sellers/me/orders/${id}`)
            .then(res => res.json())
            .then(response => response.data?.order || response.order)
        };
      },
      providesTags: ['SellerOrders'],
    }),

    updateOrderStatus: builder.mutation<Order, {
      id: string;
      status: OrderStatus;
      note?: string;
    }>({
      query: ({ id, status, note }) => ({
        url: `/sellers/me/orders/${id}/status`,
        method: 'PUT',
        body: { status, note },
      }),
      invalidatesTags: ['SellerOrders', 'SellerDashboard'],
    }),

    shipOrder: builder.mutation<Order, {
      id: string;
      trackingNumber: string;
      carrier: string;
      estimatedDelivery?: string;
    }>({
      query: ({ id, ...body }) => ({
        url: `/sellers/me/orders/${id}/ship`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['SellerOrders', 'SellerDashboard'],
    }),

    deliverOrder: builder.mutation<Order, string>({
      query: (id) => ({
        url: `/sellers/me/orders/${id}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: ['SellerOrders', 'SellerDashboard'],
    }),
  }),
});

export const {
  useGetSellerOrdersQuery,
  useGetSellerOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useShipOrderMutation,
  useDeliverOrderMutation,
} = sellerOrdersApi;


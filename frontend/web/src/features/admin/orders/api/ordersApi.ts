import { api } from '@/core/http/api';
import { OrderStatus } from '@/core/constants';

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

export interface AdminOrder {
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
  seller: {
    _id: string;
    name: string;
    email?: string;
  };
}

export interface OrdersResponse {
  orders: AdminOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminOrdersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query<OrdersResponse, {
      page?: number;
      limit?: number;
      status?: string;
    }>({
      query: (params) => ({
        url: '/admin/orders',
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminOrders'],
    }),

    getAdminOrderById: builder.query<AdminOrder, string>({
      query: (id) => ({
        url: `/admin/orders/${id}`,
      }),
      transformResponse: (response: any) => response.data?.order || response.order,
      providesTags: ['AdminOrders'],
    }),

    updateAdminOrderStatus: builder.mutation<AdminOrder, {
      id: string;
      status: OrderStatus;
      note?: string;
    }>({
      query: ({ id, status, note }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PUT',
        body: { status, note },
      }),
      invalidatesTags: ['AdminOrders'],
    }),

    refundOrder: builder.mutation<void, { id: string; amount: number; reason: string }>({
      query: ({ id, amount, reason }) => ({
        url: `/admin/orders/${id}/refund`,
        method: 'PUT',
        body: { amount, reason },
      }),
      invalidatesTags: ['AdminOrders'],
    }),
  }),
});

export const {
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateAdminOrderStatusMutation,
  useRefundOrderMutation,
} = adminOrdersApi;


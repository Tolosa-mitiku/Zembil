import { api } from '@/core/http/api';
import { OrderStatus } from '@/core/constants';

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  status: OrderStatus;
  customer: { name: string; email: string };
  seller: { name: string };
  createdAt: string;
}

export const adminOrdersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query<{ orders: AdminOrder[]; pagination: any }, {
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
  useRefundOrderMutation,
} = adminOrdersApi;


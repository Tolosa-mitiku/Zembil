import { api } from '@/core/http/api';
import { VerificationStatus } from '@/core/constants';

export interface Seller {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  businessName?: string;
  verificationStatus: VerificationStatus;
  totalProducts: number;
  totalSales: number;
  createdAt: string;
}

export const adminSellersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSellers: builder.query<{ sellers: Seller[]; pagination: any }, {
      page?: number;
      limit?: number;
      verificationStatus?: string;
    }>({
      query: (params) => ({
        url: '/admin/sellers',
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminSellers'],
    }),

    verifySeller: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/sellers/${id}/verify`,
        method: 'PUT',
      }),
      invalidatesTags: ['AdminSellers', 'AdminDashboard'],
    }),

    rejectSeller: builder.mutation<void, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/sellers/${id}/reject`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['AdminSellers', 'AdminDashboard'],
    }),
  }),
});

export const {
  useGetAdminSellersQuery,
  useVerifySellerMutation,
  useRejectSellerMutation,
} = adminSellersApi;


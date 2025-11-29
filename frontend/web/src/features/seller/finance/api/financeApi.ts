import { api } from '@/core/http/api';

export interface EarningsSummary {
  totalEarnings: number;
  totalPlatformFees: number;
  totalOrders: number;
  availableForPayout: number;
  pendingClearing: number;
  paidOut: number;
}

export interface EarningDetail {
  _id: string;
  orderId: string;
  orderNumber?: string;
  totalAmount: number;
  platformFee: number;
  platformFeePercentage: number;
  sellerAmount: number;
  payoutStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'on_hold';
  payoutId?: string;
  payoutMethod?: string;
  payoutDate?: string;
  eligibleForPayoutAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payout {
  _id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payoutMethod: string;
  createdAt: string;
  completedAt?: string;
}

export const sellerFinanceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEarnings: builder.query<EarningsSummary, void>({
      query: () => '/sellers/me/earnings',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['SellerFinance'],
    }),

    getEarningDetails: builder.query<{ earnings: EarningDetail[]; pagination: any }, {
      page?: number;
      limit?: number;
      status?: string;
    }>({
      query: (params) => ({
        url: '/sellers/me/earnings/details',
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ['SellerFinance'],
    }),

    getPayouts: builder.query<{ payouts: Payout[]; pagination: any }, {
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/sellers/me/payouts',
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ['SellerFinance'],
    }),

    requestPayout: builder.mutation<void, {
      amount: number;
      payoutMethod: string;
    }>({
      query: (data) => ({
        url: '/sellers/me/payouts/request',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SellerFinance'],
    }),
  }),
});

export const {
  useGetEarningsQuery,
  useGetEarningDetailsQuery,
  useGetPayoutsQuery,
  useRequestPayoutMutation,
} = sellerFinanceApi;


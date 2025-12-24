import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Mock types
export interface AdminFinanceStats {
  totalRevenue: number;
  totalCommission: number;
  pendingPayouts: number;
  activeSellers: number;
  revenueGrowth: number;
  commissionGrowth: number;
}

export interface PayoutRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  dateRequested: string;
  bankAccount: string;
}

export interface PlatformTransaction {
  id: string;
  orderId: string;
  amount: number;
  type: 'sale' | 'refund' | 'payout' | 'fee';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  sellerId: string;
}

// Mock data
const mockStats: AdminFinanceStats = {
  totalRevenue: 1250000.00,
  totalCommission: 125000.00,
  pendingPayouts: 45000.00,
  activeSellers: 150,
  revenueGrowth: 12.5,
  commissionGrowth: 15.2
};

const mockPayouts: PayoutRequest[] = [
  {
    id: 'pay_1',
    sellerId: 'sel_1',
    sellerName: 'TechGadgets Inc',
    amount: 5000.00,
    status: 'pending',
    dateRequested: new Date().toISOString(),
    bankAccount: '**** 1234'
  },
  {
    id: 'pay_2',
    sellerId: 'sel_2',
    sellerName: 'Fashion Boutique',
    amount: 2300.50,
    status: 'processing',
    dateRequested: new Date(Date.now() - 86400000).toISOString(),
    bankAccount: '**** 5678'
  }
];

export const adminFinanceApi = createApi({
  reducerPath: 'adminFinanceApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/finance',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Finance', 'Payouts'],
  endpoints: (builder) => ({
    getFinanceStats: builder.query<AdminFinanceStats, void>({
      queryFn: () => ({ data: mockStats }), // Mock response
      providesTags: ['Finance'],
    }),
    getPayoutRequests: builder.query<PayoutRequest[], void>({
      queryFn: () => ({ data: mockPayouts }), // Mock response
      providesTags: ['Payouts'],
    }),
    approvePayout: builder.mutation<void, string>({
      queryFn: (id) => ({ data: undefined }), // Mock response
      invalidatesTags: ['Payouts'],
    }),
    rejectPayout: builder.mutation<void, string>({
      queryFn: (id) => ({ data: undefined }), // Mock response
      invalidatesTags: ['Payouts'],
    }),
  }),
});

export const {
  useGetFinanceStatsQuery,
  useGetPayoutRequestsQuery,
  useApprovePayoutMutation,
  useRejectPayoutMutation,
} = adminFinanceApi;

















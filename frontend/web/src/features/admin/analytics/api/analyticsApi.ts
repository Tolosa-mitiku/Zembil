import { api } from '@/core/http/api';

export interface RevenueData {
  date: string;
  revenue: number;
  platformFees: number;
}

export interface SalesData {
  totalSales: number;
  salesByStatus: Array<{ status: string; count: number }>;
  topProducts: Array<{ title: string; sold: number; revenue: number }>;
}

export interface UserGrowth {
  date: string;
  count: number;
}

export const adminAnalyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminRevenue: builder.query<{ data: RevenueData[] }, {
      startDate?: string;
      endDate?: string;
      period?: string;
    }>({
      query: (params) => ({
        url: '/admin/analytics/revenue',
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminAnalytics'],
    }),

    getAdminSales: builder.query<SalesData, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/admin/analytics/sales',
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminAnalytics'],
    }),

    getAdminUserGrowth: builder.query<{ userGrowth: UserGrowth[]; usersByRole: any }, void>({
      query: () => '/admin/analytics/users',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminAnalytics'],
    }),
  }),
});

export const {
  useGetAdminRevenueQuery,
  useGetAdminSalesQuery,
  useGetAdminUserGrowthQuery,
} = adminAnalyticsApi;


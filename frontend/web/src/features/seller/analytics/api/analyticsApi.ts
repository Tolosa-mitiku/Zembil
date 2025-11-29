import { api } from '@/core/http/api';

export interface SalesByDate {
  _id: string;
  count: number;
  revenue: number;
}

export interface TopProduct {
  _id: string;
  productDetails?: {
    title: string;
    images?: string[];
  };
  totalSold: number;
  revenue: number;
}

export interface OrderStatusBreakdown {
  _id: string;
  count: number;
}

export interface AnalyticsData {
  salesByDate: SalesByDate[];
  topProducts: TopProduct[];
  ordersByStatus: OrderStatusBreakdown[];
  dateRange: {
    start: string;
    end: string;
  };
}

export interface DashboardOverview {
  totalOrders: number;
  pendingOrders: number;
  last30DaysOrders: number;
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  totalRevenue: number;
  totalEarnings: number;
  pendingPayout: number;
}

export interface RevenueData {
  earningsByStatus: Array<{
    _id: string;
    count: number;
    totalAmount: number;
    platformFee: number;
    sellerAmount: number;
  }>;
  summary: {
    totalRevenue: number;
    totalPlatformFees: number;
    totalEarnings: number;
    totalPaid: number;
    totalPending: number;
  };
}

export const sellerAnalyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSellerDashboard: builder.query<{ overview: DashboardOverview; growth: { ordersGrowth: string }; sellerInfo: any; recentOrders: any[] }, void>({
      query: () => '/sellers/me/dashboard',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['SellerDashboard'],
    }),
    getSellerAnalytics: builder.query<AnalyticsData, {
      startDate?: string;
      endDate?: string;
      period?: 'daily' | 'monthly';
    }>({
      query: (params) => ({
        url: '/sellers/me/analytics',
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ['SellerAnalytics'],
    }),
    getSellerRevenue: builder.query<RevenueData, {
      startDate?: string;
      endDate?: string;
    }>({
      query: (params) => ({
        url: '/sellers/me/revenue',
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ['SellerRevenue'],
    }),
  }),
});

export const { 
  useGetSellerDashboardQuery,
  useGetSellerAnalyticsQuery,
  useGetSellerRevenueQuery
} = sellerAnalyticsApi;


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
  totalUsers: number;
  totalSellers: number;
  verifiedSellers: number;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  platformFees: number;
  last30DaysOrders: number;
  last7DaysOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface RevenueDataPoint {
  _id: string;
  revenue: number;
  platformFees: number;
  ordersCount: number;
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
    // Dashboard overview with comprehensive metrics
    getAdminDashboard: builder.query<{ 
      overview: DashboardOverview; 
      growth: { ordersGrowth: string; revenueGrowth: string }; 
      recentOrders: any[] 
    }, void>({
      query: () => '/admin/dashboard',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminAnalytics'],
    }),

    // Revenue analytics over time
    getAdminRevenue: builder.query<RevenueDataPoint[], {
      startDate?: string;
      endDate?: string;
      period?: 'daily' | 'monthly';
    }>({
      query: (params) => ({
        url: '/admin/analytics/revenue',
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminAnalytics'],
    }),

    // Sales analytics with detailed breakdown
    getAdminSales: builder.query<AnalyticsData, { 
      startDate?: string; 
      endDate?: string;
      period?: 'daily' | 'monthly';
    }>({
      query: (params) => ({
        url: '/admin/analytics/sales',
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminAnalytics'],
    }),

    // User growth and demographics
    getAdminUserGrowth: builder.query<{ userGrowth: UserGrowth[]; usersByRole: any }, void>({
      query: () => '/admin/analytics/users',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminAnalytics'],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetAdminRevenueQuery,
  useGetAdminSalesQuery,
  useGetAdminUserGrowthQuery,
} = adminAnalyticsApi;


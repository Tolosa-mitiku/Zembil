import { api } from '@/core/http/api';

export interface AdminDashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  platformFees: number;
  newUsersToday: number;
  newOrdersToday: number;
}

export interface RecentActivity {
  type: 'user' | 'order' | 'product' | 'seller';
  description: string;
  timestamp: string;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  recentActivity: RecentActivity[];
}

export const adminDashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<AdminDashboardData, void>({
      query: () => '/admin/dashboard',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminDashboard'],
    }),
  }),
});

export const { useGetAdminDashboardQuery } = adminDashboardApi;


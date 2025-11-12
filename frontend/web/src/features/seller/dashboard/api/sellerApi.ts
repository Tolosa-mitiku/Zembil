import { api } from '@/core/http/api';

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  pendingOrders: number;
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
}

export interface RecentOrder {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  salesByDate?: Array<{ date: string; sales: number; revenue: number }>;
}

export const sellerDashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSellerDashboard: builder.query<DashboardData, void>({
      query: () => '/sellers/me/dashboard',
      transformResponse: (response: any) => {
        console.log('API Response:', response);
        const data = response.data || response;
        console.log('Transformed Data:', data);
        return data;
      },
      providesTags: ['SellerDashboard'],
    }),
  }),
});

export const { useGetSellerDashboardQuery } = sellerDashboardApi;


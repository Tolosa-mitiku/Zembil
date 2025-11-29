import { api } from '@/core/http/api';
import { UserRole, AccountStatus } from '@/core/constants';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  accountStatus: AccountStatus;
  createdAt: string;
  image?: string;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminUsersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<UsersResponse, {
      page?: number;
      limit?: number;
      role?: string;
      accountStatus?: string;
      search?: string;
    }>({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminUsers'],
    }),

    updateUserRole: builder.mutation<User, { id: string; role: UserRole }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['AdminUsers', 'AdminDashboard'],
    }),

    updateUserStatus: builder.mutation<User, { id: string; accountStatus: AccountStatus; reason?: string }>({
      query: ({ id, accountStatus, reason }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PUT',
        body: { accountStatus, reason },
      }),
      invalidatesTags: ['AdminUsers', 'AdminDashboard'],
    }),

    getUserStats: builder.query<{
      overview: {
        totalUsers: number;
        activeUsers: number;
        suspendedUsers: number;
        bannedUsers: number;
      };
      byRole: {
        buyers: number;
        sellers: number;
        admins: number;
      };
      growth: {
        last30Days: number;
        daily: Array<{ _id: string; count: number }>;
      };
    }, void>({
      query: () => '/admin/users/stats',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminUsers'],
    }),

    getUserDetails: builder.query<{
      user: User;
      orderStats?: {
        totalOrders: number;
        totalSpent: number;
      };
      sellerProfile?: any;
    }, string>({
      query: (id) => `/admin/users/${id}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminUsers'],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useGetUserStatsQuery,
  useGetUserDetailsQuery,
} = adminUsersApi;


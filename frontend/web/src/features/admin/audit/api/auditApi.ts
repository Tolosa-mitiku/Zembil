import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface AuditLog {
  id: string;
  action: string;
  adminId: string;
  adminName: string;
  targetType: string;
  targetId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'failure';
}

const mockLogs: AuditLog[] = [
  {
    id: 'log_1',
    action: 'UPDATE_USER_ROLE',
    adminId: 'adm_1',
    adminName: 'Super Admin',
    targetType: 'user',
    targetId: 'u123',
    details: 'Changed role from user to seller',
    ipAddress: '192.168.1.1',
    timestamp: new Date().toISOString(),
    status: 'success'
  },
  {
    id: 'log_2',
    action: 'DELETE_PRODUCT',
    adminId: 'adm_2',
    adminName: 'Content Moderator',
    targetType: 'product',
    targetId: 'p456',
    details: 'Removed prohibited item',
    ipAddress: '10.0.0.5',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'success'
  }
];

export const adminAuditApi = createApi({
  reducerPath: 'adminAuditApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/audit',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AuditLogs'],
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditLog[], void>({
      queryFn: () => ({ data: mockLogs }),
      providesTags: ['AuditLogs'],
    }),
  }),
});

export const {
  useGetAuditLogsQuery,
} = adminAuditApi;















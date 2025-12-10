import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  lastBackup: string;
  version: string;
}

const mockHealth: SystemHealth = {
  status: 'healthy',
  cpuUsage: 45,
  memoryUsage: 60,
  activeConnections: 1250,
  lastBackup: new Date(Date.now() - 3600000).toISOString(),
  version: '2.5.0'
};

export const adminSystemApi = createApi({
  reducerPath: 'adminSystemApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/system',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['System'],
  endpoints: (builder) => ({
    getSystemHealth: builder.query<SystemHealth, void>({
      queryFn: () => ({ data: mockHealth }),
      providesTags: ['System'],
    }),
    clearCache: builder.mutation<void, void>({
      queryFn: () => ({ data: undefined }),
    }),
  }),
});

export const {
  useGetSystemHealthQuery,
  useClearCacheMutation,
} = adminSystemApi;













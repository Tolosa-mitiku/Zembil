import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface SystemConfig {
  siteName: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  commissionRate: number;
  currency: string;
  supportEmail: string;
}

const mockConfig: SystemConfig = {
  siteName: 'Zembil Admin',
  maintenanceMode: false,
  allowNewRegistrations: true,
  commissionRate: 10,
  currency: 'ETB',
  supportEmail: 'support@zembil.com'
};

export const adminSettingsApi = createApi({
  reducerPath: 'adminSettingsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/settings',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    getSettings: builder.query<SystemConfig, void>({
      queryFn: () => ({ data: mockConfig }),
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<void, Partial<SystemConfig>>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = adminSettingsApi;













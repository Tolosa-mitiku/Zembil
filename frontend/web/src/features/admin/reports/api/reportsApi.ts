import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ReportConfig {
  id: string;
  name: string;
  type: 'sales' | 'users' | 'inventory';
  format: 'pdf' | 'csv' | 'excel';
  schedule: 'daily' | 'weekly' | 'monthly' | 'manual';
  lastRun: string;
}

const mockReports: ReportConfig[] = [
  {
    id: 'rpt_1',
    name: 'Monthly Revenue Report',
    type: 'sales',
    format: 'pdf',
    schedule: 'monthly',
    lastRun: new Date().toISOString()
  }
];

export const adminReportsApi = createApi({
  reducerPath: 'adminReportsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/reports',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Reports'],
  endpoints: (builder) => ({
    getReports: builder.query<ReportConfig[], void>({
      queryFn: () => ({ data: mockReports }),
      providesTags: ['Reports'],
    }),
    generateReport: builder.mutation<void, string>({
      queryFn: () => ({ data: undefined }),
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGenerateReportMutation,
} = adminReportsApi;















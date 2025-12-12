import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BulkOperation {
  id: string;
  type: 'import_products' | 'update_prices' | 'delete_users' | 'approve_sellers';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalItems: number;
  processedItems: number;
  failedItems: number;
  createdAt: string;
  completedAt?: string;
}

const mockOperations: BulkOperation[] = [
  {
    id: 'op_1',
    type: 'import_products',
    status: 'processing',
    progress: 45,
    totalItems: 1000,
    processedItems: 450,
    failedItems: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: 'op_2',
    type: 'update_prices',
    status: 'completed',
    progress: 100,
    totalItems: 500,
    processedItems: 500,
    failedItems: 0,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86000000).toISOString()
  }
];

export const adminBulkApi = createApi({
  reducerPath: 'adminBulkApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/bulk',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['BulkOperations'],
  endpoints: (builder) => ({
    getOperations: builder.query<BulkOperation[], void>({
      queryFn: () => ({ data: mockOperations }),
      providesTags: ['BulkOperations'],
    }),
    createOperation: builder.mutation<void, { type: string; file?: File }>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: ['BulkOperations'],
    }),
  }),
});

export const {
  useGetOperationsQuery,
  useCreateOperationMutation,
} = adminBulkApi;















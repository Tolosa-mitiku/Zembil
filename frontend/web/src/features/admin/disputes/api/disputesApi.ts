import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Dispute {
  id: string;
  orderId: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  reason: string;
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  evidence: { type: string; url: string; description: string }[];
}

const mockDisputes: Dispute[] = [
  {
    id: 'dsp_1',
    orderId: 'ord_999',
    buyerName: 'John Buyer',
    sellerName: 'Scam Seller?',
    amount: 500.00,
    reason: 'Item never arrived',
    status: 'investigating',
    priority: 'high',
    createdAt: new Date().toISOString(),
    evidence: []
  }
];

export const adminDisputesApi = createApi({
  reducerPath: 'adminDisputesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/disputes',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Disputes'],
  endpoints: (builder) => ({
    getDisputes: builder.query<Dispute[], void>({
      queryFn: () => ({ data: mockDisputes }),
      providesTags: ['Disputes'],
    }),
    resolveDispute: builder.mutation<void, { id: string; outcome: string }>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: ['Disputes'],
    }),
  }),
});

export const {
  useGetDisputesQuery,
  useResolveDisputeMutation,
} = adminDisputesApi;















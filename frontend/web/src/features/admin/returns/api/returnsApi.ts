import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface AdminReturnRequest {
  id: string;
  orderId: string;
  buyerName: string;
  sellerName: string;
  productName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'dispute';
  requestedAt: string;
  images: string[];
}

const mockReturns: AdminReturnRequest[] = [
  {
    id: 'ret_1',
    orderId: 'ord_123',
    buyerName: 'Alice Wonderland',
    sellerName: 'TechStore',
    productName: 'Wireless Headphones',
    amount: 199.99,
    reason: 'Defective product',
    status: 'dispute',
    requestedAt: new Date().toISOString(),
    images: []
  },
  {
    id: 'ret_2',
    orderId: 'ord_456',
    buyerName: 'Bob Builder',
    sellerName: 'FashionHub',
    productName: 'Leather Jacket',
    amount: 89.50,
    reason: 'Wrong size',
    status: 'pending',
    requestedAt: new Date(Date.now() - 86400000).toISOString(),
    images: []
  }
];

export const adminReturnsApi = createApi({
  reducerPath: 'adminReturnsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/returns',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Returns'],
  endpoints: (builder) => ({
    getReturns: builder.query<AdminReturnRequest[], void>({
      queryFn: () => ({ data: mockReturns }),
      providesTags: ['Returns'],
    }),
    resolveReturn: builder.mutation<void, { id: string; decision: 'approve' | 'reject'; notes?: string }>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: ['Returns'],
    }),
  }),
});

export const {
  useGetReturnsQuery,
  useResolveReturnMutation,
} = adminReturnsApi;





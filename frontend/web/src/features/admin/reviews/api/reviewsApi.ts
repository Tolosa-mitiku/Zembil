import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  sellerId: string;
  sellerName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'hidden' | 'flagged';
  helpfulCount: number;
}

const mockReviews: Review[] = [
  {
    id: 'rev_1',
    productId: 'prod_1',
    productName: 'Wireless Headphones',
    userId: 'u1',
    userName: 'John Doe',
    sellerId: 's1',
    sellerName: 'TechStore',
    rating: 4,
    comment: 'Great sound quality, but battery life could be better.',
    date: new Date().toISOString(),
    status: 'published',
    helpfulCount: 5
  },
  {
    id: 'rev_2',
    productId: 'prod_2',
    productName: 'Gaming Mouse',
    userId: 'u2',
    userName: 'Jane Smith',
    sellerId: 's1',
    sellerName: 'TechStore',
    rating: 1,
    comment: 'Fake product! Do not buy!',
    date: new Date(Date.now() - 86400000).toISOString(),
    status: 'flagged',
    helpfulCount: 12
  }
];

export const adminReviewsApi = createApi({
  reducerPath: 'adminReviewsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/reviews',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({
    getAllReviews: builder.query<Review[], void>({
      queryFn: () => ({ data: mockReviews }),
      providesTags: ['Reviews'],
    }),
    updateReviewStatus: builder.mutation<void, { id: string; status: 'published' | 'hidden' }>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: ['Reviews'],
    }),
    deleteReview: builder.mutation<void, string>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: ['Reviews'],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} = adminReviewsApi;













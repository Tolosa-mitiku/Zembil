import { api } from '@/core/http/api';

// Toggle this to switch between mock and real API
const USE_MOCK_DATA = false;

export interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    image?: string;
  };
  productId: {
    _id: string;
    title: string;
    images: string[];
  };
  sellerId: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  verifiedPurchase: boolean;
  helpful: number;
  helpfulBy: string[];
  status: 'pending' | 'approved' | 'rejected';
  sellerResponse?: {
    message: string;
    respondedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  ratingDistribution?: {
    _id: number;
    count: number;
  }[];
}

export interface ProductReviewsParams {
  productId: string;
  page?: number;
  limit?: number;
  rating?: number;
  sort?: string;
}

export interface AddSellerResponseParams {
  reviewId: string;
  message: string;
}

const reviewsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all reviews for seller's products
    getSellerReviews: builder.query<ReviewsResponse, { page?: number; limit?: number; rating?: number; sort?: string }>({
      query: ({ page = 1, limit = 10, rating, sort = '-createdAt' }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sort,
        });
        if (rating) {
          params.append('rating', rating.toString());
        }
        return `/seller/reviews?${params.toString()}`;
      },
      providesTags: ['Reviews'],
    }),

    // Get reviews for a specific product
    getProductReviews: builder.query<ReviewsResponse, ProductReviewsParams>({
      query: ({ productId, page = 1, limit = 10, rating, sort = '-createdAt' }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sort,
        });
        if (rating) {
          params.append('rating', rating.toString());
        }
        return `/reviews/products/${productId}?${params.toString()}`;
      },
      providesTags: ['Reviews'],
    }),

    // Add seller response to review
    addSellerResponse: builder.mutation<{ success: boolean; data: Review }, AddSellerResponseParams>({
      query: ({ reviewId, message }) => ({
        url: `/seller/reviews/${reviewId}/response`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: ['Reviews'],
    }),

    // Delete seller response
    deleteSellerResponse: builder.mutation<{ success: boolean }, string>({
      query: (reviewId) => ({
        url: `/seller/reviews/${reviewId}/response`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews'],
    }),
  }),
});

export const {
  useGetSellerReviewsQuery,
  useGetProductReviewsQuery,
  useAddSellerResponseMutation,
  useDeleteSellerResponseMutation,
} = reviewsApi;














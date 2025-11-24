import { api } from '../../../core/http/api';
import {
  Review,
  ReviewsResponse,
  AddReviewRequest,
  UpdateReviewRequest,
} from '../types/review.types';

export const reviewsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get product reviews
    getProductReviews: builder.query<
      ReviewsResponse,
      { productId: string; page?: number; limit?: number; rating?: number; sort?: string }
    >({
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
      providesTags: (result, error, { productId }) => [
        { type: 'Reviews' as const, id: productId },
      ],
    }),

    // Get seller reviews
    getSellerReviews: builder.query<
      ReviewsResponse,
      { sellerId: string; page?: number; limit?: number }
    >({
      query: ({ sellerId, page = 1, limit = 10 }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        return `/reviews/sellers/${sellerId}?${params.toString()}`;
      },
      providesTags: (result, error, { sellerId }) => [
        { type: 'SellerReviews' as const, id: sellerId },
      ],
    }),

    // Add product review
    addProductReview: builder.mutation<
      { success: boolean; message: string; data: Review },
      { productId: string; review: AddReviewRequest }
    >({
      query: ({ productId, review }) => ({
        url: `/reviews/products/${productId}`,
        method: 'POST',
        body: review,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Reviews' as const, id: productId },
        'SellerProducts',
      ],
    }),

    // Update review
    updateReview: builder.mutation<
      { success: boolean; message: string; data: Review },
      { reviewId: string; review: UpdateReviewRequest }
    >({
      query: ({ reviewId, review }) => ({
        url: `/reviews/${reviewId}`,
        method: 'PUT',
        body: review,
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: 'Reviews' as const, id: 'LIST' },
      ],
    }),

    // Delete review
    deleteReview: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Reviews' as const, id: 'LIST' }],
    }),

    // Mark review as helpful
    markReviewHelpful: builder.mutation<
      { success: boolean; message: string; data: { helpful: number } },
      string
    >({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/helpful`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, reviewId) => [
        { type: 'Reviews' as const, id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useGetSellerReviewsQuery,
  useAddProductReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useMarkReviewHelpfulMutation,
} = reviewsApi;






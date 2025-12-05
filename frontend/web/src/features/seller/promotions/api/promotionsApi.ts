import { api } from '@/core/http/api';

export interface Promotion {
  _id: string;
  productId: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  clicks?: number;
  sales?: number;
  revenue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionData {
  productIds: string[];
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

export interface UpdatePromotionData extends Partial<CreatePromotionData> {
  isActive?: boolean;
}

export interface PromotionsResponse {
  success: boolean;
  data: Promotion[];
}

export interface PromotionResponse {
  success: boolean;
  data: Promotion;
}

export interface PromotionStats {
  totalPromotions: number;
  activePromotions: number;
  totalRevenue: number;
  totalSales: number;
  avgDiscountRate: number;
  conversionRate: number;
}

export const sellerPromotionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all promotions for seller
    getSellerPromotions: builder.query<PromotionsResponse, void>({
      query: () => '/sellers/me/promotions',
      providesTags: ['Promotions'],
    }),

    // Get single promotion
    getPromotion: builder.query<PromotionResponse, string>({
      query: (id) => `/sellers/me/promotions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Promotions', id }],
    }),

    // Create promotion
    createPromotion: builder.mutation<PromotionResponse, CreatePromotionData>({
      query: (data) => ({
        url: '/sellers/me/promotions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Promotions', 'SellerProducts'],
    }),

    // Update promotion
    updatePromotion: builder.mutation<PromotionResponse, { id: string; data: UpdatePromotionData }>({
      query: ({ id, data }) => ({
        url: `/sellers/me/promotions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Promotions', id },
        'Promotions',
        'SellerProducts',
      ],
    }),

    // Delete promotion
    deletePromotion: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/sellers/me/promotions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Promotions', 'SellerProducts'],
    }),

    // Get promotion statistics
    getPromotionStats: builder.query<{ success: boolean; data: PromotionStats }, void>({
      query: () => '/sellers/me/promotions/stats',
      providesTags: ['Promotions'],
    }),

    // Toggle promotion status
    togglePromotion: builder.mutation<PromotionResponse, string>({
      query: (id) => ({
        url: `/sellers/me/promotions/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Promotions', id },
        'Promotions',
        'SellerProducts',
      ],
    }),
  }),
});

export const {
  useGetSellerPromotionsQuery,
  useGetPromotionQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useGetPromotionStatsQuery,
  useTogglePromotionMutation,
} = sellerPromotionsApi;






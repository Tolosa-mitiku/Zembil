import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Promotion {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  type: 'flash_sale' | 'discount' | 'coupon';
  status: 'pending' | 'active' | 'rejected' | 'expired';
  startDate: string;
  endDate: string;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
}

const mockPromotions: Promotion[] = [
  {
    id: 'promo_1',
    sellerId: 'sel_1',
    sellerName: 'TechGadgets Inc',
    title: 'Summer Tech Sale',
    description: '20% off on all electronics',
    type: 'flash_sale',
    status: 'pending',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 604800000).toISOString(), // +7 days
    discountValue: 20,
    discountType: 'percentage'
  },
  {
    id: 'promo_2',
    sellerId: 'sel_2',
    sellerName: 'Fashion Boutique',
    title: 'Winter Collection Launch',
    description: '$10 off on orders over $50',
    type: 'coupon',
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 2592000000).toISOString(), // +30 days
    discountValue: 10,
    discountType: 'fixed'
  }
];

export const adminPromotionsApi = createApi({
  reducerPath: 'adminPromotionsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/promotions',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Promotions'],
  endpoints: (builder) => ({
    getAllPromotions: builder.query<Promotion[], void>({
      queryFn: () => ({ data: mockPromotions }),
      providesTags: ['Promotions'],
    }),
    approvePromotion: builder.mutation<void, string>({
      queryFn: (id) => ({ data: undefined }),
      invalidatesTags: ['Promotions'],
    }),
    rejectPromotion: builder.mutation<void, string>({
      queryFn: (id) => ({ data: undefined }),
      invalidatesTags: ['Promotions'],
    }),
  }),
});

export const {
  useGetAllPromotionsQuery,
  useApprovePromotionMutation,
  useRejectPromotionMutation,
} = adminPromotionsApi;













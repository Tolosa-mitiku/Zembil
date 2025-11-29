import { api } from '@/core/http/api';
import { ProductStatus } from '@/core/constants';

export interface AdminProduct {
  _id: string;
  title: string;
  price: number;
  stock: number;
  status: ProductStatus;
  isFeatured: boolean;
  seller: {
    _id: string;
    userId: { name: string; email: string };
  };
  createdAt: string;
}

export const adminProductsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProducts: builder.query<{ products: AdminProduct[]; pagination: any }, {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }>({
      query: (params) => ({
        url: '/admin/products',
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminProducts'],
    }),

    featureProduct: builder.mutation<void, { id: string; isFeatured: boolean }>({
      query: ({ id, isFeatured }) => ({
        url: `/admin/products/${id}/feature`,
        method: 'PUT',
        body: { isFeatured },
      }),
      invalidatesTags: ['AdminProducts'],
    }),

    approveProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/products/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: ['AdminProducts'],
    }),

    rejectProduct: builder.mutation<void, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/products/${id}/reject`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['AdminProducts'],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminProducts'],
    }),
  }),
});

export const {
  useGetAdminProductsQuery,
  useFeatureProductMutation,
  useApproveProductMutation,
  useRejectProductMutation,
  useDeleteProductMutation,
} = adminProductsApi;


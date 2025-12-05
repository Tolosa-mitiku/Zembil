import { api } from '@/core/http/api';
import { ProductStatus } from '@/core/constants';

export interface AdminProduct {
  _id: string;
  sellerId?: string;
  title: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  stockQuantity?: number;
  category: string;
  brand?: string;
  sku?: string;
  images: string[];
  status: ProductStatus;
  isFeatured: boolean;
  rating?: number;
  averageRating?: number;
  reviewCount?: number;
  totalReviews?: number;
  sold?: number;
  totalSold?: number;
  views?: number;
  tags?: string[];
  seller?: {
    _id: string;
    userId: { name: string; email: string };
  };
  createdAt: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  success: boolean;
  products: AdminProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminProductsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProducts: builder.query<ProductsResponse, {
      page?: number;
      limit?: number;
      status?: string;
      category?: string;
      search?: string;
      sort?: string;
    }>({
      query: (params) => ({
        url: '/admin/products',
        params,
      }),
      transformResponse: (response: any) => {
        // Normalize the response to ensure consistent field names
        const products = (response.data?.products || response.products || []).map((product: any) => ({
          ...product,
          stock: product.stockQuantity ?? product.stock ?? 0,
          rating: product.averageRating ?? product.rating,
          reviewCount: product.totalReviews ?? product.reviewCount ?? 0,
          sold: product.totalSold ?? product.sold ?? 0,
          images: product.images || [],
        }));
        
        return {
          success: response.success ?? true,
          products,
          pagination: response.data?.pagination || response.pagination || {
            page: 1,
            limit: 20,
            total: products.length,
            totalPages: 1,
          },
        };
      },
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


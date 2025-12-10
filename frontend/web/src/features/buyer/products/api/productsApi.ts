/**
 * Products API
 * RTK Query API service for product operations
 */

import { api } from '../../../../core/http/api';
import {
  Product,
  ProductResponse,
  ProductsResponse,
  ProductQueryParams,
} from '../types/product.types';

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get product by ID
    getProductById: builder.query<ProductResponse, string>({
      query: (productId) => `/products/${productId}`,
      providesTags: (result, error, productId) => [
        { type: 'Products', id: productId },
      ],
      // Transform response to ensure consistent data structure
      transformResponse: (response: ProductResponse) => {
        // Normalize image format
        if (response.data.images && Array.isArray(response.data.images)) {
          response.data.images = response.data.images.map((img) => {
            if (typeof img === 'string') {
              return {
                url: img,
                isMain: false,
              };
            }
            return img;
          });
        }
        return response;
      },
    }),

    // Get all products with filters
    getProducts: builder.query<ProductsResponse, ProductQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        return `/products?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Products' as const, id: _id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),

    // Search products
    searchProducts: builder.query<ProductsResponse, { query: string; limit?: number; page?: number }>({
      query: ({ query, limit = 20, page = 1 }) => {
        const params = new URLSearchParams({
          q: query,
          limit: limit.toString(),
          page: page.toString(),
        });
        return `/products/search?${params.toString()}`;
      },
      providesTags: [{ type: 'Products', id: 'SEARCH' }],
    }),

    // Get featured products
    getFeaturedProducts: builder.query<ProductsResponse, { limit?: number }>({
      query: ({ limit = 10 }) => `/products/featured?limit=${limit}`,
      providesTags: [{ type: 'FeaturedProducts', id: 'LIST' }],
    }),

    // Get products by category
    getProductsByCategory: builder.query<ProductsResponse, { categoryId: string; page?: number; limit?: number }>({
      query: ({ categoryId, page = 1, limit = 20 }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        return `/products/category/${categoryId}?${params.toString()}`;
      },
      providesTags: (result, error, { categoryId }) => [
        { type: 'Products', id: `CATEGORY_${categoryId}` },
      ],
    }),

    // Get related products - fallback to same category if no specific endpoint
    getRelatedProducts: builder.query<ProductsResponse, { productId: string; limit?: number }>({
      async queryFn({ productId, limit = 4 }, _queryApi, _extraOptions, fetchWithBQ) {
        // First try to get the product to find its category
        const productResult = await fetchWithBQ(`/products/${productId}`);
        
        if (productResult.error) {
          return { error: productResult.error as any };
        }
        
        const product = (productResult.data as ProductResponse).data;
        const categoryId = typeof product.category === 'string' 
          ? product.category 
          : (product.category as any)?._id;
        
        // If product has relatedProducts field populated, use those
        if (product.relatedProducts && Array.isArray(product.relatedProducts) && product.relatedProducts.length > 0) {
          // Check if relatedProducts are populated objects or just IDs
          const firstItem = product.relatedProducts[0];
          if (typeof firstItem === 'object' && firstItem !== null && '_id' in firstItem) {
            return { 
              data: { 
                success: true, 
                data: product.relatedProducts.slice(0, limit) as any,
              } 
            };
          }
        }
        
        // Otherwise, fetch products from the same category
        if (categoryId) {
          const relatedResult = await fetchWithBQ(
            `/products?category=${categoryId}&limit=${limit}&status=active`
          );
          
          if (relatedResult.error) {
            return { error: relatedResult.error as any };
          }
          
          const relatedData = relatedResult.data as ProductsResponse;
          // Filter out the current product
          const filteredProducts = relatedData.data.filter(p => p._id !== productId);
          
          return {
            data: {
              ...relatedData,
              data: filteredProducts.slice(0, limit),
            },
          };
        }
        
        // If no category, return empty array
        return {
          data: {
            success: true,
            data: [],
          },
        };
      },
      providesTags: (result, error, { productId }) => [
        { type: 'Products', id: `RELATED_${productId}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetFeaturedProductsQuery,
  useGetProductsByCategoryQuery,
  useGetRelatedProductsQuery,
  useLazyGetProductByIdQuery,
  useLazySearchProductsQuery,
} = productsApi;


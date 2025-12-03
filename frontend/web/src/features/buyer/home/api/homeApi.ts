/**
 * Home Page API
 * 
 * RTK Query API for buyer homepage data
 * Includes: Featured products, categories, banners
 */

import { api } from '@/core/http/api';

// Types
export interface ProductImage {
  url: string;
  alt?: string;
  position?: number;
  isMain?: boolean;
}

export interface Product {
  _id: string;
  title: string;
  description?: string;
  category: string; // Can be ObjectId or name
  categoryNames?: string[]; // Array of category names from hierarchy
  subcategory?: string;
  images: ProductImage[];
  primaryImage?: string;
  pricing: {
    basePrice: number;
    salePrice?: number;
    currency: string;
  };
  inventory: {
    stockQuantity: number;
    trackInventory: boolean;
    lowStockThreshold?: number;
  };
  analytics: {
    views: number;
    averageRating: number;
    totalReviews: number;
    totalSold: number;
  };
  sellerId: {
    _id: string;
    businessInfo?: {
      businessName: string;
    };
    metrics?: {
      averageRating: number;
      totalReviews: number;
    };
    verification?: {
      status: string;
    };
  };
  status: 'active' | 'inactive' | 'pending' | 'archived';
  isFeatured: boolean;
  isOnSale: boolean;
  condition: 'new' | 'mint' | 'excellent' | 'good' | 'fair';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  productsCount: number;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  metadata?: {
    backgroundColor?: string;
    textColor?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
  buttonText?: string;
  type: 'hero' | 'promotional' | 'seasonal';
  position: 'top' | 'middle' | 'bottom';
  isActive: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  gradient?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'createdAt' | 'price' | 'rating' | 'sold';
  order?: 'asc' | 'desc';
  status?: 'active';
  isFeatured?: boolean;
  isOnSale?: boolean;
}

// API Slice
const homeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get featured products
    getFeaturedProducts: builder.query<Product[], { limit?: number }>({
      query: ({ limit = 10 } = {}) => ({
        url: `/products/featured`,
        params: { limit },
      }),
      transformResponse: (response: { success: boolean; data: Product[] }) => 
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'FeaturedProducts' as const, id: _id })),
              { type: 'FeaturedProducts' as const, id: 'LIST' },
            ]
          : [{ type: 'FeaturedProducts' as const, id: 'LIST' }],
    }),

    // Get all products with filters
    getProducts: builder.query<PaginatedResponse<Product>, ProductsQueryParams>({
      query: (params) => ({
        url: `/products`,
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.category && { category: params.category }),
          ...(params.minPrice && { minPrice: params.minPrice }),
          ...(params.maxPrice && { maxPrice: params.maxPrice }),
          ...(params.search && { search: params.search }),
          ...(params.sort && { sort: params.sort }),
          ...(params.order && { order: params.order }),
          ...(params.status && { status: params.status }),
          ...(params.isFeatured !== undefined && { isFeatured: params.isFeatured }),
          ...(params.isOnSale !== undefined && { isOnSale: params.isOnSale }),
        },
      }),
      providesTags: (result, error, params) => 
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Products' as const, id: _id })),
              { type: 'Products' as const, id: `PAGE-${params.page || 1}` },
              { type: 'Products' as const, id: 'LIST' },
            ]
          : [{ type: 'Products' as const, id: 'LIST' }],
      // Keep unused data for 60 seconds
      keepUnusedDataFor: 60,
    }),

    // Get products by category
    getProductsByCategory: builder.query<
      PaginatedResponse<Product>,
      { category: string; page?: number; limit?: number }
    >({
      query: ({ category, page = 1, limit = 20 }) => ({
        url: `/products/category/${category}`,
        params: { page, limit },
      }),
      providesTags: (result, error, { category }) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Products' as const, id: _id })),
              { type: 'Products' as const, id: `CATEGORY-${category}` },
            ]
          : [{ type: 'Products' as const, id: `CATEGORY-${category}` }],
      keepUnusedDataFor: 60,
    }),

    // Search products
    searchProducts: builder.query<
      PaginatedResponse<Product>,
      { 
        query: string; 
        page?: number; 
        limit?: number;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
        condition?: string;
        inStockOnly?: string;
        sort?: string;
        order?: string;
      }
    >({
      query: ({ query, page = 1, limit = 20, ...filters }) => ({
        url: `/products/search`,
        params: { 
          q: query, 
          page, 
          limit,
          ...(filters.category && { category: filters.category }),
          ...(filters.minPrice && { minPrice: filters.minPrice }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          ...(filters.minRating && { minRating: filters.minRating }),
          ...(filters.condition && { condition: filters.condition }),
          ...(filters.inStockOnly && { inStockOnly: filters.inStockOnly }),
          ...(filters.sort && { sort: filters.sort }),
          ...(filters.order && { order: filters.order }),
        },
      }),
      providesTags: (result, error, { query }) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Products' as const, id: _id })),
              { type: 'Products' as const, id: `SEARCH-${query}` },
            ]
          : [{ type: 'Products' as const, id: `SEARCH-${query}` }],
      keepUnusedDataFor: 30, // Search results cached for 30 seconds
    }),

    // Get all categories
    getCategories: builder.query<Category[], { includeInactive?: boolean }>({
      query: ({ includeInactive = false } = {}) => ({
        url: `/categories`,
        params: { includeInactive: includeInactive ? 'true' : 'false' },
      }),
      transformResponse: (response: { success: boolean; data: Category[] }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Categories' as const, id: _id })),
              { type: 'Categories' as const, id: 'LIST' },
            ]
          : [{ type: 'Categories' as const, id: 'LIST' }],
      // Categories don't change often, cache for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // Get category by slug
    getCategoryBySlug: builder.query<
      Category & { subcategories?: Category[] },
      string
    >({
      query: (slug) => `/categories/${slug}`,
      transformResponse: (response: { success: boolean; data: Category & { subcategories?: Category[] } }) =>
        response.data,
      providesTags: (result, error, slug) =>
        result
          ? [{ type: 'Categories' as const, id: result._id }]
          : [{ type: 'Categories' as const, id: slug }],
      keepUnusedDataFor: 300,
    }),

    // Get active banners
    getBanners: builder.query<Banner[], { type?: string; position?: string }>({
      query: (params = {}) => ({
        url: `/banners`,
        params: {
          isActive: 'true',
          ...(params.type && { type: params.type }),
          ...(params.position && { position: params.position }),
        },
      }),
      transformResponse: (response: { success: boolean; data: Banner[] }) =>
        response.data,
      providesTags: ['Banners'],
      keepUnusedDataFor: 300, // Cache banners for 5 minutes
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useGetFeaturedProductsQuery,
  useGetProductsQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useGetBannersQuery,
} = homeApi;

export default homeApi;


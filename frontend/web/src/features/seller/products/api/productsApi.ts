import { api } from '@/core/http/api';
import { ProductStatus } from '@/core/constants';
import { mockProducts, getMockProductsPage } from '../data/mockProducts';

// Toggle this to switch between mock and real API
const USE_MOCK_DATA = true;

export interface Product {
  _id: string;
  sellerId?: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number; // Maps to stockQuantity in backend
  stockQuantity?: number; // Backend field name
  category: string;
  brand?: string;
  sku?: string;
  images: string[];
  status: ProductStatus;
  isFeatured: boolean;
  rating?: number; // Maps to averageRating in backend
  averageRating?: number; // Backend field name
  reviewCount?: number;
  totalReviews?: number; // Backend field name
  sold?: number; // Maps to totalSold in backend
  totalSold?: number; // Backend field name
  views?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock?: number; // Frontend field
  stockQuantity?: number; // Backend field
  category: string;
  brand?: string;
  sku?: string;
  images: string[];
  isFeatured?: boolean;
  tags?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  status?: ProductStatus;
}

export const sellerProductsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSellerProducts: builder.query<ProductsResponse, {
      page?: number;
      limit?: number;
      status?: string;
      category?: string;
      search?: string;
      sort?: string;
    }>({
      queryFn: async (params) => {
        // Use mock data if enabled
        if (USE_MOCK_DATA) {
          const page = params.page || 1;
          const limit = params.limit || 12;
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Filter mock data based on params
          let filteredProducts = [...mockProducts];
          
          // Filter by status
          if (params.status) {
            filteredProducts = filteredProducts.filter(p => p.status === params.status);
          }
          
          // Filter by category
          if (params.category) {
            filteredProducts = filteredProducts.filter(p => p.category === params.category);
          }
          
          // Filter by search
          if (params.search) {
            const searchLower = params.search.toLowerCase();
            filteredProducts = filteredProducts.filter(p =>
              p.title.toLowerCase().includes(searchLower) ||
              p.description?.toLowerCase().includes(searchLower) ||
              p.category?.toLowerCase().includes(searchLower) ||
              p.brand?.toLowerCase().includes(searchLower) ||
              p.sku?.toLowerCase().includes(searchLower)
            );
          }
          
          // Sort
          if (params.sort) {
            const [field, order] = params.sort.startsWith('-') 
              ? [params.sort.slice(1), 'desc']
              : [params.sort, 'asc'];
              
            filteredProducts.sort((a: any, b: any) => {
              const aVal = a[field] || 0;
              const bVal = b[field] || 0;
              return order === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
            });
          }
          
          // Paginate
          const start = (page - 1) * limit;
          const end = start + limit;
          const paginatedProducts = filteredProducts.slice(start, end);
          
          return {
            data: {
              success: true,
              data: paginatedProducts,
              pagination: {
                page,
                limit,
                total: filteredProducts.length,
                totalPages: Math.ceil(filteredProducts.length / limit),
              },
            },
          };
        }
        
        // Real API call
        try {
          const response = await fetch(`/api/v1/sellers/me/products?${new URLSearchParams(params as any)}`);
          const data = await response.json();
          
          if (data.success && data.data) {
            const transformedData = data.data.map((product: any) => ({
              ...product,
              stock: product.stockQuantity ?? product.stock ?? 0,
              rating: product.averageRating ?? product.rating,
              reviewCount: product.totalReviews ?? product.reviewCount ?? 0,
              sold: product.totalSold ?? product.sold ?? 0,
            }));
            
            return {
              data: {
                success: data.success,
                data: transformedData,
                pagination: data.pagination,
              },
            };
          }
          
          return {
            data: {
              success: true,
              data: [],
              pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
            },
          };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to fetch products',
            },
          };
        }
      },
      providesTags: ['SellerProducts'],
    }),

    createProduct: builder.mutation<Product, CreateProductData>({
      queryFn: async (data) => {
        // Use mock data if enabled
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newProduct: Product = {
            _id: `mock-${Date.now()}`,
            ...data,
            stock: data.stock || data.stockQuantity || 0,
            status: 'active',
            isFeatured: data.isFeatured || false,
            rating: 0,
            averageRating: 0,
            reviewCount: 0,
            totalReviews: 0,
            sold: 0,
            totalSold: 0,
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          // Add to mock products (in memory only)
          mockProducts.unshift(newProduct);
          
          return { data: newProduct };
        }
        
        // Real API call
        try {
          const backendData = {
            ...data,
            stockQuantity: data.stock ?? data.stockQuantity ?? 0,
          };
          delete (backendData as any).stock;
          
          const response = await fetch('/api/v1/sellers/me/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(backendData),
          });
          
          const result = await response.json();
          
          if (result.success && result.data) {
            return {
              data: {
                ...result.data,
                stock: result.data.stockQuantity ?? 0,
                rating: result.data.averageRating,
                reviewCount: result.data.totalReviews ?? 0,
                sold: result.data.totalSold ?? 0,
              },
            };
          }
          
          return { error: { status: 'CUSTOM_ERROR', error: 'Failed to create product' } };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to create product',
            },
          };
        }
      },
      invalidatesTags: ['SellerProducts', 'SellerDashboard'],
    }),

    updateProduct: builder.mutation<Product, { id: string; data: UpdateProductData }>({
      queryFn: async ({ id, data }) => {
        // Use mock data if enabled
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const productIndex = mockProducts.findIndex(p => p._id === id);
          if (productIndex !== -1) {
            mockProducts[productIndex] = {
              ...mockProducts[productIndex],
              ...data,
              stock: data.stock ?? mockProducts[productIndex].stock,
              updatedAt: new Date().toISOString(),
            };
            return { data: mockProducts[productIndex] };
          }
          
          return { error: { status: 404, error: 'Product not found' } };
        }
        
        // Real API call
        try {
          const backendData: any = { ...data };
          if (data.stock !== undefined) {
            backendData.stockQuantity = data.stock;
            delete backendData.stock;
          }
          
          const response = await fetch(`/api/v1/sellers/me/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(backendData),
          });
          
          const result = await response.json();
          
          if (result.success && result.data) {
            return {
              data: {
                ...result.data,
                stock: result.data.stockQuantity ?? 0,
                rating: result.data.averageRating,
                reviewCount: result.data.totalReviews ?? 0,
                sold: result.data.totalSold ?? 0,
              },
            };
          }
          
          return { error: { status: 'CUSTOM_ERROR', error: 'Failed to update product' } };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to update product',
            },
          };
        }
      },
      invalidatesTags: ['SellerProducts', 'SellerDashboard'],
    }),

    updateProductStock: builder.mutation<Product, { id: string; stock: number }>({
      query: ({ id, stock }) => ({
        url: `/sellers/me/products/${id}/stock`,
        method: 'PUT',
        body: { stockQuantity: stock }, // Backend expects stockQuantity
      }),
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          return {
            ...response.data,
            stock: response.data.stockQuantity ?? 0,
          };
        }
        return response;
      },
      invalidatesTags: ['SellerProducts', 'SellerDashboard'],
    }),

    deleteProduct: builder.mutation<void, string>({
      queryFn: async (id) => {
        // Use mock data if enabled
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 600));
          
          const productIndex = mockProducts.findIndex(p => p._id === id);
          if (productIndex !== -1) {
            mockProducts.splice(productIndex, 1);
            return { data: undefined };
          }
          
          return { error: { status: 404, error: 'Product not found' } };
        }
        
        // Real API call
        try {
          await fetch(`/api/v1/sellers/me/products/${id}`, {
            method: 'DELETE',
          });
          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to delete product',
            },
          };
        }
      },
      invalidatesTags: ['SellerProducts', 'SellerDashboard'],
    }),

    bulkUploadProducts: builder.mutation<void, CreateProductData[]>({
      query: (products) => {
        // Transform all products to backend format
        const backendProducts = products.map(product => {
          const backendProduct: any = {
            ...product,
            stockQuantity: product.stock ?? product.stockQuantity ?? 0,
          };
          delete backendProduct.stock;
          return backendProduct;
        });
        
        return {
          url: '/sellers/me/products/bulk',
          method: 'POST',
          body: { products: backendProducts },
        };
      },
      invalidatesTags: ['SellerProducts', 'SellerDashboard'],
    }),

    getSellerProduct: builder.query<Product, string>({
      queryFn: async (id) => {
        // Use mock data if enabled
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 600));
          
          const product = mockProducts.find(p => p._id === id);
          if (product) {
            return { data: product };
          }
          
          return { error: { status: 404, error: 'Product not found' } };
        }
        
        // Real API call
        try {
          const response = await fetch(`/api/v1/sellers/me/products/${id}`);
          const result = await response.json();
          
          if (result.success && result.data) {
            return {
              data: {
                ...result.data,
                stock: result.data.stockQuantity ?? 0,
                rating: result.data.averageRating,
                reviewCount: result.data.totalReviews ?? 0,
                sold: result.data.totalSold ?? 0,
              },
            };
          }
          
          return { error: { status: 404, error: 'Product not found' } };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to fetch product',
            },
          };
        }
      },
      providesTags: (result, error, id) => [{ type: 'SellerProducts', id }],
    }),
  }),
});

export const {
  useGetSellerProductsQuery,
  useGetSellerProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStockMutation,
  useDeleteProductMutation,
  useBulkUploadProductsMutation,
} = sellerProductsApi;


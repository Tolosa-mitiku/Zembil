import { api } from '@/core/http/api';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  displayOrder: number;
  productCount?: number;
  createdAt: string;
}

export const adminCategoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCategories: builder.query<{ categories: Category[] }, void>({
      query: () => '/admin/categories',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminCategories'],
    }),

    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (data) => ({
        url: '/admin/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AdminCategories'],
    }),

    updateCategory: builder.mutation<Category, { id: string; data: Partial<Category> }>({
      query: ({ id, data }) => ({
        url: `/admin/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AdminCategories'],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminCategories'],
    }),
  }),
});

export const {
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = adminCategoriesApi;


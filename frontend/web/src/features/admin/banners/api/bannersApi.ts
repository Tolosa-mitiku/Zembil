import { api } from '@/core/http/api';

export interface Banner {
  _id: string;
  title: string;
  image: string;
  link?: string;
  placement: string;
  targetAudience: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  clicks?: number;
  createdAt: string;
}

export const adminBannersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminBanners: builder.query<{ banners: Banner[] }, void>({
      query: () => '/admin/banners',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminBanners'],
    }),

    createBanner: builder.mutation<Banner, Partial<Banner>>({
      query: (data) => ({
        url: '/admin/banners',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AdminBanners'],
    }),

    updateBanner: builder.mutation<Banner, { id: string; data: Partial<Banner> }>({
      query: ({ id, data }) => ({
        url: `/admin/banners/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AdminBanners'],
    }),

    toggleBanner: builder.mutation<Banner, string>({
      query: (id) => ({
        url: `/admin/banners/${id}/toggle`,
        method: 'PUT',
      }),
      invalidatesTags: ['AdminBanners'],
    }),

    deleteBanner: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminBanners'],
    }),
  }),
});

export const {
  useGetAdminBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useToggleBannerMutation,
  useDeleteBannerMutation,
} = adminBannersApi;


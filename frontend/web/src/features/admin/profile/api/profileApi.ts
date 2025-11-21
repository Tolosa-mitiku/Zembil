import { api } from '@/core/http/api';

// Types
export interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  coverImage?: string;
  role: string;
  
  // Business Information (reused for department/division info)
  businessName?: string;
  businessRegistrationNumber?: string;
  taxId?: string;
  businessAddress?: string;
  businessDescription?: string;
  businessCategory?: string;
  businessLogo?: string;
  operatingHours?: OperatingHours;
  socialMedia?: SocialMediaLinks;
  
  // Account Status
  verificationStatus: 'pending' | 'verified' | 'rejected';
  accountStatus: 'active' | 'suspended' | 'banned';
  
  // Timestamps
  createdAt: string;
  lastLoginAt?: string;
  
  // Statistics
  profileCompletion?: number;
  totalRevenue?: number;
  totalOrders?: number;
  totalProducts?: number;
  customerSatisfaction?: number;
  responseRate?: number;
  averageResponseTime?: number;
}

export interface OperatingHours {
  monday?: { open: string; close: string; closed?: boolean };
  tuesday?: { open: string; close: string; closed?: boolean };
  wednesday?: { open: string; close: string; closed?: boolean };
  thursday?: { open: string; close: string; closed?: boolean };
  friday?: { open: string; close: string; closed?: boolean };
  saturday?: { open: string; close: string; closed?: boolean };
  sunday?: { open: string; close: string; closed?: boolean };
}

export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  businessName?: string;
  businessRegistrationNumber?: string;
  taxId?: string;
  businessAddress?: string;
  businessDescription?: string;
  businessCategory?: string;
  operatingHours?: OperatingHours;
  socialMedia?: SocialMediaLinks;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileStats {
  revenue: {
    total: number;
    thisMonth: number;
    trend: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
  };
  performance: {
    customerSatisfaction: number;
    responseRate: number;
    averageResponseTime: number;
  };
}

export interface NotificationPreferences {
  email: {
    orders: boolean;
    products: boolean;
    messages: boolean;
    marketing: boolean;
    system: boolean;
  };
  sms: {
    orders: boolean;
    products: boolean;
    messages: boolean;
  };
  push: {
    orders: boolean;
    products: boolean;
    messages: boolean;
    marketing: boolean;
    system: boolean;
  };
  frequency: 'instant' | 'daily' | 'weekly';
}

export interface ActiveSession {
  _id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export const adminProfileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get admin profile
    getAdminProfile: builder.query<AdminProfile, void>({
      query: () => '/admin/me',
      transformResponse: (response: any) => {
        console.log('Admin Profile API Response:', response);
        return response.data || response;
      },
      providesTags: ['AdminProfile'],
    }),
    
    // Update admin profile
    updateAdminProfile: builder.mutation<AdminProfile, UpdateProfileRequest>({
      query: (data) => ({
        url: '/admin/me',
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any) => response.data || response,
      invalidatesTags: ['AdminProfile'],
    }),
    
    // Upload profile avatar
    uploadProfileAvatar: builder.mutation<{ image: string }, FormData>({
      query: (formData) => ({
        url: '/admin/me/avatar',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any) => response.data || response,
      invalidatesTags: ['AdminProfile'],
    }),

    // Upload cover image
    uploadCoverImage: builder.mutation<{ coverImage: string }, FormData>({
      query: (formData) => ({
        url: '/admin/me/cover-image',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any) => response.data || response,
      invalidatesTags: ['AdminProfile'],
    }),
    
    // Change password
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => ({
        url: '/admin/me/password',
        method: 'PUT',
        body: data,
      }),
    }),
    
    // Get profile statistics
    getAdminProfileStats: builder.query<ProfileStats, void>({
      query: () => '/admin/me/stats',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminDashboard'],
    }),
    
    // Get notification preferences
    getAdminNotificationPreferences: builder.query<NotificationPreferences, void>({
      query: () => '/admin/me/notifications',
      transformResponse: (response: any) => response.data || response,
    }),
    
    // Update notification preferences
    updateAdminNotificationPreferences: builder.mutation<NotificationPreferences, Partial<NotificationPreferences>>({
      query: (data) => ({
        url: '/admin/me/notifications',
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any) => response.data || response,
    }),
    
    // Get active sessions
    getAdminActiveSessions: builder.query<ActiveSession[], void>({
      query: () => '/admin/me/sessions',
      transformResponse: (response: any) => response.data || response,
    }),
    
    // Terminate session
    terminateAdminSession: builder.mutation<void, string>({
      query: (sessionId) => ({
        url: `/admin/me/sessions/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminProfile'],
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useUploadProfileAvatarMutation,
  useUploadCoverImageMutation,
  useChangePasswordMutation,
  useGetAdminProfileStatsQuery,
  useGetAdminNotificationPreferencesQuery,
  useUpdateAdminNotificationPreferencesMutation,
  useGetAdminActiveSessionsQuery,
  useTerminateAdminSessionMutation,
} = adminProfileApi;


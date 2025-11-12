import { api } from '@/core/http/api';

// Types
export interface SellerProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  coverImage?: string; // Added coverImage
  role: string;
  
  // Business Information
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

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get seller profile
    getSellerProfile: builder.query<SellerProfile, void>({
      query: () => '/sellers/me',
      transformResponse: (response: any) => {
        console.log('Profile API Response:', response);
        return response.data || response;
      },
      providesTags: ['SellerProfile'],
    }),
    
    // Update seller profile
    updateSellerProfile: builder.mutation<SellerProfile, UpdateProfileRequest>({
      query: (data) => ({
        url: '/sellers/me',
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any) => response.data || response,
      invalidatesTags: ['SellerProfile'],
    }),
    
    // Upload profile avatar
    uploadProfileAvatar: builder.mutation<{ image: string }, FormData>({
      query: (formData) => ({
        url: '/sellers/me/avatar',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any) => response.data || response,
      invalidatesTags: ['SellerProfile'],
    }),

    // Upload cover image
    uploadCoverImage: builder.mutation<{ coverImage: string }, FormData>({
      query: (formData) => ({
        url: '/sellers/me/cover-image', // Assuming this endpoint exists or will exist
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any) => response.data || response,
      invalidatesTags: ['SellerProfile'],
    }),
    
    // Change password
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => ({
        url: '/sellers/me/password',
        method: 'PUT',
        body: data,
      }),
    }),
    
    // Get profile statistics
    getProfileStats: builder.query<ProfileStats, void>({
      query: () => '/sellers/me/stats',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['SellerDashboard'],
    }),
    
    // Get notification preferences
    getNotificationPreferences: builder.query<NotificationPreferences, void>({
      query: () => '/sellers/me/notifications',
      transformResponse: (response: any) => response.data || response,
    }),
    
    // Update notification preferences
    updateNotificationPreferences: builder.mutation<NotificationPreferences, Partial<NotificationPreferences>>({
      query: (data) => ({
        url: '/sellers/me/notifications',
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any) => response.data || response,
    }),
    
    // Get active sessions
    getActiveSessions: builder.query<ActiveSession[], void>({
      query: () => '/sellers/me/sessions',
      transformResponse: (response: any) => response.data || response,
    }),
    
    // Terminate session
    terminateSession: builder.mutation<void, string>({
      query: (sessionId) => ({
        url: `/sellers/me/sessions/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SellerProfile'],
    }),
  }),
});

export const {
  useGetSellerProfileQuery,
  useUpdateSellerProfileMutation,
  useUploadProfileAvatarMutation,
  useUploadCoverImageMutation,
  useChangePasswordMutation,
  useGetProfileStatsQuery,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
  useGetActiveSessionsQuery,
  useTerminateSessionMutation,
} = profileApi;

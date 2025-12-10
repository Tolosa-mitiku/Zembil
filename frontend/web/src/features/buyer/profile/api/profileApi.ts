/**
 * Buyer Profile API
 * RTK Query API service for buyer profile operations
 */

import { api } from '@/core/http/api';

// ============= INTERFACES =============

export interface BuyerProfile {
  _id: string;
  userId: string;
  firebaseUID: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  displayName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  
  // Contact
  email?: string;
  phoneNumber?: string;
  profileImage?: string;
  
  // Shopping Preferences
  preferences?: {
    favoriteCategories?: string[];
    preferredBrands?: string[];
    sizePreferences?: {
      clothing?: string;
      shoes?: string;
    };
    priceRange?: {
      min?: number;
      max?: number;
    };
    notifyWhenBackInStock?: boolean;
    saveForLater?: boolean;
  };
  
  // Loyalty & Rewards Program
  loyalty?: {
    tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
    points?: number;
    pointsLifetime?: number;
    tierUpgradeDate?: string;
    nextTierRequirement?: number;
  };
  
  // Shopping Behavior Analytics
  analytics?: {
    averageOrderValue?: number;
    totalOrders?: number;
    totalSpent?: number;
    lastOrderDate?: string;
    favoritePaymentMethod?: string;
    mostOrderedCategory?: string;
    abandonedCarts?: number;
  };
  
  // Communication Preferences
  communicationPreferences?: {
    preferredContactMethod?: 'email' | 'sms' | 'phone' | 'push';
    bestTimeToContact?: {
      start?: string;
      end?: string;
      timezone?: string;
    };
  };
  
  // Social Features
  social?: {
    followedSellers?: string[];
    followedBy?: number;
    publicProfile?: boolean;
    allowReviews?: boolean;
  };
  
  // Trust & Safety
  trust?: {
    trustScore?: number;
    fraudAlerts?: number;
    lastFraudCheck?: string;
    verifiedPurchaser?: boolean;
    verifiedReviewer?: boolean;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBuyerProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  preferences?: {
    favoriteCategories?: string[];
    preferredBrands?: string[];
    sizePreferences?: {
      clothing?: string;
      shoes?: string;
    };
    priceRange?: {
      min?: number;
      max?: number;
    };
    notifyWhenBackInStock?: boolean;
    saveForLater?: boolean;
  };
  communicationPreferences?: {
    preferredContactMethod?: 'email' | 'sms' | 'phone' | 'push';
    bestTimeToContact?: {
      start?: string;
      end?: string;
      timezone?: string;
    };
  };
}

// ============= API SLICE =============

export const buyerProfileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get current buyer's profile
    getMyBuyerProfile: builder.query<BuyerProfile, void>({
      query: () => '/buyers/me',
      transformResponse: (response: { success: boolean; data: BuyerProfile }) =>
        response.data,
      providesTags: ['BuyerProfile'],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // Get buyer profile by ID
    getBuyerProfileById: builder.query<BuyerProfile, string>({
      query: (id) => `/buyers/${id}`,
      transformResponse: (response: { success: boolean; data: BuyerProfile }) =>
        response.data,
      providesTags: (result, error, id) => [{ type: 'BuyerProfile', id }],
      keepUnusedDataFor: 300,
    }),

    // Update buyer profile
    updateBuyerProfile: builder.mutation<BuyerProfile, { id: string; data: UpdateBuyerProfileData }>({
      query: ({ id, data }) => ({
        url: `/buyers/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: { success: boolean; data: BuyerProfile; message: string }) =>
        response.data,
      invalidatesTags: ['BuyerProfile'],
    }),

    // Upload profile picture
    uploadProfilePicture: builder.mutation<{ profileImage: string }, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('image', file);
        return {
          url: `/buyers/${id}/profile-picture`,
          method: 'PUT',
          body: formData,
        };
      },
      transformResponse: (response: { success: boolean; data: { profileImage: string } }) =>
        response.data,
      invalidatesTags: ['BuyerProfile'],
    }),

    // Upload cover image
    uploadCoverImage: builder.mutation<{ coverImage: string }, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('image', file);
        return {
          url: `/buyers/${id}/cover-image`,
          method: 'PUT',
          body: formData,
        };
      },
      transformResponse: (response: { success: boolean; data: { coverImage: string } }) =>
        response.data,
      invalidatesTags: ['BuyerProfile'],
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useGetMyBuyerProfileQuery,
  useGetBuyerProfileByIdQuery,
  useUpdateBuyerProfileMutation,
  useUploadProfilePictureMutation,
  useUploadCoverImageMutation,
} = buyerProfileApi;


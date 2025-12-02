import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { onAuthStateChanged } from 'firebase/auth';
import { API_BASE_URL } from '../constants';
import { auth } from '../firebase/config';

/**
 * Wait for Firebase auth to be ready
 * This ensures we don't make API calls before Firebase has restored the auth session
 */
const waitForAuth = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // If auth is already initialized and we have a user, resolve immediately
    if (auth.currentUser) {
      console.log('🔐 Auth already initialized, user present:', auth.currentUser.email);
      resolve(true);
      return;
    }

    // Set a timeout to prevent indefinite waiting
    const timeout = setTimeout(() => {
      console.warn('⏰ Auth initialization timeout - no user found after 3s');
      resolve(false);
    }, 3000);

    // Listen for auth state change (fires once auth is ready)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout);
      unsubscribe();
      if (user) {
        console.log('🔐 Auth initialized, user found:', user.email);
        resolve(true);
      } else {
        console.log('🔐 Auth initialized, no user logged in');
        resolve(false);
      }
    });
  });
};

// Base query with auth token
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    try {
      // Wait for Firebase auth to be ready before getting token
      const hasUser = await waitForAuth();
      
      if (!hasUser) {
        console.warn('⚠️ No authenticated user - request will be sent without Authorization header');
        return headers;
      }

      const user = auth.currentUser;
      if (user) {
        console.log('🔑 Getting ID token for user:', user.email);
        const token = await user.getIdToken();
        
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
          console.log('✅ Authorization header set successfully');
        } else {
          console.error('❌ Failed to get ID token - token is null/undefined');
        }
      } else {
        console.warn('⚠️ auth.currentUser is null after waitForAuth resolved with user');
      }
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
    }
    return headers;
  },
});

// Enhanced base query with automatic token refresh and retry logic
const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Log the request being made
  const requestUrl = typeof args === 'string' ? args : args.url;
  console.log(`📡 API Request: ${requestUrl}`);

  let result = await baseQueryWithAuth(args, api, extraOptions);

  // Handle authentication errors
  if (result.error && result.error.status === 401) {
    const errorData = result.error.data as any;
    console.error('🔴 401 Unauthorized Error:', {
      url: requestUrl,
      code: errorData?.code,
      message: errorData?.message,
    });
    
    if (errorData?.code === 'TOKEN_EXPIRED') {
      // Try to refresh the token
      try {
        const user = auth.currentUser;
        if (user) {
          console.log('🔄 Token expired, refreshing...');
          await user.getIdToken(true); // Force refresh
          console.log('✅ Token refreshed successfully, retrying request...');
          
          // Retry the original request with fresh token
          result = await baseQueryWithAuth(args, api, extraOptions);
        } else {
          console.error('❌ No user found when trying to refresh token');
          // No user, redirect to login
          window.location.href = '/signup';
        }
      } catch (error) {
        console.error('❌ Error refreshing token:', error);
        // If refresh fails, sign out
        await auth.signOut();
        window.location.href = '/signup';
      }
    } else if (errorData?.code === 'TOKEN_REVOKED' || errorData?.code === 'INVALID_TOKEN') {
      console.error('❌ Token revoked or invalid, signing out...');
      // Token is invalid, sign out
      await auth.signOut();
      window.location.href = '/signup';
    } else if (!errorData?.code) {
      // No specific error code - token might not have been sent
      console.error('❌ 401 without specific code - check if Authorization header was sent');
      console.log('🔍 Current auth state:', {
        hasCurrentUser: !!auth.currentUser,
        userEmail: auth.currentUser?.email || 'N/A',
      });
    }
  }

  // Log successful responses
  if (!result.error) {
    console.log(`✅ API Response success: ${requestUrl}`);
  }

  return result;
};

// Base API configuration
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    // Buyer tags
    'Products',
    'FeaturedProducts',
    'Categories',
    'Banners',
    'Reviews',
    'Cart',
    'Wishlist',
    'Orders',
    'Profile',
    'BuyerProfile',
    'Chat',
    'Message',
    // Seller tags
    'SellerDashboard',
    'SellerProducts',
    'SellerOrders',
    'SellerAnalytics',
    'SellerFinance',
    'SellerProfile',
    'Promotions',
    'SellerReviews',
    // Admin tags
    'AdminDashboard',
    'AdminUsers',
    'AdminSellers',
    'AdminProducts',
    'AdminOrders',
    'AdminCategories',
    'AdminBanners',
    'AdminAnalytics',
  ],
  endpoints: () => ({}),
});


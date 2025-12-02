/**
 * Authentication Interceptor
 * 
 * Automatically attaches Firebase ID token to all API requests
 * Handles token refresh and authentication errors
 */

import { auth } from '@/core/firebase/config';

/**
 * Get fresh ID token for API requests
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    // Get fresh token (cached by Firebase, only refreshed when needed)
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Fetch wrapper that automatically adds authentication
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  try {
    // Get auth token
    const token = await getAuthToken();

    // Prepare headers
    const headers = new Headers(options.headers || {});
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json');
    }

    // Make request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle authentication errors
    if (response.status === 401) {
      const data = await response.json().catch(() => ({}));
      
      if (data.code === 'TOKEN_EXPIRED') {
        // Try to refresh token and retry request
        try {
          const user = auth.currentUser;
          if (user) {
            const freshToken = await user.getIdToken(true); // Force refresh
            
            // Retry request with fresh token
            headers.set('Authorization', `Bearer ${freshToken}`);
            const retryResponse = await fetch(url, {
              ...options,
              headers,
            });
            
            return retryResponse;
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          // If refresh fails, sign out user
          await auth.signOut();
          window.location.href = '/login';
        }
      } else if (data.code === 'TOKEN_REVOKED' || data.code === 'INVALID_TOKEN') {
        // Token is invalid, sign out user
        await auth.signOut();
        window.location.href = '/login';
      }
    }

    return response;
  } catch (error) {
    console.error('Authenticated fetch error:', error);
    throw error;
  }
};

/**
 * Create fetch interceptor for RTK Query
 */
export const createAuthFetchInterceptor = () => {
  return async (url: string, options: RequestInit = {}) => {
    return authenticatedFetch(url, options);
  };
};

export default {
  getAuthToken,
  authenticatedFetch,
  createAuthFetchInterceptor,
};



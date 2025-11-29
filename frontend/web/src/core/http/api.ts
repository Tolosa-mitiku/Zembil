import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../constants';
import { auth } from '../firebase/config';

// Base query with auth token
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    try {
      const user = auth.currentUser;
      console.log('API - Current user:', user?.email);
      if (user) {
        const token = await user.getIdToken();
        console.log('API - Token obtained:', token ? 'Yes' : 'No');
        headers.set('Authorization', `Bearer ${token}`);
      } else {
        console.log('API - No user logged in');
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    console.log('API - Base URL:', API_BASE_URL);
    return headers;
  },
});

// Base API configuration
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'SellerDashboard',
    'SellerProducts',
    'SellerOrders',
    'SellerAnalytics',
    'SellerFinance',
    'SellerProfile',
    'Promotions',
    'AdminDashboard',
    'AdminUsers',
    'AdminSellers',
    'AdminProducts',
    'AdminOrders',
    'AdminCategories',
    'AdminBanners',
    'AdminAnalytics',
    'Reviews',
    'SellerReviews',
  ],
  endpoints: () => ({}),
});


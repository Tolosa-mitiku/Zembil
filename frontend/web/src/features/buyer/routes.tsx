/**
 * Buyer Routes Configuration
 * All routes for the buyer-facing web application
 */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import BuyerLayout from './layout/components/BuyerLayout';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./home/pages/index'));
const ShopPage = lazy(() => import('./products/pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('./products/pages/ProductDetailPage'));
const CartPage = lazy(() => import('./cart/pages/CartPage'));
const CheckoutPage = lazy(() => import('./checkout/pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./checkout/pages/OrderSuccessPage'));
const OrdersPage = lazy(() => import('./orders/pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./orders/pages/OrderDetailPage'));
const ProfilePage = lazy(() => import('./profile/pages/ProfilePage'));
const EditProfilePage = lazy(() => import('./profile/pages/EditProfilePage'));
const AddressesPage = lazy(() => import('./profile/pages/AddressesPage'));
const SettingsPage = lazy(() => import('./profile/pages/SettingsPage'));
const WishlistPage = lazy(() => import('./wishlist/pages/WishlistPage'));

export const buyerRoutes: RouteObject = {
  path: '/',
  element: <BuyerLayout />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: 'shop',
      element: <ShopPage />,
    },
    {
      path: 'product/:id',
      element: <ProductDetailPage />,
    },
    {
      path: 'cart',
      element: <CartPage />,
    },
    {
      path: 'checkout',
      element: <CheckoutPage />,
    },
    {
      path: 'checkout/success',
      element: <OrderSuccessPage />,
    },
    {
      path: 'orders',
      element: <OrdersPage />,
    },
    {
      path: 'orders/:id',
      element: <OrderDetailPage />,
    },
    {
      path: 'profile',
      element: <ProfilePage />,
    },
    {
      path: 'profile/edit',
      element: <EditProfilePage />,
    },
    {
      path: 'profile/addresses',
      element: <AddressesPage />,
    },
    {
      path: 'profile/settings',
      element: <SettingsPage />,
    },
    {
      path: 'wishlist',
      element: <WishlistPage />,
    },
  ],
};


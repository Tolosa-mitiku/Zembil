import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { initializeAuth } from './features/auth/store/authSlice';
import AuthLayout from './shared/layouts/AuthLayout';
import DashboardLayout from './shared/layouts/DashboardLayout';
import ProtectedRoute from './shared/components/ProtectedRoute';
import SignUpPage from './features/auth/pages/SignUpPage';
import SellerDashboard from './features/seller/dashboard/pages/DashboardPage';
import SellerProducts from './features/seller/products/pages/ProductsPage';
import ProductViewPage from './features/seller/products/pages/ProductViewPage';
import ProductEditPage from './features/seller/products/pages/ProductEditPage';
import SellerOrders from './features/seller/orders/pages/OrdersPage';
import OrderDetailPage from './features/seller/orders/pages/OrderDetailPage';
import SellerAnalytics from './features/seller/analytics/pages/AnalyticsPage';
import SellerFinance from './features/seller/finance/pages/EarningsPage';
import SellerProfile from './features/seller/profile/pages/ProfilePage';
import SellerCategories from './features/seller/categories/pages/CategoriesPage';
import SellerPromotions from './features/seller/promotions/pages/PromotionsPage';
import SellerCustomers from './features/seller/customers/pages/CustomersPage';
import SellerMessages from './features/seller/messages/pages/MessagesPage';
import SellerReturns from './features/seller/returns/pages/ReturnsPage';
import SellerCalendar from './features/seller/calendar/pages/CalendarPage';
import SellerReviews from './features/seller/reviews/pages/ReviewsPage';
import SellerSupport from './features/seller/support/pages/SupportPage';
import SellerSettings from './features/seller/settings/pages/SettingsPage';
import ProductReviewsPage from './features/reviews/pages/ProductReviewsPage';
import AdminDashboard from './features/admin/dashboard/pages/DashboardPage';
import AdminUsers from './features/admin/users/pages/UsersPage';
import CustomerManagementPage from './features/admin/users/pages/CustomerManagementPage';
import AdminSellers from './features/admin/sellers/pages/SellersPage';
import AdminProducts from './features/admin/products/pages/ProductsPage';
import AdminOrders from './features/admin/orders/pages/OrdersPage';
import AdminCategories from './features/admin/categories/pages/CategoriesPage';
import AdminBanners from './features/admin/banners/pages/BannersPage';
import AdminAnalytics from './features/admin/analytics/pages/AnalyticsPage';
import AdminProfile from './features/admin/profile/pages/ProfilePage';
import AdminSupport from './features/admin/support/pages/SupportPage';
import AdminSettings from './features/admin/settings/pages/SettingsPage';
import LoadingScreen from './shared/components/LoadingScreen';

// Buyer Routes - Lazy loaded
import BuyerLayout from './features/buyer/layout/components/BuyerLayout';
const BuyerHomePage = lazy(() => import('./features/buyer/home/pages/HomePage'));
const BuyerSearchPage = lazy(() => import('./features/buyer/search/pages/SearchPage'));
const BuyerShopPage = lazy(() => import('./features/buyer/products/pages/ProductListPage'));
const BuyerProductDetailPage = lazy(() => import('./features/buyer/products/pages/ProductDetailPage'));
const BuyerCartPage = lazy(() => import('./features/buyer/cart/pages/CartPage'));
const BuyerCheckoutPage = lazy(() => import('./features/buyer/checkout/pages/CheckoutPage'));
const BuyerOrderSuccessPage = lazy(() => import('./features/buyer/checkout/pages/OrderSuccessPage'));
const BuyerOrdersPage = lazy(() => import('./features/buyer/orders/pages/OrdersPage'));
const BuyerOrderDetailPage = lazy(() => import('./features/buyer/orders/pages/OrderDetailPage'));
const BuyerProfilePage = lazy(() => import('./features/buyer/profile/pages/ProfilePage'));
const BuyerEditProfilePage = lazy(() => import('./features/buyer/profile/pages/EditProfilePage'));
const BuyerAddressesPage = lazy(() => import('./features/buyer/profile/pages/AddressesPage'));
const BuyerSettingsPage = lazy(() => import('./features/buyer/profile/pages/SettingsPage'));
const BuyerWishlistPage = lazy(() => import('./features/buyer/wishlist/pages/WishlistPage'));
const BuyerMessagesPage = lazy(() => import('./features/buyer/messages/pages/MessagesPage'));
const BuyerNotificationsPage = lazy(() => import('./features/buyer/profile/pages/NotificationsPage'));
const BuyerSecurityPage = lazy(() => import('./features/buyer/profile/pages/SecurityPage'));
const BuyerAppearancePage = lazy(() => import('./features/buyer/profile/pages/AppearancePage'));
const BuyerLanguagePage = lazy(() => import('./features/buyer/profile/pages/LanguagePage'));

function App() {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth())
      .catch((error) => {
        console.error('❌ Auth initialization failed:', error);
      });
  }, [dispatch]);

  // Wait for Firebase auth to fully initialize before rendering routes
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<Navigate to="/signup" replace state={{ tab: 'signin' }} />} />

      {/* Buyer Routes - PUBLIC (No authentication required for browsing) */}
      <Route element={<BuyerLayout />}>
        <Route 
          index 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerHomePage />
            </Suspense>
          } 
        />
        <Route 
          path="search" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerSearchPage />
            </Suspense>
          } 
        />
        <Route 
          path="shop" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerShopPage />
            </Suspense>
          } 
        />
        <Route 
          path="product/:id" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerProductDetailPage />
            </Suspense>
          } 
        />
        <Route 
          path="cart" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerCartPage />
            </Suspense>
          } 
        />
        <Route 
          path="checkout" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerCheckoutPage />
            </Suspense>
          } 
        />
        <Route 
          path="checkout/success" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerOrderSuccessPage />
            </Suspense>
          } 
        />
        <Route 
          path="orders" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerOrdersPage />
            </Suspense>
          } 
        />
        <Route 
          path="orders/:id" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerOrderDetailPage />
            </Suspense>
          } 
        />
        <Route 
          path="profile" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerProfilePage />
            </Suspense>
          } 
        />
        <Route 
          path="profile/edit" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerEditProfilePage />
            </Suspense>
          } 
        />
        <Route 
          path="profile/addresses" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerAddressesPage />
            </Suspense>
          } 
        />
        <Route 
          path="profile/settings" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerSettingsPage />
            </Suspense>
          } 
        />
        <Route 
          path="wishlist" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerWishlistPage />
            </Suspense>
          } 
        />
        <Route 
          path="messages" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerMessagesPage />
            </Suspense>
          } 
        />
        <Route 
          path="profile/notifications" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerNotificationsPage />
            </Suspense>
          } 
        />
        <Route 
          path="profile/security" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerSecurityPage />
            </Suspense>
          } 
        />
        <Route 
          path="profile/appearance" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerAppearancePage />
            </Suspense>
          } 
        />
        <Route 
          path="profile/language" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BuyerLanguagePage />
            </Suspense>
          } 
        />
      </Route>

      {/* Seller Routes */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <DashboardLayout role="seller" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/seller/dashboard" replace />} />
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="products/:id" element={<ProductViewPage />} />
        <Route path="products/:id/edit" element={<ProductEditPage />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="categories" element={<SellerCategories />} />
        <Route path="finance" element={<SellerFinance />} />
        <Route path="promotions" element={<SellerPromotions />} />
        <Route path="customers" element={<SellerCustomers />} />
        <Route path="messages" element={<SellerMessages />} />
        <Route path="returns" element={<SellerReturns />} />
        <Route path="calendar" element={<SellerCalendar />} />
        <Route path="reviews" element={<SellerReviews />} />
        <Route path="support" element={<SellerSupport />} />
        <Route path="analytics" element={<SellerAnalytics />} />
        <Route path="settings" element={<SellerSettings />} />
        <Route path="profile" element={<SellerProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout role="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="customers" element={<CustomerManagementPage />} />
        <Route path="sellers" element={<AdminSellers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="messages" element={<AdminDashboard />} />
        <Route path="reviews" element={<AdminDashboard />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Public Routes */}
      <Route path="/products/:productId/reviews" element={<ProductReviewsPage />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;


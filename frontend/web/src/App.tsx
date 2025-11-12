import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { initializeAuth } from './features/auth/store/authSlice';
import AuthLayout from './shared/layouts/AuthLayout';
import DashboardLayout from './shared/layouts/DashboardLayout';
import ProtectedRoute from './shared/components/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
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
import LoadingScreen from './shared/components/LoadingScreen';

function App() {
  const dispatch = useAppDispatch();
  const { isInitialized, user } = useAppSelector((state) => state.auth);

  console.log('=== App Component ===');
  console.log('isInitialized:', isInitialized);
  console.log('user:', user);

  useEffect(() => {
    console.log('Initializing auth...');
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!isInitialized) {
    console.log('Showing loading screen...');
    return <LoadingScreen />;
  }

  console.log('App initialized, rendering routes...');

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
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
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Public Routes */}
      <Route path="/products/:productId/reviews" element={<ProductReviewsPage />} />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to={user.role === 'admin' ? '/admin/dashboard' : '/seller/dashboard'}
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;


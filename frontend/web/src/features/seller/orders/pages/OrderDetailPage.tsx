import { useParams, useNavigate } from 'react-router-dom';
import { useGetSellerOrderByIdQuery } from '../api/ordersApi';
import OrderDetailHeader from '../components/OrderDetailHeader';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import OrderProductsList from '../components/OrderProductsList';
import TrackingSection from '../components/TrackingSection';
import PaymentDetailsSection from '../components/PaymentDetailsSection';
import OrderActivityLog from '../components/OrderActivityLog';
import OrderNotesSection from '../components/OrderNotesSection';
import OrderSummaryCard from '../components/OrderSummaryCard';
import CustomerInfoCard from '../components/CustomerInfoCard';
import QuickActionsCard from '../components/QuickActionsCard';
import OrderDetailSkeleton from '../components/OrderDetailSkeleton';
import { motion } from 'framer-motion';
import '../styles/order-detail.css';

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useGetSellerOrderByIdQuery(id || '');

  // Loading skeleton
  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-grey-50 to-grey-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-grey-900 mb-2">Order Not Found</h2>
          <p className="text-grey-600 mb-6">
            The order you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => navigate('/seller/orders')}
            className="px-6 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold-dark transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] via-grey-50 to-grey-100">
      {/* Sticky Header */}
      <OrderDetailHeader order={order} onBack={() => navigate('/seller/orders')} />

      {/* Main Content - Two Column Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content (65%) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Order Status Timeline - Featured */}
            <OrderStatusTimeline order={order} />

            {/* Products Ordered */}
            <OrderProductsList order={order} />

            {/* Tracking & Delivery */}
            {order.trackingNumber && (
              <TrackingSection order={order} />
            )}

            {/* Payment Details */}
            <PaymentDetailsSection order={order} />

            {/* Order History & Activity Log */}
            <OrderActivityLog order={order} />

            {/* Notes & Communication */}
            <OrderNotesSection order={order} />
          </motion.div>

          {/* Right Sidebar - Sticky Cards (35%) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="sticky top-24 space-y-6">
              {/* Order Summary */}
              <OrderSummaryCard order={order} />

              {/* Customer Information */}
              <CustomerInfoCard order={order} />

              {/* Quick Actions */}
              <QuickActionsCard order={order} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;


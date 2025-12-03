import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowRightIcon,
  MapPinIcon,
  CalendarIcon,
  CreditCardIcon,
  TagIcon,
  ChevronRightIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { useGetUserOrdersQuery, Order as ApiOrder } from '../api/ordersApi';
import OrdersSkeleton from '../components/OrdersSkeleton';

interface UIOrder {
  id: string;
  orderNumber: string;
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    seller: string;
  }[];
  status: string; // Flexible to accept any status from API
  totalAmount: number;
  createdAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  shippingAddress: string;
}

// Transform backend order to UI order format
const transformOrder = (order: ApiOrder): UIOrder => {
  return {
    id: order._id,
    orderNumber: order.orderNumber || 'N/A',
    items: order.items?.map(item => ({
      id: item._id,
      name: item.productId?.title || 'Unknown Product',
      image: item.productId?.images?.find(img => img.isMain)?.url || 
             item.productId?.images?.[0]?.url || 
             'https://via.placeholder.com/200',
      price: item.price ?? 0,
      quantity: item.quantity ?? 1,
      seller: item.sellerId?.businessName || 'Unknown Seller',
    })) || [],
    status: order.tracking?.status || 'pending',
    totalAmount: order.total ?? 0,
    createdAt: new Date(order.createdAt || Date.now()),
    estimatedDelivery: order.tracking?.estimatedDelivery ? new Date(order.tracking.estimatedDelivery) : undefined,
    trackingNumber: order.tracking?.trackingNumber,
    shippingAddress: order.shippingAddress 
      ? `${order.shippingAddress.addressLine1 || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.postalCode || ''}`.trim()
      : 'Address not available',
  };
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof ClockIcon; gradient: string }> = {
  pending: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300', 
    icon: ClockIcon,
    gradient: 'from-yellow-500 to-amber-600'
  },
  confirmed: { 
    label: 'Confirmed', 
    color: 'bg-blue-100 text-blue-700 border-blue-300', 
    icon: CheckCircleSolid,
    gradient: 'from-blue-500 to-cyan-600'
  },
  processing: { 
    label: 'Processing', 
    color: 'bg-purple-100 text-purple-700 border-purple-300', 
    icon: CubeIcon,
    gradient: 'from-purple-500 to-pink-600'
  },
  shipped: { 
    label: 'Shipped', 
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300', 
    icon: TruckIcon,
    gradient: 'from-indigo-500 to-purple-600'
  },
  'in-transit': { 
    label: 'In Transit', 
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300', 
    icon: TruckIcon,
    gradient: 'from-cyan-500 to-blue-600'
  },
  delivered: { 
    label: 'Delivered', 
    color: 'bg-green-100 text-green-700 border-green-300', 
    icon: CheckCircleIcon,
    gradient: 'from-green-500 to-emerald-600'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-700 border-red-300', 
    icon: XCircleIcon,
    gradient: 'from-red-500 to-rose-600'
  },
  refunded: { 
    label: 'Refunded', 
    color: 'bg-orange-100 text-orange-700 border-orange-300', 
    icon: ArrowPathIcon,
    gradient: 'from-orange-500 to-amber-600'
  },
};

// Default config for unknown statuses
const DEFAULT_STATUS_CONFIG = {
  label: 'Unknown',
  color: 'bg-gray-100 text-gray-700 border-gray-300',
  icon: ClockIcon,
  gradient: 'from-gray-500 to-slate-600'
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Fetch orders from the backend
  const { data, isLoading, isError, error, refetch, isFetching } = useGetUserOrdersQuery({
    page,
    limit: 50, // Fetch more to have enough for filtering
  });

  // Transform backend orders to UI format
  const allOrders = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(transformOrder);
  }, [data]);

  // Filter orders based on tab and search
  const activeOrders = useMemo(() => 
    allOrders.filter(order => 
      !['delivered', 'cancelled'].includes(order.status) &&
      (order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
       order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())))
    ),
    [allOrders, searchQuery]
  );

  const completedOrders = useMemo(() => 
    allOrders.filter(order => 
      ['delivered', 'cancelled', 'refunded'].includes(order.status) &&
      (order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
       order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())))
    ),
    [allOrders, searchQuery]
  );

  const displayOrders = selectedTab === 'active' ? activeOrders : completedOrders;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <ShoppingBagIcon className="w-6 h-6 text-white" />
            </div>
            My Orders
          </h1>

          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setSelectedTab('active')}
                className={clsx(
                  'px-5 py-2 rounded-lg text-sm font-bold transition-all relative',
                  selectedTab === 'active'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                )}
                disabled={isLoading}
              >
                Active
                {!isLoading && activeOrders.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-bold">
                    {activeOrders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setSelectedTab('completed')}
                className={clsx(
                  'px-5 py-2 rounded-lg text-sm font-bold transition-all',
                  selectedTab === 'completed'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                )}
                disabled={isLoading}
              >
                Completed
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-sm bg-white"
                disabled={isLoading}
              />
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && <OrdersSkeleton />}

        {/* Error State */}
        {isError && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Orders</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {(error as any)?.data?.message || 'Something went wrong while fetching your orders. Please try again.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-gold text-white rounded-xl font-bold hover:bg-gold-dark transition-all shadow-lg flex items-center gap-2 mx-auto"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty or Filtered Orders */}
        {!isLoading && !isError && displayOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBagIcon className="w-16 h-16 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Try a different search term' : `No ${selectedTab} orders yet`}
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gold text-white rounded-xl font-bold hover:bg-gold-dark transition-all shadow-lg"
            >
              Start Shopping
            </button>
          </motion.div>
        )}

        {/* Orders List */}
        {!isLoading && !isError && displayOrders.length > 0 && (
          <div className="space-y-6">
            {isFetching && !isLoading && (
              <div className="flex items-center justify-center py-4">
                <ArrowPathIcon className="w-5 h-5 text-gray-400 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Refreshing...</span>
              </div>
            )}
            <AnimatePresence mode="popLayout">
              {displayOrders.map((order, index) => {
                const statusConfig = STATUS_CONFIG[order.status] || DEFAULT_STATUS_CONFIG;
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer group"
                  >
                    {/* Gradient Top Bar */}
                    <div className={`h-2 bg-gradient-to-r ${statusConfig.gradient}`} />

                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${statusConfig.gradient} shadow-lg`}>
                            <StatusIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-500 uppercase tracking-wider">
                              {order.orderNumber}
                            </p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <CalendarIcon className="w-3 h-3" />
                              {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-1.5 rounded-full border-2 font-bold text-sm ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                          <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-6">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 truncate">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} • ${item.price.toFixed(2)} each
                              </p>
                              <p className="text-xs text-gray-400">by {item.seller}</p>
                            </div>
                            <p className="font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-gray-100">
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          {order.trackingNumber && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                              <TruckIcon className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-700">Track: {order.trackingNumber}</span>
                            </div>
                          )}
                          {order.estimatedDelivery && order.status !== 'delivered' && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
                              <ClockIcon className="w-4 h-4 text-purple-600" />
                              <span className="font-medium text-purple-700">
                                Est. {new Date(order.estimatedDelivery).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                          <p className="text-2xl font-extrabold text-gray-900">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

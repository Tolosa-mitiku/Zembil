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
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

interface Order {
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
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  shippingAddress: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    items: [
      {
        id: 'i1',
        name: 'Premium Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
        price: 299.99,
        quantity: 1,
        seller: 'AudioTech Store',
      },
    ],
    status: 'shipped',
    totalAmount: 299.99,
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    estimatedDelivery: new Date(Date.now() + 86400000), // Tomorrow
    trackingNumber: 'TRK1234567890',
    shippingAddress: '123 Main St, New York, NY 10001',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    items: [
      {
        id: 'i2',
        name: 'Handcrafted Leather Bag',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200',
        price: 189.00,
        quantity: 2,
        seller: 'Fashion Hub',
      },
    ],
    status: 'delivered',
    totalAmount: 378.00,
    createdAt: new Date(Date.now() - 604800000), // 1 week ago
    shippingAddress: '123 Main St, New York, NY 10001',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    items: [
      {
        id: 'i3',
        name: 'Smart Watch Pro',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
        price: 349.99,
        quantity: 1,
        seller: 'TechMart',
      },
      {
        id: 'i4',
        name: 'Wireless Earbuds',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200',
        price: 149.99,
        quantity: 1,
        seller: 'AudioTech Store',
      },
    ],
    status: 'processing',
    totalAmount: 499.98,
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    estimatedDelivery: new Date(Date.now() + 259200000), // 3 days
    shippingAddress: '123 Main St, New York, NY 10001',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    items: [
      {
        id: 'i5',
        name: 'Desk Lamp',
        image: 'https://images.unsplash.com/photo-1507473888900-52e1adad5452?w=200',
        price: 79.99,
        quantity: 1,
        seller: 'Home Decor Plus',
      },
    ],
    status: 'cancelled',
    totalAmount: 79.99,
    createdAt: new Date(Date.now() - 1209600000), // 2 weeks ago
    shippingAddress: '123 Main St, New York, NY 10001',
  },
];

const STATUS_CONFIG = {
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
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const activeOrders = useMemo(() => 
    MOCK_ORDERS.filter(order => 
      !['delivered', 'cancelled'].includes(order.status) &&
      (order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
       order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())))
    ),
    [searchQuery]
  );

  const completedOrders = useMemo(() => 
    MOCK_ORDERS.filter(order => 
      ['delivered', 'cancelled'].includes(order.status) &&
      (order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
       order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())))
    ),
    [searchQuery]
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
              >
                Active
                {activeOrders.length > 0 && (
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
              />
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {displayOrders.length === 0 ? (
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
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {displayOrders.map((order, index) => {
                const statusConfig = STATUS_CONFIG[order.status];
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

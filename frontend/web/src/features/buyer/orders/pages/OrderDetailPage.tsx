import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MapPinIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhoneIcon,
  CalendarIcon,
  CubeIcon,
  StarIcon,
  PrinterIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

// Mock order data
const MOCK_ORDER = {
  id: '1',
  orderNumber: 'ORD-2024-001',
  status: 'shipped' as const,
  createdAt: new Date(Date.now() - 172800000), // 2 days ago
  estimatedDelivery: new Date(Date.now() + 86400000), // Tomorrow
  trackingNumber: 'TRK1234567890',
  items: [
    {
      id: 'i1',
      productId: '1',
      name: 'Premium Wireless Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      price: 299.99,
      quantity: 1,
      seller: 'AudioTech Store',
      sellerAvatar: 'https://i.pravatar.cc/150?u=audiotech',
      rating: 4.9,
    },
  ],
  shippingAddress: {
    name: 'Alex Thompson',
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
    phone: '+1 (555) 123-4567',
  },
  payment: {
    method: 'Credit Card',
    last4: '4242',
    brand: 'Visa',
  },
  pricing: {
    subtotal: 299.99,
    shipping: 0,
    tax: 24.00,
    total: 323.99,
  },
  timeline: [
    { status: 'pending', label: 'Order Placed', date: new Date(Date.now() - 172800000), completed: true },
    { status: 'confirmed', label: 'Order Confirmed', date: new Date(Date.now() - 172000000), completed: true },
    { status: 'processing', label: 'Processing', date: new Date(Date.now() - 100000000), completed: true },
    { status: 'shipped', label: 'Shipped', date: new Date(Date.now() - 86400000), completed: true },
    { status: 'delivered', label: 'Delivered', date: null, completed: false },
  ],
};

const STATUS_GRADIENT = {
  pending: 'from-yellow-500 to-amber-600',
  confirmed: 'from-blue-500 to-cyan-600',
  processing: 'from-purple-500 to-pink-600',
  shipped: 'from-indigo-500 to-purple-600',
  delivered: 'from-green-500 to-emerald-600',
  cancelled: 'from-red-500 to-rose-600',
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const order = MOCK_ORDER;
  const currentStatusIndex = order.timeline.findIndex(t => !t.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/orders')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1>
                <p className="text-xs text-gray-500">
                  Placed {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Print Order">
                <PrinterIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 overflow-hidden relative"
            >
              {/* Gradient Background */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${STATUS_GRADIENT[order.status]}`} />

              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${STATUS_GRADIENT[order.status]} shadow-lg`}>
                  <TruckIcon className="w-5 h-5 text-white" />
                </div>
                Order Tracking
              </h2>

              {/* Timeline */}
              <div className="relative">
                {order.timeline.map((step, index) => {
                  const isCompleted = step.completed;
                  const isCurrent = index === currentStatusIndex;
                  const isPast = index < currentStatusIndex;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative flex gap-6 pb-8 last:pb-0"
                    >
                      {/* Timeline Line */}
                      {index < order.timeline.length - 1 && (
                        <div className="absolute left-6 top-14 w-0.5 h-full -translate-x-1/2">
                          <div className={clsx(
                            'h-full w-full transition-all duration-1000',
                            isCompleted ? 'bg-gradient-to-b from-green-500 to-green-400' : 'bg-gray-200'
                          )} />
                        </div>
                      )}

                      {/* Status Icon */}
                      <div className="relative z-10">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                          className={clsx(
                            'w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all',
                            isCompleted
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600 ring-4 ring-green-100'
                              : isCurrent
                              ? 'bg-gradient-to-br from-blue-500 to-purple-600 ring-4 ring-blue-100 animate-pulse'
                              : 'bg-gray-200'
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircleSolid className="w-6 h-6 text-white" />
                          ) : isCurrent ? (
                            <ClockIcon className="w-6 h-6 text-white animate-pulse" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-white" />
                          )}
                        </motion.div>
                      </div>

                      {/* Status Info */}
                      <div className="flex-1 pt-2">
                        <h3 className={clsx(
                          'font-bold text-sm mb-0.5',
                          isCompleted ? 'text-gray-900' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                        )}>
                          {step.label}
                        </h3>
                        {step.date && (
                          <p className="text-[10px] text-gray-500">
                            {new Date(step.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                        {isCurrent && !isCompleted && (
                          <p className="text-[10px] text-blue-600 font-medium mt-1 animate-pulse">
                            In progress...
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Tracking Number */}
              {order.trackingNumber && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Tracking Number</p>
                      <p className="font-mono font-bold text-sm text-gray-900">{order.trackingNumber}</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md">
                      Track Package
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
            >
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate(`/product/${item.productId}`)}
                    className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer border-2 border-transparent hover:border-gold group"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-gray-900 mb-1 group-hover:text-gold transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex items-center gap-1">
                          <img
                            src={item.sellerAvatar}
                            alt={item.seller}
                            className="w-4 h-4 rounded-full"
                          />
                          <span className="text-[10px] text-gray-600">{item.seller}</span>
                        </div>
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-3 h-3 text-amber-400 fill-current" />
                            <span className="text-[10px] font-semibold text-gray-600">{item.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="font-bold text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Contact Seller */}
              <div className="mt-6 pt-6 border-t-2 border-gray-100">
                <button
                  onClick={() => navigate('/messages', { 
                    state: {
                      sellerId: 'seller1',
                      sellerName: order.items[0].seller,
                      productName: order.items[0].name
                    }
                  })}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Contact Seller
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-br from-gold/10 via-white to-white border-b-2 border-gray-200">
                <h2 className="text-base font-extrabold text-gray-900">Order Summary</h2>
              </div>

              <div className="p-6 space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">${order.pricing.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">
                    {order.pricing.shipping === 0 ? 'FREE' : `$${order.pricing.shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">${order.pricing.tax.toFixed(2)}</span>
                </div>

                <div className="pt-2.5 border-t-2 border-gray-200">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-sm text-gray-900">Total</span>
                    <span className="text-xl font-extrabold text-gray-900">
                      ${order.pricing.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <CreditCardIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="font-semibold text-sm text-gray-900">
                      {order.payment.brand} •••• {order.payment.last4}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 shadow-xl border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPinIcon className="w-4 h-4 text-gold" />
                <h3 className="font-bold text-sm text-gray-900">Shipping Address</h3>
              </div>
              
              <div className="space-y-0.5 text-xs text-gray-700">
                <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="flex items-center gap-1.5 text-gray-500 pt-1.5 border-t border-gray-100 mt-1.5">
                  <PhoneIcon className="w-3 h-3" />
                  {order.shippingAddress.phone}
                </p>
              </div>
            </motion.div>

            {/* Estimated Delivery */}
            {order.estimatedDelivery && order.status !== 'delivered' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-5 shadow-xl text-white"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="w-5 h-5" />
                  <h3 className="font-bold text-sm">Estimated Delivery</h3>
                </div>
                <p className="text-2xl font-extrabold mb-1">
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-white/80">
                  {formatDistanceToNow(order.estimatedDelivery, { addSuffix: true })}
                </p>
              </motion.div>
            )}

            {/* Quick Actions */}
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl p-5 shadow-xl border border-gray-200"
              >
                <h3 className="font-bold text-sm text-gray-900 mb-3">Need Help?</h3>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 border-2 border-red-300 text-red-600 rounded-lg font-semibold text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-1.5">
                    <XCircleIcon className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                  <button className="flex-1 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5">
                    <ArrowPathIcon className="w-3.5 h-3.5" />
                    Return
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

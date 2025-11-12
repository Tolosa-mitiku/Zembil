import { Order } from '../api/ordersApi';
import { motion } from 'framer-motion';
import OrderStatusBadge from './OrderStatusBadge';
import {
  ShoppingBagIcon,
  ClockIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface OrderSummaryCardProps {
  order: Order;
}

const OrderSummaryCard = ({ order }: OrderSummaryCardProps) => {
  const getTimeSinceOrder = () => {
    const now = new Date();
    const orderDate = new Date(order.createdAt);
    const diffMs = now.getTime() - orderDate.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getDaysToDelivery = () => {
    if (!order.estimatedDelivery || order.status === 'delivered') return null;
    
    const now = new Date();
    const delivery = new Date(order.estimatedDelivery);
    const diffMs = delivery.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const getStatusProgress = () => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden"
    >
      {/* Header with gradient */}
      <div className="p-6 bg-gradient-to-br from-gold/10 via-amber-50 to-orange-50 border-b border-grey-200">
        <h3 className="text-lg font-bold text-grey-900 mb-4">Order Summary</h3>
        
        {/* Order Number */}
        <div className="mb-3">
          <div className="text-xs text-grey-600 mb-1">Order Number</div>
          <div className="text-2xl font-bold text-gold">{order.orderNumber}</div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mb-4">
          <OrderStatusBadge status={order.status} size="lg" />
        </div>

        {/* Progress Ring */}
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-grey-200"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - getStatusProgress() / 100)}`}
                className="text-gold transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">{Math.round(getStatusProgress())}%</div>
                <div className="text-xs text-grey-600">Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-6 space-y-4">
        {/* Total Amount */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div>
            <div className="text-xs text-grey-600 mb-1">Total Amount</div>
            <div className="text-2xl font-bold text-green-600">
              ${order.totalPrice.toFixed(2)}
            </div>
          </div>
          <ShoppingBagIcon className="w-8 h-8 text-green-600" />
        </div>

        {/* Items Count */}
        <div className="flex items-center justify-between p-4 bg-grey-50 rounded-xl border border-grey-200">
          <div>
            <div className="text-xs text-grey-600 mb-1">Items</div>
            <div className="text-xl font-bold text-grey-900">
              {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
            </div>
          </div>
          <div className="text-sm text-grey-600">
            {order.items.length} product{order.items.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Time Since Order */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div>
            <div className="text-xs text-grey-600 mb-1">Time Since Order</div>
            <div className="text-lg font-semibold text-blue-600">{getTimeSinceOrder()}</div>
          </div>
          <ClockIcon className="w-6 h-6 text-blue-600" />
        </div>

        {/* Days to Delivery */}
        {getDaysToDelivery() && (
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div>
              <div className="text-xs text-grey-600 mb-1">Days to Delivery</div>
              <div className="text-lg font-semibold text-orange-600">{getDaysToDelivery()}</div>
            </div>
            <TruckIcon className="w-6 h-6 text-orange-600" />
          </div>
        )}

        {/* Created Date */}
        <div className="pt-4 border-t border-grey-200 text-center">
          <div className="text-xs text-grey-500">
            Created on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummaryCard;


import { Order } from '../api/ordersApi';
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  MapPinIcon,
  HomeIcon,
  XCircleIcon,
  CreditCardIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface OrderStatusTimelineProps {
  order: Order;
}

interface TimelineStep {
  key: string;
  label: string;
  icon: any;
  completed: boolean;
  current: boolean;
  timestamp?: string;
}

const OrderStatusTimeline = ({ order }: OrderStatusTimelineProps) => {
  // Define all possible steps
  const allSteps: TimelineStep[] = [
    {
      key: 'pending',
      label: 'Order Placed',
      icon: ClockIcon,
      completed: true,
      current: order.status === 'pending',
      timestamp: order.createdAt,
    },
    {
      key: 'confirmed',
      label: 'Payment Confirmed',
      icon: CreditCardIcon,
      completed: ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].includes(order.status),
      current: order.status === 'confirmed',
      timestamp: order.updatedAt,
    },
    {
      key: 'processing',
      label: 'Processing Started',
      icon: CogIcon,
      completed: ['processing', 'shipped', 'out_for_delivery', 'delivered'].includes(order.status),
      current: order.status === 'processing',
      timestamp: order.updatedAt,
    },
    {
      key: 'shipped',
      label: 'Shipped',
      icon: TruckIcon,
      completed: ['shipped', 'out_for_delivery', 'delivered'].includes(order.status),
      current: order.status === 'shipped',
      timestamp: order.trackingNumber ? order.updatedAt : undefined,
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      icon: MapPinIcon,
      completed: ['out_for_delivery', 'delivered'].includes(order.status),
      current: order.status === 'out_for_delivery',
      timestamp: order.updatedAt,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: HomeIcon,
      completed: order.status === 'delivered',
      current: order.status === 'delivered',
      timestamp: order.status === 'delivered' ? order.updatedAt : undefined,
    },
  ];

  // Handle canceled status
  if (order.status === 'canceled') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl border-2 border-red-200 shadow-lg overflow-hidden"
      >
        <div className="p-8 text-center bg-gradient-to-br from-red-50 to-red-100">
          <XCircleIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-900 mb-2">Order Canceled</h2>
          <p className="text-red-700">This order has been canceled and will not be fulfilled.</p>
        </div>
      </motion.div>
    );
  }

  // Calculate estimated delivery countdown
  const getDeliveryCountdown = () => {
    if (!order.estimatedDelivery || order.status === 'delivered') return null;
    
    const now = new Date();
    const delivery = new Date(order.estimatedDelivery);
    const diffMs = delivery.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Delivery overdue';
    if (diffDays === 0) return 'Arriving today';
    if (diffDays === 1) return 'Arriving tomorrow';
    return `${diffDays} days until delivery`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-transparent px-8 py-6 border-b border-grey-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-grey-900 mb-1">Order Status</h2>
            <p className="text-sm text-grey-600">Track your order's journey</p>
          </div>
          {order.estimatedDelivery && order.status !== 'delivered' && (
            <div className="text-right">
              <div className="text-sm text-grey-600 mb-1">Estimated Delivery</div>
              <div className="text-lg font-bold text-gold">{getDeliveryCountdown()}</div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline - Horizontal on Desktop */}
      <div className="p-8">
        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-10 left-0 right-0 h-1 bg-grey-200 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full transition-all duration-1000"
                style={{
                  width: `${(allSteps.filter(s => s.completed).length / allSteps.length) * 100}%`,
                }}
              />
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-6 gap-4">
              {allSteps.map((step, index) => (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  {/* Icon Circle */}
                  <div
                    className={clsx(
                      'relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 mb-4',
                      step.completed
                        ? 'bg-gradient-to-br from-gold to-gold-dark shadow-lg shadow-gold/30'
                        : step.current
                        ? 'bg-white border-4 border-gold shadow-lg animate-pulse-slow'
                        : 'bg-grey-100 border-2 border-grey-300'
                    )}
                  >
                    {step.completed ? (
                      <CheckCircleSolidIcon className="w-10 h-10 text-white" />
                    ) : (
                      <step.icon
                        className={clsx(
                          'w-8 h-8',
                          step.current ? 'text-gold' : 'text-grey-400'
                        )}
                      />
                    )}

                    {/* Pulsing Ring for Current Step */}
                    {step.current && !step.completed && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border-4 border-gold"
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <div
                      className={clsx(
                        'text-sm font-semibold mb-1',
                        step.completed || step.current ? 'text-grey-900' : 'text-grey-500'
                      )}
                    >
                      {step.label}
                    </div>
                    {step.timestamp && (
                      <div className="text-xs text-grey-500">
                        {formatDate(step.timestamp)}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden space-y-4">
          {allSteps.map((step, index) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start gap-4"
            >
              {/* Icon & Line */}
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    'relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
                    step.completed
                      ? 'bg-gradient-to-br from-gold to-gold-dark shadow-md'
                      : step.current
                      ? 'bg-white border-4 border-gold shadow-md animate-pulse-slow'
                      : 'bg-grey-100 border-2 border-grey-300'
                  )}
                >
                  {step.completed ? (
                    <CheckCircleSolidIcon className="w-6 h-6 text-white" />
                  ) : (
                    <step.icon
                      className={clsx(
                        'w-5 h-5',
                        step.current ? 'text-gold' : 'text-grey-400'
                      )}
                    />
                  )}

                  {step.current && !step.completed && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-4 border-gold"
                    />
                  )}
                </div>

                {/* Connecting Line */}
                {index < allSteps.length - 1 && (
                  <div
                    className={clsx(
                      'w-1 h-12 transition-colors duration-300',
                      step.completed ? 'bg-gold' : 'bg-grey-200'
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <div
                  className={clsx(
                    'font-semibold mb-1',
                    step.completed || step.current ? 'text-grey-900' : 'text-grey-500'
                  )}
                >
                  {step.label}
                </div>
                {step.timestamp && (
                  <div className="text-sm text-grey-500">
                    {formatDate(step.timestamp)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tracking Info Footer */}
      {order.trackingNumber && (
        <div className="px-8 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-t border-grey-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-grey-600 mb-1">Tracking Number</div>
              <div className="font-mono text-lg font-bold text-grey-900">
                {order.trackingNumber}
              </div>
            </div>
            {order.carrier && (
              <div className="text-right">
                <div className="text-sm text-grey-600 mb-1">Carrier</div>
                <div className="text-lg font-semibold text-grey-900">{order.carrier}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OrderStatusTimeline;


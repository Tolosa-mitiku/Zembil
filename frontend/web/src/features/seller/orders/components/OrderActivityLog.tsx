import { Order } from '../api/ordersApi';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface OrderActivityLogProps {
  order: Order;
}

interface ActivityItem {
  type: 'status' | 'payment' | 'notification' | 'note';
  title: string;
  description: string;
  timestamp: string;
  icon: any;
  color: string;
}

const OrderActivityLog = ({ order }: OrderActivityLogProps) => {
  // Generate activity items from order data
  const activities: ActivityItem[] = [
    {
      type: 'status',
      title: 'Order Created',
      description: `Order ${order.orderNumber} was placed by ${order.customer.name}`,
      timestamp: order.createdAt,
      icon: ClockIcon,
      color: 'blue',
    },
    {
      type: 'payment',
      title: 'Payment Received',
      description: `Payment of $${order.totalPrice.toFixed(2)} was processed successfully via Stripe`,
      timestamp: order.createdAt,
      icon: CreditCardIcon,
      color: 'green',
    },
  ];

  // Add shipping activity if shipped
  if (order.trackingNumber) {
    activities.push({
      type: 'status',
      title: 'Order Shipped',
      description: `Package shipped via ${order.carrier || 'carrier'}. Tracking: ${order.trackingNumber}`,
      timestamp: order.updatedAt,
      icon: TruckIcon,
      color: 'purple',
    });
  }

  // Add delivered activity if delivered
  if (order.status === 'delivered') {
    activities.push({
      type: 'status',
      title: 'Order Delivered',
      description: 'Package was successfully delivered to customer',
      timestamp: order.updatedAt,
      icon: CheckCircleIcon,
      color: 'green',
    });
  }

  // Add email notification activity
  activities.push({
    type: 'notification',
    title: 'Customer Notified',
    description: `Order confirmation email sent to ${order.customer.email}`,
    timestamp: order.createdAt,
    icon: EnvelopeIcon,
    color: 'cyan',
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-600',
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-600',
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-600',
      },
      cyan: {
        bg: 'bg-cyan-50',
        border: 'border-cyan-200',
        text: 'text-cyan-600',
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-600',
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-grey-200 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <ClockIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-grey-900">Order History & Activity</h2>
            <p className="text-sm text-grey-600">Complete timeline of order events</p>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="p-8">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const colorClasses = getColorClasses(activity.color);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex gap-4 group"
              >
                {/* Icon & Timeline */}
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110',
                      colorClasses.bg,
                      colorClasses.border
                    )}
                  >
                    <activity.icon className={clsx('w-6 h-6', colorClasses.text)} />
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-0.5 h-full min-h-[40px] bg-grey-200 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="bg-grey-50 rounded-xl p-4 border border-grey-200 group-hover:border-gold/50 group-hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-grey-900">{activity.title}</h4>
                      <span className="text-xs text-grey-500 whitespace-nowrap ml-4">
                        {formatDate(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-grey-600">{activity.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Export Button */}
        <div className="mt-6 pt-6 border-t border-grey-200 text-center">
          <button className="px-6 py-2 text-sm font-semibold text-gold hover:text-gold-dark transition-colors">
            Export Activity Log
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderActivityLog;


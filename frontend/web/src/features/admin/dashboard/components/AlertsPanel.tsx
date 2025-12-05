import { motion } from 'framer-motion';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import clsx from 'clsx';
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface Alert {
  id: string;
  type: 'return' | 'stock' | 'message' | 'review' | 'system';
  title: string;
  message: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
  link?: string;
}

interface AlertsPanelProps {
  alerts?: Alert[];
}

const AlertsPanel = ({ alerts = [] }: AlertsPanelProps) => {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'return':
        return ArrowPathIcon;
      case 'stock':
        return ExclamationTriangleIcon;
      case 'message':
        return ChatBubbleLeftRightIcon;
      case 'review':
        return StarIcon;
      case 'system':
        return BellAlertIcon;
      default:
        return BellAlertIcon;
    }
  };

  const getAlertColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          badge: 'bg-red-600',
        };
      case 'medium':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'text-orange-600',
          badge: 'bg-orange-600',
        };
      case 'low':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          badge: 'bg-blue-600',
        };
      default:
        return {
          bg: 'bg-grey-50',
          border: 'border-grey-200',
          icon: 'text-grey-600',
          badge: 'bg-grey-600',
        };
    }
  };

  // Sample alerts if none provided
  const defaultAlerts: Alert[] = [
    {
      id: '1',
      type: 'stock',
      title: 'Low Stock Alert',
      message: '5 products are running low on stock',
      count: 5,
      priority: 'high',
      link: '/admin/products',
    },
    {
      id: '2',
      type: 'return',
      title: 'Pending Returns',
      message: '3 return requests need your attention',
      count: 3,
      priority: 'high',
      link: '/admin/orders',
    },
    {
      id: '3',
      type: 'message',
      title: 'Unread Messages',
      message: '12 customer messages awaiting response',
      count: 12,
      priority: 'medium',
      link: '/admin/messages',
    },
    {
      id: '4',
      type: 'review',
      title: 'New Reviews',
      message: '8 reviews need your response',
      count: 8,
      priority: 'medium',
      link: '/admin/reviews',
    },
  ];

  const displayAlerts = alerts.length > 0 ? alerts : defaultAlerts;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="col-span-full"
    >
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-50 rounded-lg">
              <BellAlertIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-grey-900">Action Required</h3>
              <p className="text-sm text-grey-500">Items needing your attention</p>
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full"
          >
            {displayAlerts.reduce((sum, alert) => sum + alert.count, 0)}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayAlerts.map((alert, index) => {
            const Icon = getAlertIcon(alert.type);
            const colors = getAlertColor(alert.priority);

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
              >
                <Link to={alert.link || '#'} className="block">
                  <div
                    className={clsx(
                      'relative p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-lg',
                      colors.bg,
                      colors.border
                    )}
                  >
                    {/* Pulse animation for high priority */}
                    {alert.priority === 'high' && (
                      <motion.div
                        className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}

                    {/* Icon and Count */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={clsx('p-2 bg-white rounded-lg shadow-sm')}>
                        <Icon className={clsx('w-6 h-6', colors.icon)} />
                      </div>
                      <span
                        className={clsx(
                          'px-3 py-1 rounded-full text-white text-sm font-bold',
                          colors.badge
                        )}
                      >
                        {alert.count}
                      </span>
                    </div>

                    {/* Content */}
                    <h4 className="text-sm font-bold text-grey-900 mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-grey-600 line-clamp-2">
                      {alert.message}
                    </p>

                    {/* Action indicator */}
                    <div className="mt-3 pt-3 border-t border-grey-200/50">
                      <span className={clsx('text-xs font-semibold', colors.icon)}>
                        Click to view →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {displayAlerts.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-base font-semibold text-grey-900 mb-1">
              All caught up!
            </p>
            <p className="text-sm text-grey-500">
              No pending actions at the moment
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default AlertsPanel;


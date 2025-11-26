import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  ShoppingBagIcon,
  TruckIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  HeartIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'order' | 'shipping' | 'message' | 'promo' | 'wishlist';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon: React.ComponentType<any>;
  gradient: string;
  actionUrl?: string;
}

const RECENT_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'shipping',
    title: 'Your order has been shipped!',
    message: 'Order #ORD-2024-001 is on its way.',
    timestamp: new Date(Date.now() - 300000),
    read: false,
    icon: TruckIcon,
    gradient: 'from-blue-500 to-cyan-600',
    actionUrl: '/orders/1',
  },
  {
    id: '2',
    type: 'message',
    title: 'New message from seller',
    message: 'AudioTech Store sent you a message.',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    icon: ChatBubbleLeftIcon,
    gradient: 'from-purple-500 to-pink-600',
    actionUrl: '/messages',
  },
  {
    id: '3',
    type: 'promo',
    title: '🎉 Flash Sale!',
    message: '50% OFF on Electronics.',
    timestamp: new Date(Date.now() - 7200000),
    read: false,
    icon: TagIcon,
    gradient: 'from-orange-500 to-amber-600',
    actionUrl: '/shop',
  },
];

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
  const navigate = useNavigate();
  const unreadCount = RECENT_NOTIFICATIONS.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 z-40"
          />

          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {RECENT_NOTIFICATIONS.length === 0 ? (
                <div className="p-8 text-center">
                  <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No notifications</p>
                </div>
              ) : (
                <div className="p-2">
                  {RECENT_NOTIFICATIONS.slice(0, 5).map((notification, idx) => {
                    const NotifIcon = notification.icon;

                    return (
                      <motion.button
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleNotificationClick(notification)}
                        className="w-full p-3 rounded-xl hover:bg-gray-50 transition-all text-left border-b border-gray-100 last:border-b-0 group"
                      >
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${notification.gradient} shadow-md shrink-0`}>
                            <NotifIcon className="w-4 h-4 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-0.5">
                              <h4 className="font-semibold text-xs text-gray-900 line-clamp-1">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                              {notification.message}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate('/profile/notifications');
                  onClose();
                }}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold text-sm hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                View All Notifications
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;


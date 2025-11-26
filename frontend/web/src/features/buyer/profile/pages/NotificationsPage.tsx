import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  ShoppingBagIcon,
  TruckIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  HeartIcon,
  ClockIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
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

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'shipping',
    title: 'Your order has been shipped!',
    message: 'Order #ORD-2024-001 is on its way. Track your package.',
    timestamp: new Date(Date.now() - 300000),
    read: false,
    icon: TruckIcon,
    gradient: 'from-blue-500 to-cyan-600',
    actionUrl: '/orders/1',
  },
  {
    id: '2',
    type: 'message',
    title: 'New message from AudioTech Store',
    message: 'We have a special offer on your saved items!',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    icon: ChatBubbleLeftIcon,
    gradient: 'from-purple-500 to-pink-600',
    actionUrl: '/messages',
  },
  {
    id: '3',
    type: 'promo',
    title: '🎉 50% OFF Flash Sale!',
    message: 'Limited time offer on Electronics. Ends in 6 hours!',
    timestamp: new Date(Date.now() - 7200000),
    read: false,
    icon: TagIcon,
    gradient: 'from-orange-500 to-amber-600',
    actionUrl: '/shop?category=electronics',
  },
  {
    id: '4',
    type: 'wishlist',
    title: 'Price Drop Alert!',
    message: 'Item in your wishlist is now $50 cheaper.',
    timestamp: new Date(Date.now() - 86400000),
    read: true,
    icon: HeartIcon,
    gradient: 'from-red-500 to-pink-600',
    actionUrl: '/wishlist',
  },
  {
    id: '5',
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order #ORD-2024-002 has been delivered.',
    timestamp: new Date(Date.now() - 172800000),
    read: true,
    icon: CheckIcon,
    gradient: 'from-green-500 to-emerald-600',
    actionUrl: '/orders/2',
  },
];

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/profile/settings')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl relative">
                  <BellIconSolid className="w-7 h-7 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Notifications
                  </h1>
                  <p className="text-sm text-gray-600">{unreadCount} unread notifications</p>
                </div>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
              >
                Mark All Read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setFilter('all')}
              className={clsx(
                'flex-1 py-2 rounded-lg text-sm font-bold transition-all',
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600'
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={clsx(
                'flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2',
                filter === 'unread'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600'
              )}
            >
              Unread
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => {
            const NotifIcon = notification.icon;
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.actionUrl) navigate(notification.actionUrl);
                }}
                className={clsx(
                  'group relative bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-lg border transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] cursor-pointer',
                  notification.read ? 'border-gray-200' : 'border-blue-300 bg-blue-50/50'
                )}
              >
                <div className="flex gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${notification.gradient} shadow-lg shrink-0`}>
                    <NotifIcon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={clsx(
                        'font-bold text-sm',
                        notification.read ? 'text-gray-700' : 'text-gray-900'
                      )}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3">{notification.message}</p>

                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-all flex items-center gap-1"
                        >
                          <CheckIcon className="w-3 h-3" />
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-all flex items-center gap-1"
                      >
                        <TrashIcon className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <BellIcon className="w-16 h-16 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;


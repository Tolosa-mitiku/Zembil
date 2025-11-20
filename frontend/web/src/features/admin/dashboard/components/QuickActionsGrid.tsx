import { motion } from 'framer-motion';
import Card from '@/shared/components/Card';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  PlusIcon,
  UserGroupIcon,
  PencilSquareIcon,
  ArrowUpTrayIcon,
  ShoppingCartIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  MegaphoneIcon,
  EnvelopeIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  LifebuoyIcon,
} from '@heroicons/react/24/outline';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  link: string;
  color: string;
  bgColor: string;
  category: 'user' | 'order' | 'platform' | 'communication';
  badge?: number;
}

const QuickActionsGrid = () => {
  const actions: QuickAction[] = [
    // User Management
    {
      id: 'add-user',
      title: 'Add User',
      description: 'Create new user',
      icon: PlusIcon,
      link: '/admin/users/new',
      color: 'text-gold-600',
      bgColor: 'bg-gold-50',
      category: 'user',
    },
    {
      id: 'manage-users',
      title: 'Manage Users',
      description: 'View all users',
      icon: UserGroupIcon,
      link: '/admin/users',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      category: 'user',
    },
    {
      id: 'manage-sellers',
      title: 'Manage Sellers',
      description: 'Seller management',
      icon: UserGroupIcon,
      link: '/admin/sellers',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      category: 'user',
    },
    {
      id: 'bulk-operations',
      title: 'Bulk Operations',
      description: 'Batch updates',
      icon: PencilSquareIcon,
      link: '/admin/bulk',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      category: 'user',
    },

    // Order Management
    {
      id: 'process-orders',
      title: 'Process Orders',
      description: 'View all orders',
      icon: ShoppingCartIcon,
      link: '/admin/orders',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      category: 'order',
      badge: 5,
    },
    {
      id: 'print-reports',
      title: 'Print Reports',
      description: 'Generate reports',
      icon: PrinterIcon,
      link: '/admin/reports',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      category: 'order',
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download data',
      icon: DocumentArrowDownIcon,
      link: '/admin/export',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      category: 'order',
    },

    // Platform Management
    {
      id: 'manage-banners',
      title: 'Manage Banners',
      description: 'Platform banners',
      icon: MegaphoneIcon,
      link: '/admin/banners',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      category: 'platform',
    },
    {
      id: 'send-notifications',
      title: 'Notifications',
      description: 'Send to users',
      icon: EnvelopeIcon,
      link: '/admin/notifications',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      category: 'platform',
    },
    {
      id: 'view-analytics',
      title: 'Analytics',
      description: 'Platform insights',
      icon: ChartBarIcon,
      link: '/admin/analytics',
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      category: 'platform',
    },

    // Communication
    {
      id: 'messages',
      title: 'Messages',
      description: 'User messages',
      icon: ChatBubbleLeftRightIcon,
      link: '/admin/messages',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      category: 'communication',
      badge: 12,
    },
    {
      id: 'reviews',
      title: 'Reviews',
      description: 'Manage reviews',
      icon: StarIcon,
      link: '/admin/reviews',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      category: 'communication',
      badge: 8,
    },
    {
      id: 'support',
      title: 'Support',
      description: 'Help tickets',
      icon: LifebuoyIcon,
      link: '/admin/support',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      category: 'communication',
    },
  ];

  const categories = [
    { id: 'user', title: 'User Management', color: 'text-purple-600' },
    { id: 'order', title: 'Order Management', color: 'text-blue-600' },
    { id: 'platform', title: 'Platform Management', color: 'text-pink-600' },
    { id: 'communication', title: 'Communication', color: 'text-orange-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="col-span-full"
    >
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-grey-900">Quick Actions</h3>
          <p className="text-sm text-grey-500">Common tasks and shortcuts</p>
        </div>

        <div className="space-y-8">
          {categories.map((category, categoryIndex) => {
            const categoryActions = actions.filter((a) => a.category === category.id);

            return (
              <div key={category.id}>
                <h4
                  className={clsx(
                    'text-sm font-bold uppercase tracking-wide mb-4',
                    category.color
                  )}
                >
                  {category.title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categoryActions.map((action, actionIndex) => {
                    const Icon = action.icon;

                    return (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: categoryIndex * 0.1 + actionIndex * 0.05,
                        }}
                        whileHover={{ scale: 1.05, y: -4 }}
                      >
                        <Link to={action.link} className="block">
                          <div
                            className={clsx(
                              'relative p-4 rounded-xl border-2 border-grey-200 hover:border-current transition-all duration-200 hover:shadow-lg group',
                              action.color
                            )}
                          >
                            {/* Badge */}
                            {action.badge && (
                              <motion.div
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              >
                                {action.badge}
                              </motion.div>
                            )}

                            {/* Icon */}
                            <div
                              className={clsx(
                                'inline-flex p-3 rounded-xl mb-3 transition-all duration-200 group-hover:scale-110',
                                action.bgColor
                              )}
                            >
                              <Icon className="w-6 h-6" />
                            </div>

                            {/* Content */}
                            <h5 className="text-sm font-bold text-grey-900 mb-1">
                              {action.title}
                            </h5>
                            <p className="text-xs text-grey-600">
                              {action.description}
                            </p>

                            {/* Hover Arrow */}
                            <div className="mt-3 pt-3 border-t border-grey-200 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-xs font-semibold">
                                Go →
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

export default QuickActionsGrid;


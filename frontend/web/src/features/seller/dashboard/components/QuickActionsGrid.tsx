import { motion } from 'framer-motion';
import Card from '@/shared/components/Card';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  PlusIcon,
  CubeIcon,
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
  category: 'product' | 'order' | 'marketing' | 'communication';
  badge?: number;
}

const QuickActionsGrid = () => {
  const actions: QuickAction[] = [
    // Product Management
    {
      id: 'add-product',
      title: 'Add Product',
      description: 'List a new item',
      icon: PlusIcon,
      link: '/seller/products/new',
      color: 'text-gold-600',
      bgColor: 'bg-gold-50',
      category: 'product',
    },
    {
      id: 'manage-products',
      title: 'Manage Products',
      description: 'Edit inventory',
      icon: CubeIcon,
      link: '/seller/products',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      category: 'product',
    },
    {
      id: 'bulk-edit',
      title: 'Bulk Edit',
      description: 'Update multiple',
      icon: PencilSquareIcon,
      link: '/seller/products/bulk',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      category: 'product',
    },
    {
      id: 'import-products',
      title: 'Import Products',
      description: 'Upload CSV',
      icon: ArrowUpTrayIcon,
      link: '/seller/products/import',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      category: 'product',
    },

    // Order Management
    {
      id: 'process-orders',
      title: 'Process Orders',
      description: 'View pending',
      icon: ShoppingCartIcon,
      link: '/seller/orders',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      category: 'order',
      badge: 5,
    },
    {
      id: 'print-labels',
      title: 'Print Labels',
      description: 'Shipping labels',
      icon: PrinterIcon,
      link: '/seller/orders/labels',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      category: 'order',
    },
    {
      id: 'export-orders',
      title: 'Export Orders',
      description: 'Download data',
      icon: DocumentArrowDownIcon,
      link: '/seller/orders/export',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      category: 'order',
    },

    // Marketing
    {
      id: 'create-promotion',
      title: 'Create Promotion',
      description: 'New discount',
      icon: MegaphoneIcon,
      link: '/seller/promotions/new',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      category: 'marketing',
    },
    {
      id: 'send-newsletter',
      title: 'Newsletter',
      description: 'Email customers',
      icon: EnvelopeIcon,
      link: '/seller/marketing/newsletter',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      category: 'marketing',
    },
    {
      id: 'view-analytics',
      title: 'Analytics',
      description: 'Deep insights',
      icon: ChartBarIcon,
      link: '/seller/analytics',
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      category: 'marketing',
    },

    // Communication
    {
      id: 'messages',
      title: 'Messages',
      description: 'Customer chat',
      icon: ChatBubbleLeftRightIcon,
      link: '/seller/messages',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      category: 'communication',
      badge: 12,
    },
    {
      id: 'reviews',
      title: 'Reviews',
      description: 'Respond to feedback',
      icon: StarIcon,
      link: '/seller/reviews',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      category: 'communication',
      badge: 8,
    },
    {
      id: 'support',
      title: 'Support',
      description: 'Get help',
      icon: LifebuoyIcon,
      link: '/seller/support',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      category: 'communication',
    },
  ];

  const categories = [
    { id: 'product', title: 'Product Management', color: 'text-purple-600' },
    { id: 'order', title: 'Order Management', color: 'text-blue-600' },
    { id: 'marketing', title: 'Marketing', color: 'text-pink-600' },
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


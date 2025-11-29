import { motion } from 'framer-motion';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import clsx from 'clsx';
import { formatCurrency, formatDate } from '@/core/utils/format';
import {
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Order {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  customer: {
    name: string;
    email: string;
  };
  isUrgent?: boolean;
}

interface OrderKanbanProps {
  orders: Order[];
  onStatusChange?: (orderId: string, newStatus: string) => void;
}

const OrderKanban = ({ orders, onStatusChange }: OrderKanbanProps) => {
  const columns: Array<{
    status: Order['status'];
    title: string;
    icon: any;
    color: string;
    bgColor: string;
  }> = [
    {
      status: 'pending',
      title: 'Pending',
      icon: ExclamationTriangleIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      status: 'processing',
      title: 'Processing',
      icon: ClockIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      status: 'shipped',
      title: 'Shipped',
      icon: TruckIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      status: 'delivered',
      title: 'Delivered',
      icon: CheckCircleIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter((order) => order.status === status);
  };

  return (
    <Card className="col-span-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-grey-900">Order Pipeline</h3>
        <p className="text-sm text-grey-500">Track orders through fulfillment stages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column, columnIndex) => {
          const columnOrders = getOrdersByStatus(column.status);
          const Icon = column.icon;

          return (
            <motion.div
              key={column.status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: columnIndex * 0.1 }}
              className="flex flex-col"
            >
              {/* Column Header */}
              <div className={clsx('rounded-xl p-4 mb-3', column.bgColor)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={clsx('w-5 h-5', column.color)} />
                    <span className={clsx('font-semibold text-sm', column.color)}>
                      {column.title}
                    </span>
                  </div>
                  <span
                    className={clsx(
                      'px-2 py-1 rounded-full text-xs font-bold',
                      column.bgColor,
                      column.color
                    )}
                  >
                    {columnOrders.length}
                  </span>
                </div>
              </div>

              {/* Order Cards */}
              <div className="flex-1 space-y-3 min-h-[200px]">
                {columnOrders.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-grey-400 text-sm">
                    No orders
                  </div>
                ) : (
                  columnOrders.map((order, orderIndex) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: orderIndex * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={clsx(
                        'bg-white border-2 rounded-xl p-4 cursor-move shadow-sm hover:shadow-md transition-all duration-200',
                        order.isUrgent ? 'border-red-300' : 'border-grey-200'
                      )}
                    >
                      {/* Order Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-bold text-grey-900">
                            #{order.orderNumber}
                          </p>
                          <p className="text-xs text-grey-500 mt-0.5">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        {order.isUrgent && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                          </motion.div>
                        )}
                      </div>

                      {/* Customer Info */}
                      <div className="mb-3 pb-3 border-b border-grey-100">
                        <p className="text-sm font-medium text-grey-900">
                          {order.customer.name}
                        </p>
                        <p className="text-xs text-grey-500 truncate">
                          {order.customer.email}
                        </p>
                      </div>

                      {/* Order Amount */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-grey-500">Amount</span>
                        <span className="text-sm font-bold text-grey-900">
                          {formatCurrency(order.totalPrice)}
                        </span>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-3 pt-3 border-t border-grey-100 flex gap-2">
                        <button className="flex-1 text-xs font-medium text-gold hover:bg-gold-50 py-2 rounded-lg transition-colors">
                          View
                        </button>
                        {column.status !== 'delivered' && (
                          <button
                            onClick={() =>
                              onStatusChange?.(
                                order._id,
                                columns[columnIndex + 1]?.status || column.status
                              )
                            }
                            className="flex-1 text-xs font-medium text-grey-600 hover:bg-grey-100 py-2 rounded-lg transition-colors"
                          >
                            Next →
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default OrderKanban;


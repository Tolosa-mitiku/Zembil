import { Order } from '../api/ordersApi';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency, formatDate } from '@/core/utils/format';
import { ORDER_STATUS } from '@/core/constants';
import {
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState } from 'react';

interface OrderTableViewProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onShipOrder: (order: Order) => void;
  onMarkDelivered: (order: Order) => void;
  onContactCustomer: (order: Order) => void;
  className?: string;
}

const OrderTableView = ({
  orders,
  onViewDetails,
  onShipOrder,
  onMarkDelivered,
  onContactCustomer,
  className,
}: OrderTableViewProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const getActions = (order: Order) => {
    const actions = [
      {
        label: 'View Details',
        onClick: () => {
          onViewDetails(order);
          setOpenMenuId(null);
        },
        icon: <EyeIcon className="w-4 h-4" />,
      },
    ];

    if (order.status === ORDER_STATUS.CONFIRMED || order.status === ORDER_STATUS.PROCESSING) {
      actions.push({
        label: 'Mark as Shipped',
        onClick: () => {
          onShipOrder(order);
          setOpenMenuId(null);
        },
        icon: <TruckIcon className="w-4 h-4" />,
      });
    }

    if (order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.OUT_FOR_DELIVERY) {
      actions.push({
        label: 'Mark as Delivered',
        onClick: () => {
          onMarkDelivered(order);
          setOpenMenuId(null);
        },
        icon: <CheckCircleIcon className="w-4 h-4" />,
      });
    }

    return actions;
  };

  return (
    <div className={clsx('bg-white rounded-xl border border-grey-200 overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-grey-50 border-b border-grey-200">
            <tr>
              <th className="px-6 py-4 text-left text-label-small font-semibold text-grey-700 uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-4 text-left text-label-small font-semibold text-grey-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-label-small font-semibold text-grey-700 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-4 text-left text-label-small font-semibold text-grey-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-label-small font-semibold text-grey-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-label-small font-semibold text-grey-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-label-small font-semibold text-grey-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-200">
            {orders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-grey-50 transition-colors"
              >
                {/* Order Number */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="text-body-medium font-semibold text-grey-900 hover:text-gold transition-colors"
                  >
                    #{order.orderNumber}
                  </button>
                </td>

                {/* Customer */}
                <td className="px-6 py-4">
                  <div>
                    <p className="text-body-medium text-grey-900 font-medium">
                      {order.customer.name}
                    </p>
                    <p className="text-label-small text-grey-600">
                      {order.customer.email}
                    </p>
                  </div>
                </td>

                {/* Items */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {/* Show first 3 item thumbnails */}
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        item.image ? (
                          <img
                            key={idx}
                            src={item.image}
                            alt={item.title}
                            className="w-8 h-8 rounded-md border-2 border-white object-cover"
                          />
                        ) : (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-md border-2 border-white bg-grey-200"
                          />
                        )
                      ))}
                    </div>
                    <span className="text-body-small text-grey-600">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-body-medium font-semibold text-grey-900">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderStatusBadge status={order.status} size="sm" />
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-body-small text-grey-600">
                    {formatDate(order.createdAt)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === order._id ? null : order._id)}
                      className="p-2 hover:bg-grey-100 rounded-lg transition-colors"
                    >
                      <EllipsisVerticalIcon className="w-5 h-5 text-grey-600" />
                    </button>

                    {openMenuId === order._id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-grey-200 rounded-lg shadow-lg z-50 py-2">
                          {getActions(order).map((action, idx) => (
                            <button
                              key={idx}
                              onClick={action.onClick}
                              className="w-full flex items-center gap-3 px-4 py-2 text-body-small text-grey-700 hover:bg-grey-50 transition-colors"
                            >
                              {action.icon}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTableView;


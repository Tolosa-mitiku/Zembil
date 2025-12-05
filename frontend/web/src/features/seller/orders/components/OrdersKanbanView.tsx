import { useState, useCallback } from 'react';
import { Order } from '../api/ordersApi';
import { ORDER_STATUS, OrderStatus } from '@/core/constants';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency } from '@/core/utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import {
  UserCircleIcon,
  MapPinIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface OrdersKanbanViewProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

interface KanbanCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onDragStart: (e: React.DragEvent, order: Order) => void;
}

const KanbanCard = ({ order, onViewDetails, onDragStart }: KanbanCardProps) => {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      draggable
      onDragStart={(e: any) => onDragStart(e, order)}
      className={clsx(
        'bg-white rounded-xl border-2 border-grey-200 p-4 cursor-move',
        'hover:shadow-lg hover:border-gold-pale transition-all duration-200',
        'group'
      )}
    >
      {/* Drag Handle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-1 bg-grey-400 rounded-full" />
            <div className="w-1 h-1 bg-grey-400 rounded-full" />
            <div className="w-1 h-1 bg-grey-400 rounded-full" />
          </div>
          <button
            onClick={() => onViewDetails(order)}
            className="text-body-medium font-bold text-grey-900 hover:text-gold transition-colors flex items-center gap-1 group/btn"
          >
            #{order.orderNumber.slice(-6)}
            <EyeIcon className="w-3.5 h-3.5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </button>
        </div>
        <span className="text-headline-small font-bold text-gold">
          {formatCurrency(order.totalPrice)}
        </span>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-2 mb-3 text-label-small text-grey-600">
        <UserCircleIcon className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{order.customer.name}</span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-3 text-label-small text-grey-600">
        <MapPinIcon className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{order.shippingAddress.city}</span>
      </div>

      {/* Products Preview */}
      <div className="flex items-center gap-1 mb-3">
        {order.items.slice(0, 3).map((item, idx) => (
          item.image ? (
            <img
              key={idx}
              src={item.image}
              alt={item.title}
              className="w-10 h-10 rounded-lg object-cover border border-grey-200"
            />
          ) : (
            <div
              key={idx}
              className="w-10 h-10 rounded-lg bg-grey-100 flex items-center justify-center text-label-small text-grey-400"
            >
              {item.title.charAt(0)}
            </div>
          )
        ))}
        {order.items.length > 3 && (
          <div className="w-10 h-10 rounded-lg bg-grey-100 flex items-center justify-center text-label-small text-grey-600 font-semibold">
            +{order.items.length - 3}
          </div>
        )}
      </div>

      {/* Meta Info */}
      <div className="flex items-center justify-between text-label-small text-grey-500">
        <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        <span>
          {new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </motion.div>
  );
};

const kanbanColumns = [
  { status: ORDER_STATUS.PENDING, label: 'Pending', color: 'orange' },
  { status: ORDER_STATUS.CONFIRMED, label: 'Confirmed', color: 'blue' },
  { status: ORDER_STATUS.PROCESSING, label: 'Processing', color: 'purple' },
  { status: ORDER_STATUS.SHIPPED, label: 'Shipped', color: 'cyan' },
  { status: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery', color: 'teal' },
  { status: ORDER_STATUS.DELIVERED, label: 'Delivered', color: 'green' },
];

const OrdersKanbanView = ({ orders, onViewDetails, onStatusChange }: OrdersKanbanViewProps) => {
  const [draggedOrder, setDraggedOrder] = useState<Order | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<OrderStatus | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, order: Order) => {
    setDraggedOrder(order);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedOrder(null);
    setDragOverColumn(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: OrderStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, status: OrderStatus) => {
      e.preventDefault();
      if (draggedOrder && draggedOrder.status !== status) {
        onStatusChange(draggedOrder._id, status);
      }
      setDraggedOrder(null);
      setDragOverColumn(null);
    },
    [draggedOrder, onStatusChange]
  );

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-400px)] min-h-[600px]">
      {kanbanColumns.map(column => {
        const columnOrders = getOrdersByStatus(column.status);
        const isOver = dragOverColumn === column.status;

        return (
          <div
            key={column.status}
            className="flex-shrink-0 w-80 flex flex-col"
            onDragOver={(e) => handleDragOver(e, column.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.status)}
            onDragEnd={handleDragEnd}
          >
            {/* Column Header */}
            <div
              className={clsx(
                'rounded-t-xl border-2 border-b-0 p-4 transition-all duration-200',
                isOver
                  ? 'bg-gold-pale border-gold shadow-lg scale-105'
                  : 'bg-grey-50 border-grey-200'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <OrderStatusBadge status={column.status} size="md" />
                <span className="text-headline-small font-bold text-grey-900">
                  {columnOrders.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-label-small text-grey-600">
                <span>
                  {columnOrders.reduce((sum, order) => sum + order.totalPrice, 0) > 0
                    ? formatCurrency(columnOrders.reduce((sum, order) => sum + order.totalPrice, 0))
                    : 'No orders'}
                </span>
              </div>
            </div>

            {/* Column Body */}
            <div
              className={clsx(
                'flex-1 rounded-b-xl border-2 border-t-0 p-3 space-y-3 overflow-y-auto transition-all duration-200',
                'scrollbar-thin scrollbar-thumb-grey-300 scrollbar-track-transparent',
                isOver
                  ? 'bg-gold-pale/20 border-gold'
                  : 'bg-grey-50/50 border-grey-200'
              )}
            >
              <AnimatePresence>
                {columnOrders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-32 text-label-small text-grey-400 text-center"
                  >
                    {isOver ? (
                      <div className="text-gold font-semibold">Drop order here</div>
                    ) : (
                      <div>No orders in this status</div>
                    )}
                  </motion.div>
                ) : (
                  columnOrders.map(order => (
                    <KanbanCard
                      key={order._id}
                      order={order}
                      onViewDetails={onViewDetails}
                      onDragStart={handleDragStart}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersKanbanView;






import { Order } from '../api/ordersApi';
import OrderStatusBadge from './OrderStatusBadge';
import OrderTimeline from './OrderTimeline';
import { formatCurrency, formatDate } from '@/core/utils/format';
import { ORDER_STATUS } from '@/core/constants';
import {
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  PrinterIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserCircleIcon,
  CreditCardIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import {
  CheckBadgeIcon as CheckBadgeSolidIcon,
} from '@heroicons/react/24/solid';
import Button from '@/shared/components/Button';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface OrderCardEnhancedProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onShipOrder: (order: Order) => void;
  onMarkDelivered: (order: Order) => void;
  onContactCustomer: (order: Order) => void;
  isSelected?: boolean;
  onSelect?: (orderId: string) => void;
  index?: number;
}

const OrderCardEnhanced = ({
  order,
  onViewDetails,
  onShipOrder,
  onMarkDelivered,
  onContactCustomer,
  isSelected = false,
  onSelect,
  index = 0,
}: OrderCardEnhancedProps) => {
  const canShip = order.status === ORDER_STATUS.CONFIRMED || order.status === ORDER_STATUS.PROCESSING;
  const canDeliver = order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.OUT_FOR_DELIVERY;
  
  const itemsToShow = order.items.slice(0, 3);
  const remainingItems = order.items.length - 3;

  // Calculate time since order
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const orderDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const days = Math.floor(diffInHours / 24);
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={clsx(
        'bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300',
        'shadow-md hover:shadow-2xl hover:-translate-y-1',
        isSelected
          ? 'border-gold ring-4 ring-gold-pale shadow-xl'
          : 'border-grey-200 hover:border-gold-pale'
      )}
    >
      {/* HEADER SECTION */}
      <div className="relative px-6 py-4 bg-gradient-to-r from-grey-50 to-white border-b border-grey-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(order._id)}
                className="w-5 h-5 rounded border-2 border-grey-300 text-gold focus:ring-gold cursor-pointer"
              />
            )}
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg">
                <CheckBadgeSolidIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <button
                  onClick={() => onViewDetails(order)}
                  className="text-body-large font-bold text-grey-900 hover:text-gold transition-colors flex items-center gap-2 group"
                >
                  #{order.orderNumber}
                  <EyeIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <div className="flex items-center gap-2 text-label-small text-grey-600">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{formatDate(order.createdAt)}</span>
                  <span className="text-grey-400">•</span>
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span className="font-medium text-gold">{getTimeAgo(order.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <OrderStatusBadge status={order.status} size="lg" />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CUSTOMER SECTION */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100 h-full">
              <h4 className="text-label-medium text-grey-600 font-bold mb-4 uppercase tracking-wide flex items-center gap-2">
                <UserCircleIcon className="w-5 h-5 text-blue-600" />
                Customer Info
              </h4>
              
              <div className="space-y-4">
                {/* Customer Avatar & Name */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-body-large shadow-lg">
                    {order.customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-medium text-grey-900 font-semibold truncate">
                      {order.customer.name}
                    </p>
                    <p className="text-label-small text-grey-600 truncate">
                      {order.customer.email}
                    </p>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onContactCustomer(order)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-label-small font-medium"
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    Email
                  </button>
                  {order.shippingAddress.phoneNumber && (
                    <a
                      href={`tel:${order.shippingAddress.phoneNumber}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors text-label-small font-medium"
                    >
                      <PhoneIcon className="w-4 h-4" />
                      Call
                    </a>
                  )}
                </div>

                {/* Shipping Address */}
                <div className="pt-3 border-t border-blue-200">
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-label-small text-grey-600 font-medium mb-1">Shipping to:</p>
                      <p className="text-body-small text-grey-900">
                        {order.shippingAddress.addressLine1}
                      </p>
                      {order.shippingAddress.addressLine2 && (
                        <p className="text-body-small text-grey-900">
                          {order.shippingAddress.addressLine2}
                        </p>
                      )}
                      <p className="text-body-small text-grey-900">
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-body-small text-grey-600">
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCTS SECTION */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100 h-full">
              <h4 className="text-label-medium text-grey-600 font-bold mb-4 uppercase tracking-wide flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Items ({order.items.length})
              </h4>
              
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50">
                {itemsToShow.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 group bg-white rounded-lg p-3 hover:shadow-md transition-all border border-transparent hover:border-purple-200"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-grey-200 group-hover:border-purple-300 transition-all group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-body-small text-grey-900 font-medium truncate group-hover:text-purple-700 transition-colors">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-small bg-purple-100 text-purple-700 font-semibold">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-body-small text-grey-900 font-bold">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {remainingItems > 0 && (
                  <button
                    onClick={() => onViewDetails(order)}
                    className="w-full text-label-medium text-purple-700 hover:text-purple-800 font-semibold bg-purple-50 hover:bg-purple-100 rounded-lg py-2 transition-all"
                  >
                    +{remainingItems} more item{remainingItems > 1 ? 's' : ''} →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* PAYMENT & SUMMARY */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-gold-pale to-white rounded-xl p-5 border-2 border-gold shadow-lg h-full">
              <h4 className="text-label-medium text-grey-600 font-bold mb-4 uppercase tracking-wide flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5 text-gold" />
                Payment Summary
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-body-small text-grey-600">Subtotal:</span>
                  <span className="text-body-medium text-grey-900 font-semibold">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
                
                <div className="pt-3 border-t-2 border-gold/30">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-body-large text-grey-900 font-bold">Total:</span>
                    <span className="text-headline-medium text-gold font-black">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 flex items-center justify-center gap-2">
                  <CheckBadgeSolidIcon className="w-5 h-5 text-green-600" />
                  <span className="text-body-medium text-green-700 font-bold">Paid</span>
                </div>

                {/* Tracking Info */}
                {order.trackingNumber && (
                  <div className="mt-4 pt-4 border-t-2 border-gold/30">
                    <p className="text-label-small text-grey-600 font-semibold mb-1">Tracking Number:</p>
                    <p className="text-body-small text-grey-900 font-mono bg-white px-3 py-2 rounded-lg border border-gold">
                      {order.trackingNumber}
                    </p>
                    {order.carrier && (
                      <p className="text-label-small text-grey-600 mt-2 flex items-center gap-1">
                        <TruckIcon className="w-3.5 h-3.5" />
                        via {order.carrier}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TRACKING TIMELINE */}
        <div className="mt-6 pt-6 border-t-2 border-grey-200">
          <OrderTimeline currentStatus={order.status} />
        </div>
      </div>

      {/* ACTIONS FOOTER */}
      <div className="px-6 py-4 bg-gradient-to-r from-grey-50 to-white border-t border-grey-200">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(order)}
              leftIcon={<EyeIcon className="w-4 h-4" />}
            >
              View Details
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onContactCustomer(order)}
              leftIcon={<EnvelopeIcon className="w-4 h-4" />}
            >
              Contact
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {canShip && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onShipOrder(order)}
                leftIcon={<TruckIcon className="w-4 h-4" />}
                className="shadow-lg hover:shadow-xl"
              >
                Mark as Shipped
              </Button>
            )}

            {canDeliver && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onMarkDelivered(order)}
                leftIcon={<CheckCircleIcon className="w-4 h-4" />}
                className="shadow-lg hover:shadow-xl"
              >
                Mark as Delivered
              </Button>
            )}

            {order.status === ORDER_STATUS.DELIVERED && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<PrinterIcon className="w-4 h-4" />}
              >
                Print Invoice
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCardEnhanced;


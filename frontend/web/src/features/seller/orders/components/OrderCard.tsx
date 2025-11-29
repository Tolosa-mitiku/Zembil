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
  EllipsisVerticalIcon,
  ReceiptPercentIcon,
  UserIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Button from '@/shared/components/Button';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onShipOrder: (order: Order) => void;
  onMarkDelivered: (order: Order) => void;
  onContactCustomer: (order: Order) => void;
  className?: string;
}

const OrderCard = ({
  order,
  onViewDetails,
  onShipOrder,
  onMarkDelivered,
  onContactCustomer,
  className,
}: OrderCardProps) => {
  const navigate = useNavigate();
  const canShip = order.status === ORDER_STATUS.CONFIRMED || order.status === ORDER_STATUS.PROCESSING;
  const canDeliver = order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.OUT_FOR_DELIVERY;
  
  const itemsToShow = order.items.slice(0, 3);
  const remainingItems = order.items.length - 3;

  // Handle card click - navigate to detail page
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a button or interactive element
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'A'
    ) {
      return;
    }
    navigate(`/seller/orders/${order._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={clsx(
        'bg-white rounded-xl border border-grey-200 overflow-hidden transition-all duration-200',
        'hover:shadow-lg hover:scale-[1.01] hover:border-gold-pale cursor-pointer',
        'animate-fade-in',
        className
      )}
    >
      {/* Card Header */}
      <div className="px-5 py-4 bg-grey-50 border-b border-grey-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-pale flex items-center justify-center">
              <ReceiptPercentIcon className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="text-body-large font-semibold text-grey-900 transition-colors">
                #{order.orderNumber}
              </div>
              <p className="text-label-small text-grey-600">
                {formatDate(order.createdAt)} at {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <OrderStatusBadge status={order.status} size="md" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Product Items Preview */}
          <div className="lg:col-span-5">
            <h4 className="text-label-small text-grey-600 font-semibold mb-3 uppercase">
              Order Items ({order.items.length})
            </h4>
            <div className="space-y-2">
              {itemsToShow.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover border border-grey-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-grey-100 flex items-center justify-center">
                      <ReceiptPercentIcon className="w-6 h-6 text-grey-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-body-small text-grey-900 truncate group-hover:text-gold transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-label-small text-grey-600">Qty: {item.quantity}</span>
                      <span className="text-label-small text-grey-400">•</span>
                      <span className="text-label-small text-grey-900 font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {remainingItems > 0 && (
                <button
                  onClick={() => onViewDetails(order)}
                  className="text-label-small text-gold hover:text-gold-dark font-medium mt-2"
                >
                  +{remainingItems} more item{remainingItems > 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="lg:col-span-4">
            <h4 className="text-label-small text-grey-600 font-semibold mb-3 uppercase">
              Customer Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <UserIcon className="w-4 h-4 text-grey-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-body-small text-grey-900 font-medium">
                    {order.customer.name}
                  </p>
                  <p className="text-label-small text-grey-600">
                    {order.customer.email}
                  </p>
                </div>
              </div>
              
              {order.shippingAddress.phoneNumber && (
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-grey-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-label-small text-grey-600">
                    {order.shippingAddress.phoneNumber}
                  </p>
                </div>
              )}
              
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 text-grey-400 mt-0.5 flex-shrink-0" />
                <p className="text-label-small text-grey-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state || order.shippingAddress.country}
                </p>
              </div>

              {/* Tracking Info */}
              {order.trackingNumber && (
                <div className="mt-3 pt-3 border-t border-grey-200">
                  <p className="text-label-small text-grey-600">Tracking:</p>
                  <p className="text-body-small text-grey-900 font-mono">
                    {order.trackingNumber}
                  </p>
                  {order.carrier && (
                    <p className="text-label-small text-grey-600 mt-1">
                      via {order.carrier}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-3">
            <h4 className="text-label-small text-grey-600 font-semibold mb-3 uppercase">
              Order Summary
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-body-small text-grey-600">Subtotal:</span>
                <span className="text-body-small text-grey-900">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
              
              <div className="pt-2 border-t border-grey-200">
                <div className="flex justify-between items-center">
                  <span className="text-body-medium text-grey-900 font-semibold">Total:</span>
                  <span className="text-headline-medium text-gold font-bold">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Payment Badge */}
              <div className="pt-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-label-small bg-green-50 text-green-700 border border-green-200">
                  ✓ Paid
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 pt-5 border-t border-grey-200">
          <OrderTimeline currentStatus={order.status} />
        </div>
      </div>

      {/* Card Footer - Actions */}
      <div className="px-5 py-4 bg-grey-50 border-t border-grey-200">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/seller/orders/${order._id}`)}
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
    </div>
  );
};

export default OrderCard;


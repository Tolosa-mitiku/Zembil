import Modal from '@/shared/components/Modal';
import Badge from '@/shared/components/Badge';
import { Order } from '../api/ordersApi';
import { formatCurrency, formatDate, formatOrderStatus } from '@/core/utils/format';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsModal = ({ isOpen, onClose, order }: OrderDetailsModalProps) => {
  if (!order) return null;

  const getStatusVariant = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
      delivered: 'success',
      shipped: 'info',
      out_for_delivery: 'info',
      processing: 'warning',
      confirmed: 'warning',
      pending: 'warning',
      canceled: 'error',
    };
    return statusMap[status] || 'default';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Order Details" size="lg">
      <div className="space-y-6">
        {/* Order Info */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-title-medium text-grey-900">
                Order #{order.orderNumber}
              </h3>
              <p className="text-body-small text-grey-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge variant={getStatusVariant(order.status)}>
              {formatOrderStatus(order.status)}
            </Badge>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h4 className="text-title-small text-grey-900 mb-2">Customer</h4>
          <div className="bg-grey-50 p-4 rounded-md">
            <p className="text-body-medium text-grey-900">{order.customer.name}</p>
            <p className="text-body-small text-grey-600">{order.customer.email}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h4 className="text-title-small text-grey-900 mb-2">Shipping Address</h4>
          <div className="bg-grey-50 p-4 rounded-md">
            <p className="text-body-medium text-grey-900">
              {order.shippingAddress.fullName}
            </p>
            <p className="text-body-small text-grey-600">
              {order.shippingAddress.phoneNumber}
            </p>
            <p className="text-body-small text-grey-600 mt-2">
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
            </p>
            <p className="text-body-small text-grey-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-body-small text-grey-600">
              {order.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Tracking Info */}
        {order.trackingNumber && (
          <div>
            <h4 className="text-title-small text-grey-900 mb-2">Tracking Information</h4>
            <div className="bg-grey-50 p-4 rounded-md">
              <p className="text-body-small text-grey-600">Carrier</p>
              <p className="text-body-medium text-grey-900">{order.carrier}</p>
              <p className="text-body-small text-grey-600 mt-2">Tracking Number</p>
              <p className="text-body-medium text-grey-900">{order.trackingNumber}</p>
              {order.estimatedDelivery && (
                <>
                  <p className="text-body-small text-grey-600 mt-2">Estimated Delivery</p>
                  <p className="text-body-medium text-grey-900">
                    {formatDate(order.estimatedDelivery)}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div>
          <h4 className="text-title-small text-grey-900 mb-2">Order Items</h4>
          <div className="border border-grey-200 rounded-md overflow-hidden">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border-b border-grey-200 last:border-b-0"
              >
                <div className="flex items-center">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                  )}
                  <div>
                    <p className="text-body-medium text-grey-900">{item.title}</p>
                    <p className="text-label-small text-grey-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-body-medium font-medium text-grey-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-4 border-t border-grey-200">
          <span className="text-title-medium text-grey-900">Total</span>
          <span className="text-title-large text-grey-900 font-semibold">
            {formatCurrency(order.totalPrice)}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;


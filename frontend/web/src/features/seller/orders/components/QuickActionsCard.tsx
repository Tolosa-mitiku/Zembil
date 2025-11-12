import { Order } from '../api/ordersApi';
import { motion } from 'framer-motion';
import {
  TruckIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PrinterIcon,
  EnvelopeIcon,
  PhoneIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useShipOrderMutation, useDeliverOrderMutation } from '../api/ordersApi';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface QuickActionsCardProps {
  order: Order;
}

const QuickActionsCard = ({ order }: QuickActionsCardProps) => {
  const [shipOrder, { isLoading: isShipping }] = useShipOrderMutation();
  const [deliverOrder, { isLoading: isDelivering }] = useDeliverOrderMutation();

  const handleMarkShipped = () => {
    toast.success('Ship order modal would open here');
  };

  const handleMarkDelivered = async () => {
    try {
      await deliverOrder(order._id).unwrap();
      toast.success('Order marked as delivered! ✅');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to mark as delivered');
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handlePrintLabel = () => {
    toast.success('Printing shipping label...');
  };

  const handleContactCustomer = () => {
    window.location.href = `mailto:${order.customer.email}?subject=Regarding Order ${order.orderNumber}`;
  };

  const handleCallCustomer = () => {
    if (order.shippingAddress.phoneNumber) {
      window.location.href = `tel:${order.shippingAddress.phoneNumber}`;
    } else {
      toast.error('No phone number available');
    }
  };

  const handleCancelOrder = () => {
    toast.error('Cancel order feature coming soon');
  };

  const handleRefundOrder = () => {
    toast.error('Refund order feature coming soon');
  };

  // Primary action based on status
  const getPrimaryAction = () => {
    switch (order.status) {
      case 'confirmed':
      case 'processing':
        return {
          label: 'Mark as Shipped',
          icon: TruckIcon,
          onClick: handleMarkShipped,
          color: 'bg-gradient-to-r from-cyan-500 to-blue-500',
          hoverColor: 'hover:from-cyan-600 hover:to-blue-600',
        };
      case 'shipped':
      case 'out_for_delivery':
        return {
          label: 'Mark as Delivered',
          icon: CheckCircleIcon,
          onClick: handleMarkDelivered,
          color: 'bg-gradient-to-r from-green-500 to-emerald-500',
          hoverColor: 'hover:from-green-600 hover:to-emerald-600',
        };
      case 'delivered':
        return {
          label: 'View Receipt',
          icon: DocumentTextIcon,
          onClick: () => toast.success('Receipt view coming soon'),
          color: 'bg-gradient-to-r from-purple-500 to-pink-500',
          hoverColor: 'hover:from-purple-600 hover:to-pink-600',
        };
      default:
        return null;
    }
  };

  const primaryAction = getPrimaryAction();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-grey-200">
        <h3 className="text-lg font-bold text-grey-900">Quick Actions</h3>
        <p className="text-xs text-grey-600 mt-1">Manage this order</p>
      </div>

      <div className="p-6 space-y-3">
        {/* Primary Action */}
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            disabled={isShipping || isDelivering}
            className={clsx(
              'w-full flex items-center justify-center gap-3 px-6 py-4 text-white rounded-xl font-bold',
              'shadow-lg transform hover:scale-105 transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
              primaryAction.color,
              primaryAction.hoverColor
            )}
          >
            {isShipping || isDelivering ? (
              <>
                <ArrowPathIcon className="w-6 h-6 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <primaryAction.icon className="w-6 h-6" />
                <span>{primaryAction.label}</span>
              </>
            )}
          </button>
        )}

        {/* Communication Actions */}
        <div className="pt-3 border-t border-grey-200">
          <div className="text-xs font-semibold text-grey-600 mb-3">Communication</div>
          <div className="space-y-2">
            <button
              onClick={handleContactCustomer}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-semibold transition-colors border border-blue-200"
            >
              <EnvelopeIcon className="w-5 h-5" />
              <span className="text-sm">Email Customer</span>
            </button>
            {order.shippingAddress.phoneNumber && (
              <button
                onClick={handleCallCustomer}
                className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-semibold transition-colors border border-green-200"
              >
                <PhoneIcon className="w-5 h-5" />
                <span className="text-sm">Call Customer</span>
              </button>
            )}
          </div>
        </div>

        {/* Print Actions */}
        <div className="pt-3 border-t border-grey-200">
          <div className="text-xs font-semibold text-grey-600 mb-3">Documents</div>
          <div className="space-y-2">
            <button
              onClick={handlePrintInvoice}
              className="w-full flex items-center gap-3 px-4 py-3 bg-grey-50 hover:bg-grey-100 text-grey-700 rounded-xl font-semibold transition-colors border border-grey-200"
            >
              <PrinterIcon className="w-5 h-5" />
              <span className="text-sm">Print Invoice</span>
            </button>
            <button
              onClick={handlePrintLabel}
              className="w-full flex items-center gap-3 px-4 py-3 bg-grey-50 hover:bg-grey-100 text-grey-700 rounded-xl font-semibold transition-colors border border-grey-200"
            >
              <PrinterIcon className="w-5 h-5" />
              <span className="text-sm">Print Shipping Label</span>
            </button>
            <button
              onClick={() => toast.success('Downloading PDF...')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-grey-50 hover:bg-grey-100 text-grey-700 rounded-xl font-semibold transition-colors border border-grey-200"
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span className="text-sm">Download PDF</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        {order.status !== 'delivered' && order.status !== 'canceled' && (
          <details className="pt-3 border-t border-grey-200 group">
            <summary className="cursor-pointer text-xs font-semibold text-red-600 mb-3 list-none flex items-center justify-between">
              <span>Danger Zone</span>
              <svg
                className="w-4 h-4 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="space-y-2 mt-3">
              <button
                onClick={handleRefundOrder}
                className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl font-semibold transition-colors border border-orange-200"
              >
                <ArrowPathIcon className="w-5 h-5" />
                <span className="text-sm">Initiate Refund</span>
              </button>
              <button
                onClick={handleCancelOrder}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-semibold transition-colors border border-red-200"
              >
                <XCircleIcon className="w-5 h-5" />
                <span className="text-sm">Cancel Order</span>
              </button>
            </div>
          </details>
        )}
      </div>
    </motion.div>
  );
};

export default QuickActionsCard;


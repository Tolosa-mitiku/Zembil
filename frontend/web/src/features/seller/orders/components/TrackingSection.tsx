import { Order } from '../api/ordersApi';
import { motion } from 'framer-motion';
import {
  TruckIcon,
  ClipboardDocumentIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface TrackingSectionProps {
  order: Order;
}

const TrackingSection = ({ order }: TrackingSectionProps) => {
  const handleCopyTracking = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      toast.success('Tracking number copied to clipboard! 📋');
    }
  };

  const handleOpenCarrierSite = () => {
    // This would open the carrier's tracking page
    toast.success(`Opening ${order.carrier || 'carrier'} tracking page...`);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not available';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-grey-200 bg-gradient-to-r from-cyan-50/50 to-blue-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <TruckIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-grey-900">Tracking & Delivery</h2>
            <p className="text-sm text-grey-600">Package tracking information</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Tracking Number */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <ClipboardDocumentIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-grey-600 mb-1">Tracking Number</div>
              <div className="font-mono text-xl font-bold text-grey-900">
                {order.trackingNumber || 'N/A'}
              </div>
            </div>
          </div>
          {order.trackingNumber && (
            <button
              onClick={handleCopyTracking}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors border border-blue-200"
            >
              Copy
            </button>
          )}
        </div>

        {/* Carrier & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Carrier Info */}
          {order.carrier && (
            <div className="p-6 bg-grey-50 rounded-xl border border-grey-200">
              <div className="flex items-center gap-3 mb-3">
                <TruckIcon className="w-5 h-5 text-grey-600" />
                <span className="text-sm text-grey-600 font-medium">Shipping Carrier</span>
              </div>
              <div className="text-xl font-bold text-grey-900 mb-2">{order.carrier}</div>
              <button
                onClick={handleOpenCarrierSite}
                className="text-sm text-gold hover:text-gold-dark font-semibold transition-colors"
              >
                Track on {order.carrier} →
              </button>
            </div>
          )}

          {/* Estimated Delivery */}
          {order.estimatedDelivery && (
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <CalendarDaysIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700 font-medium">Estimated Delivery</span>
              </div>
              <div className="text-lg font-bold text-grey-900">
                {formatDate(order.estimatedDelivery)}
              </div>
              {order.status === 'delivered' && (
                <div className="flex items-center gap-2 mt-2 text-green-600">
                  <CheckBadgeIcon className="w-5 h-5" />
                  <span className="text-sm font-semibold">Delivered</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Shipping Method */}
        <div className="p-6 bg-grey-50 rounded-xl border border-grey-200">
          <h3 className="text-sm font-semibold text-grey-700 mb-4">Delivery Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-grey-600">Shipping Method:</span>
              <div className="font-semibold text-grey-900 mt-1">Standard Shipping</div>
            </div>
            <div>
              <span className="text-grey-600">Package Weight:</span>
              <div className="font-semibold text-grey-900 mt-1">N/A</div>
            </div>
            <div>
              <span className="text-grey-600">Signature Required:</span>
              <div className="font-semibold text-grey-900 mt-1">No</div>
            </div>
            <div>
              <span className="text-grey-600">Leave at Door:</span>
              <div className="font-semibold text-grey-900 mt-1">Yes</div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <MapPinIcon className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-grey-900">Delivery Address</h3>
          </div>
          <div className="text-grey-700 leading-relaxed">
            {order.shippingAddress.fullName && (
              <div className="font-semibold text-grey-900 mb-2">
                {order.shippingAddress.fullName}
              </div>
            )}
            <div>{order.shippingAddress.addressLine1}</div>
            {order.shippingAddress.addressLine2 && (
              <div>{order.shippingAddress.addressLine2}</div>
            )}
            <div>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </div>
            <div>{order.shippingAddress.country}</div>
            {order.shippingAddress.phoneNumber && (
              <div className="mt-2 font-semibold">
                📞 {order.shippingAddress.phoneNumber}
              </div>
            )}
          </div>
        </div>

        {/* Last Update */}
        <div className="text-center py-4 text-sm text-grey-500">
          Last updated: {formatDate(order.updatedAt)}
        </div>
      </div>
    </motion.div>
  );
};

export default TrackingSection;


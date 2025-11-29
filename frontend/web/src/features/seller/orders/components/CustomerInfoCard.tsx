import { Order } from '../api/ordersApi';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface CustomerInfoCardProps {
  order: Order;
}

const CustomerInfoCard = ({ order }: CustomerInfoCardProps) => {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(order.customer.email);
    toast.success('Email copied to clipboard! 📧');
  };

  const handleCopyPhone = () => {
    if (order.shippingAddress.phoneNumber) {
      navigator.clipboard.writeText(order.shippingAddress.phoneNumber);
      toast.success('Phone number copied to clipboard! 📱');
    }
  };

  const handleEmailCustomer = () => {
    window.location.href = `mailto:${order.customer.email}?subject=Regarding Order ${order.orderNumber}`;
  };

  const handleCallCustomer = () => {
    if (order.shippingAddress.phoneNumber) {
      window.location.href = `tel:${order.shippingAddress.phoneNumber}`;
    }
  };

  const handleViewOnMap = () => {
    const address = [
      order.shippingAddress.addressLine1,
      order.shippingAddress.addressLine2,
      order.shippingAddress.city,
      order.shippingAddress.postalCode,
      order.shippingAddress.country,
    ]
      .filter(Boolean)
      .join(', ');
    
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-b border-grey-200">
        <h3 className="text-lg font-bold text-grey-900 mb-4">Customer Information</h3>
        
        {/* Customer Profile */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {order.customer.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-grey-900">{order.customer.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 text-xs font-semibold text-gold bg-gold/10 rounded-full">
                Customer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6 space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <div className="text-xs text-grey-600 font-semibold">Email Address</div>
          <div className="flex items-center justify-between p-3 bg-grey-50 rounded-lg border border-grey-200">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <EnvelopeIcon className="w-5 h-5 text-grey-500 flex-shrink-0" />
              <span className="text-sm text-grey-900 truncate">{order.customer.email}</span>
            </div>
            <button
              onClick={handleCopyEmail}
              className="ml-2 text-xs font-semibold text-gold hover:text-gold-dark transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Phone */}
        {order.shippingAddress.phoneNumber && (
          <div className="space-y-2">
            <div className="text-xs text-grey-600 font-semibold">Phone Number</div>
            <div className="flex items-center justify-between p-3 bg-grey-50 rounded-lg border border-grey-200">
              <div className="flex items-center gap-2 flex-1">
                <PhoneIcon className="w-5 h-5 text-grey-500 flex-shrink-0" />
                <span className="text-sm text-grey-900">{order.shippingAddress.phoneNumber}</span>
              </div>
              <button
                onClick={handleCopyPhone}
                className="ml-2 text-xs font-semibold text-gold hover:text-gold-dark transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Quick Contact Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleEmailCustomer}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all hover:shadow-md"
          >
            <EnvelopeIcon className="w-4 h-4" />
            <span className="text-sm">Email</span>
          </button>
          {order.shippingAddress.phoneNumber && (
            <button
              onClick={handleCallCustomer}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all hover:shadow-md"
            >
              <PhoneIcon className="w-4 h-4" />
              <span className="text-sm">Call</span>
            </button>
          )}
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-grey-200">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <ShoppingBagIcon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-xs text-grey-600 mb-1">Total Orders</div>
            <div className="text-lg font-bold text-blue-600">1</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <CurrencyDollarIcon className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-xs text-grey-600 mb-1">Total Spent</div>
            <div className="text-lg font-bold text-green-600">
              ${order.totalPrice.toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-t border-grey-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-orange-600" />
            <h4 className="text-sm font-bold text-grey-900">Shipping Address</h4>
          </div>
        </div>
        
        <div className="text-sm text-grey-700 leading-relaxed mb-3">
          {order.shippingAddress.fullName && (
            <div className="font-semibold text-grey-900 mb-1">
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
        </div>

        <button
          onClick={handleViewOnMap}
          className="w-full px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors border border-orange-200"
        >
          View on Map →
        </button>
      </div>
    </motion.div>
  );
};

export default CustomerInfoCard;


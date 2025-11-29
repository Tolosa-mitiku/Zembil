import { Order } from '../api/ordersApi';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface PaymentDetailsSectionProps {
  order: Order;
}

const PaymentDetailsSection = ({ order }: PaymentDetailsSectionProps) => {
  const platformFee = order.totalPrice * 0.05;
  const sellerEarnings = order.totalPrice - platformFee;

  const getPaymentStatusInfo = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          icon: CheckCircleIcon,
          label: 'Payment Successful',
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
        };
      case 'pending':
        return {
          icon: ClockIcon,
          label: 'Payment Pending',
          color: 'orange',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-700',
        };
      case 'failed':
        return {
          icon: XCircleIcon,
          label: 'Payment Failed',
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
        };
      case 'refunded':
        return {
          icon: XCircleIcon,
          label: 'Payment Refunded',
          color: 'purple',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-700',
        };
      default:
        return {
          icon: CreditCardIcon,
          label: 'Unknown',
          color: 'grey',
          bgColor: 'bg-grey-50',
          borderColor: 'border-grey-200',
          textColor: 'text-grey-700',
        };
    }
  };

  const paymentStatus = getPaymentStatusInfo('paid'); // Assuming paid for now

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'stripe':
        return '💳';
      case 'paypal':
        return '🅿️';
      case 'cash':
        return '💵';
      default:
        return '💰';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
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
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-grey-200 bg-gradient-to-r from-emerald-50/50 to-green-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
            <CreditCardIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-grey-900">Payment Details</h2>
            <p className="text-sm text-grey-600">Transaction and earnings information</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Payment Status Banner */}
        <div className={clsx('p-6 rounded-xl border-2', paymentStatus.bgColor, paymentStatus.borderColor)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <paymentStatus.icon className={clsx('w-8 h-8', paymentStatus.textColor)} />
              <div>
                <div className={clsx('text-lg font-bold', paymentStatus.textColor)}>
                  {paymentStatus.label}
                </div>
                <div className="text-sm text-grey-600">
                  Payment processed on {formatDate(order.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method & Transaction Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Payment Method */}
          <div className="p-6 bg-grey-50 rounded-xl border border-grey-200">
            <div className="text-sm text-grey-600 mb-2">Payment Method</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getPaymentMethodIcon('stripe')}</span>
              <span className="text-xl font-bold text-grey-900 capitalize">
                Stripe
              </span>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="p-6 bg-grey-50 rounded-xl border border-grey-200">
            <div className="text-sm text-grey-600 mb-2">Transaction ID</div>
            <div className="font-mono text-sm font-semibold text-grey-900">
              {order._id.slice(-12)}
            </div>
          </div>
        </div>

        {/* Amount Breakdown */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-bold text-grey-900 mb-4">Payment Breakdown</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-grey-700">
              <span>Items Total</span>
              <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-grey-700">
              <span>Shipping</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>

            <div className="flex items-center justify-between text-grey-700">
              <span>Tax</span>
              <span className="font-semibold">$0.00</span>
            </div>

            <div className="border-t-2 border-blue-300 pt-3 mb-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-grey-900">Total Charged</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-white/70 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-600">Platform Fee (5%)</span>
                <span className="text-red-600 font-semibold">-${platformFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-grey-200 pt-2">
                <span className="font-bold text-grey-900">Your Earnings</span>
                <span className="text-xl font-bold text-green-600">
                  ${sellerEarnings.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Timeline */}
        <div className="p-6 bg-grey-50 rounded-xl border border-grey-200">
          <h3 className="text-sm font-semibold text-grey-700 mb-4">Payment Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-grey-900">Payment Initiated</div>
                <div className="text-xs text-grey-500">{formatDate(order.createdAt)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-grey-900">Payment Processed</div>
                <div className="text-xs text-grey-500">{formatDate(order.createdAt)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-grey-900">Payment Completed</div>
                <div className="text-xs text-grey-500">{formatDate(order.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Info */}
        <div className="p-6 bg-gradient-to-r from-gold/10 to-amber-50 rounded-xl border-2 border-gold/30">
          <div className="flex items-center gap-3 mb-3">
            <BanknotesIcon className="w-6 h-6 text-gold" />
            <h3 className="font-bold text-grey-900">Payout Information</h3>
          </div>
          <p className="text-sm text-grey-700">
            Your earnings of <span className="font-bold text-gold">${sellerEarnings.toFixed(2)}</span> will be transferred to your registered bank account within 3-5 business days after the order is marked as delivered.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentDetailsSection;


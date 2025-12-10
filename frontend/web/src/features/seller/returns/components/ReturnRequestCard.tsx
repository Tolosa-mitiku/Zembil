import { ReturnRequest } from '../api/returnsApi';
import { formatCurrency, formatDate } from '@/core/utils/format';
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import Button from '@/shared/components/Button';
import clsx from 'clsx';

interface ReturnRequestCardProps {
  returnRequest: ReturnRequest;
  onViewDetails: (returnRequest: ReturnRequest) => void;
  onApprove?: (returnRequest: ReturnRequest) => void;
  onReject?: (returnRequest: ReturnRequest) => void;
  className?: string;
}

const statusConfig = {
  requested: {
    label: 'Pending Review',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: ClockIcon,
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: ClockIcon,
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  completed: {
    label: 'Refunded',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircleIcon,
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: XCircleIcon,
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
  },
};

const reasonIcons = {
  'Defective product': ExclamationTriangleIcon,
  'Wrong item received': ExclamationTriangleIcon,
  'Damaged during shipping': ExclamationTriangleIcon,
  'Changed mind': ClockIcon,
  'Size doesn\'t fit': ClockIcon,
};

const ReturnRequestCard = ({
  returnRequest,
  onViewDetails,
  onApprove,
  onReject,
  className,
}: ReturnRequestCardProps) => {
  const config = statusConfig[returnRequest.status];
  const StatusIcon = config.icon;
  const ReasonIcon = reasonIcons[returnRequest.reason as keyof typeof reasonIcons] || ExclamationTriangleIcon;
  
  const canApprove = returnRequest.status === 'requested';
  const canReject = returnRequest.status === 'requested';

  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-grey-200 overflow-hidden transition-all duration-300',
        'hover:shadow-xl hover:scale-[1.02] hover:border-gold-pale',
        'animate-fade-in',
        className
      )}
    >
      {/* Card Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-grey-50 to-white border-b border-grey-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={clsx(
              'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
              config.bgColor
            )}>
              <ReasonIcon className={clsx('w-6 h-6', config.textColor)} />
            </div>
            <div>
              <div className="text-body-large font-bold text-grey-900 transition-colors">
                #{returnRequest.orderNumber}
              </div>
              <p className="text-label-small text-grey-600">
                {formatDate(returnRequest.requestedAt)} at {new Date(returnRequest.requestedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <span className={clsx(
            'inline-flex items-center px-3 py-1.5 rounded-full text-label-small font-semibold border transition-all duration-200',
            config.color
          )}>
            <StatusIcon className="w-4 h-4 mr-1.5" />
            {config.label}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Product Info */}
          <div className="lg:col-span-5">
            <h4 className="text-label-small text-grey-600 font-semibold mb-3 uppercase tracking-wide">
              Return Items ({returnRequest.items.length})
            </h4>
            <div className="space-y-3">
              {returnRequest.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  {item.image ? (
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover border border-grey-200 transition-transform duration-300 group-hover:scale-110"
                      />
                      {returnRequest.images && returnRequest.images.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center border-2 border-white">
                          <PhotoIcon className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-grey-100 flex items-center justify-center">
                      <PhotoIcon className="w-8 h-8 text-grey-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-body-medium text-grey-900 font-medium truncate group-hover:text-gold transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-label-small text-grey-600">Qty: {item.quantity}</span>
                      <span className="text-label-small text-grey-400">•</span>
                      <span className="text-label-small text-grey-900 font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Return Details */}
          <div className="lg:col-span-4">
            <h4 className="text-label-small text-grey-600 font-semibold mb-3 uppercase tracking-wide">
              Return Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-label-small text-grey-600">Reason</p>
                  <p className="text-body-medium text-grey-900 font-semibold">
                    {returnRequest.reason}
                  </p>
                </div>
              </div>
              
              {returnRequest.description && (
                <div className="mt-2 p-3 bg-grey-50 rounded-lg border border-grey-200">
                  <p className="text-body-small text-grey-700 leading-relaxed">
                    {returnRequest.description}
                  </p>
                </div>
              )}

              {/* Customer Info */}
              <div className="pt-3 border-t border-grey-200">
                <p className="text-label-small text-grey-600 mb-1">Customer</p>
                <p className="text-body-medium text-grey-900 font-medium">
                  {returnRequest.buyer.name}
                </p>
                <p className="text-label-small text-grey-600">
                  {returnRequest.buyer.email}
                </p>
                {returnRequest.buyer.phone && (
                  <p className="text-label-small text-grey-600">
                    {returnRequest.buyer.phone}
                  </p>
                )}
              </div>

              {returnRequest.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-label-small text-red-600 font-semibold mb-1">Rejection Reason</p>
                  <p className="text-body-small text-red-700">
                    {returnRequest.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Refund Summary */}
          <div className="lg:col-span-3">
            <h4 className="text-label-small text-grey-600 font-semibold mb-3 uppercase tracking-wide">
              Refund Amount
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-br from-gold-pale to-white rounded-xl border border-gold/30">
                <p className="text-label-small text-grey-600 mb-1">Total Refund</p>
                <p className="text-headline-large text-gold font-bold">
                  {formatCurrency(returnRequest.totalAmount)}
                </p>
              </div>

              {returnRequest.images && returnRequest.images.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <PhotoIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-label-small text-blue-600 font-semibold">
                      {returnRequest.images.length} Photo{returnRequest.images.length > 1 ? 's' : ''} Attached
                    </p>
                  </div>
                </div>
              )}

              {returnRequest.processedAt && (
                <div className="text-center p-3 bg-grey-50 rounded-lg">
                  <p className="text-label-small text-grey-600">Processed</p>
                  <p className="text-body-small text-grey-900 font-medium mt-1">
                    {formatDate(returnRequest.processedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer - Actions */}
      <div className="px-5 py-4 bg-gradient-to-r from-grey-50 to-white border-t border-grey-200">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(returnRequest)}
            leftIcon={<EyeIcon className="w-4 h-4" />}
            className="hover:bg-gold-pale hover:text-gold transition-all duration-200"
          >
            View Full Details
          </Button>

          <div className="flex items-center gap-2">
            {canApprove && onApprove && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onApprove(returnRequest)}
                leftIcon={<CheckCircleIcon className="w-4 h-4" />}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200"
              >
                Approve Return
              </Button>
            )}

            {canReject && onReject && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onReject(returnRequest)}
                leftIcon={<XCircleIcon className="w-4 h-4" />}
                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
              >
                Reject
              </Button>
            )}

            {returnRequest.status === 'processing' && (
              <Button
                variant="primary"
                size="sm"
                className="bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold transition-all duration-200"
              >
                Complete Refund
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestCard;














import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import { ReturnRequest } from '../api/returnsApi';
import { formatCurrency, formatDate } from '@/core/utils/format';
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ReceiptPercentIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface ReturnDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnRequest: ReturnRequest | null;
  onApprove?: (returnRequest: ReturnRequest) => void;
  onReject?: (returnRequest: ReturnRequest) => void;
  onCompleteRefund?: (returnRequest: ReturnRequest) => void;
}

const statusConfig = {
  requested: {
    label: 'Pending Review',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: ClockIcon,
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: ClockIcon,
  },
  completed: {
    label: 'Refunded',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircleIcon,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: XCircleIcon,
  },
};

const ReturnDetailModal = ({
  isOpen,
  onClose,
  returnRequest,
  onApprove,
  onReject,
  onCompleteRefund,
}: ReturnDetailModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  if (!returnRequest) return null;

  const config = statusConfig[returnRequest.status];
  const StatusIcon = config.icon;

  const handleApprove = () => {
    if (onApprove) {
      onApprove(returnRequest);
      toast.success('Return request approved! Processing refund...', {
        icon: '✅',
        style: {
          borderRadius: '12px',
          background: '#10B981',
          color: '#fff',
        },
      });
      onClose();
    }
  };

  const handleReject = () => {
    if (onReject && rejectionReason.trim()) {
      onReject(returnRequest);
      toast.success('Return request rejected', {
        icon: '❌',
        style: {
          borderRadius: '12px',
          background: '#EF4444',
          color: '#fff',
        },
      });
      setShowRejectForm(false);
      setRejectionReason('');
      onClose();
    }
  };

  const handleCompleteRefund = () => {
    if (onCompleteRefund) {
      onCompleteRefund(returnRequest);
      toast.success(`Refund of ${formatCurrency(returnRequest.totalAmount)} completed!`, {
        icon: '💰',
        style: {
          borderRadius: '12px',
          background: '#10B981',
          color: '#fff',
        },
      });
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" showCloseButton={false}>
        <div className="relative">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-grey-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-pale flex items-center justify-center">
                  <ReceiptPercentIcon className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h2 className="text-headline-medium font-bold text-grey-900">
                    Return Request #{returnRequest.orderNumber}
                  </h2>
                  <p className="text-body-small text-grey-600">
                    Requested {formatDate(returnRequest.requestedAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg hover:bg-grey-100 flex items-center justify-center transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-grey-600" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="mt-4 flex items-center gap-3">
              <span className={clsx(
                'inline-flex items-center px-4 py-2 rounded-full text-body-small font-semibold border',
                config.color
              )}>
                <StatusIcon className="w-4 h-4 mr-2" />
                {config.label}
              </span>
              {returnRequest.processedAt && (
                <span className="text-body-small text-grey-600">
                  Processed on {formatDate(returnRequest.processedAt)}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Return Items */}
                <div className="bg-white border border-grey-200 rounded-xl p-5">
                  <h3 className="text-body-large font-semibold text-grey-900 mb-4 flex items-center gap-2">
                    <ReceiptPercentIcon className="w-5 h-5 text-gold" />
                    Return Items
                  </h3>
                  <div className="space-y-4">
                    {returnRequest.items.map((item, index) => (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b border-grey-100 last:border-0 last:pb-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 rounded-lg object-cover border border-grey-200"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="text-body-medium font-semibold text-grey-900 mb-1">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-3 text-body-small text-grey-600">
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span className="font-semibold text-grey-900">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                          <p className="text-label-small text-grey-600 mt-1">
                            Reason: {item.reason}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-body-large font-bold text-gold">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-4 pt-4 border-t border-grey-200">
                    <div className="flex items-center justify-between">
                      <span className="text-body-large font-semibold text-grey-900">
                        Total Refund Amount
                      </span>
                      <span className="text-headline-large font-bold text-gold">
                        {formatCurrency(returnRequest.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Return Reason */}
                <div className="bg-white border border-grey-200 rounded-xl p-5">
                  <h3 className="text-body-large font-semibold text-grey-900 mb-4 flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-gold" />
                    Return Reason
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-label-small text-grey-600 mb-1">Primary Reason</p>
                      <p className="text-body-medium font-semibold text-grey-900">
                        {returnRequest.reason}
                      </p>
                    </div>
                    {returnRequest.description && (
                      <div>
                        <p className="text-label-small text-grey-600 mb-2">Description</p>
                        <div className="p-4 bg-grey-50 rounded-lg border border-grey-200">
                          <p className="text-body-small text-grey-700 leading-relaxed">
                            {returnRequest.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rejection Reason (if rejected) */}
                {returnRequest.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <h3 className="text-body-large font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <XCircleIcon className="w-5 h-5 text-red-600" />
                      Rejection Reason
                    </h3>
                    <p className="text-body-small text-red-700">
                      {returnRequest.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="bg-white border border-grey-200 rounded-xl p-5">
                  <h3 className="text-body-large font-semibold text-grey-900 mb-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-gold" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-pale flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-body-medium font-semibold text-grey-900">
                          {returnRequest.buyer.name}
                        </p>
                        <p className="text-label-small text-grey-600">Customer</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-grey-50 rounded-lg">
                      <EnvelopeIcon className="w-5 h-5 text-grey-600" />
                      <div>
                        <p className="text-label-small text-grey-600">Email</p>
                        <p className="text-body-small text-grey-900">
                          {returnRequest.buyer.email}
                        </p>
                      </div>
                    </div>

                    {returnRequest.buyer.phone && (
                      <div className="flex items-center gap-3 p-3 bg-grey-50 rounded-lg">
                        <PhoneIcon className="w-5 h-5 text-grey-600" />
                        <div>
                          <p className="text-label-small text-grey-600">Phone</p>
                          <p className="text-body-small text-grey-900">
                            {returnRequest.buyer.phone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Attached Images */}
                {returnRequest.images && returnRequest.images.length > 0 && (
                  <div className="bg-white border border-grey-200 rounded-xl p-5">
                    <h3 className="text-body-large font-semibold text-grey-900 mb-4 flex items-center gap-2">
                      <PhotoIcon className="w-5 h-5 text-gold" />
                      Attached Photos ({returnRequest.images.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {returnRequest.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(image)}
                          className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                        >
                          <img
                            src={image}
                            alt={`Return evidence ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                            <MagnifyingGlassIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="bg-white border border-grey-200 rounded-xl p-5">
                  <h3 className="text-body-large font-semibold text-grey-900 mb-4 flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-gold" />
                    Timeline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-pale flex items-center justify-center flex-shrink-0">
                        <ClockIcon className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <p className="text-body-small font-semibold text-grey-900">
                          Return Requested
                        </p>
                        <p className="text-label-small text-grey-600">
                          {formatDate(returnRequest.requestedAt)} at{' '}
                          {new Date(returnRequest.requestedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    {returnRequest.processedAt && (
                      <div className="flex gap-3">
                        <div className={clsx(
                          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                          returnRequest.status === 'rejected' ? 'bg-red-100' : 'bg-green-100'
                        )}>
                          <StatusIcon className={clsx(
                            'w-4 h-4',
                            returnRequest.status === 'rejected' ? 'text-red-600' : 'text-green-600'
                          )} />
                        </div>
                        <div>
                          <p className="text-body-small font-semibold text-grey-900">
                            {returnRequest.status === 'rejected' ? 'Rejected' : 'Processed'}
                          </p>
                          <p className="text-label-small text-grey-600">
                            {formatDate(returnRequest.processedAt)} at{' '}
                            {new Date(returnRequest.processedAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          {!showRejectForm && (
            <div className="sticky bottom-0 bg-white border-t border-grey-200 px-6 py-4">
              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>

                {returnRequest.status === 'requested' && (
                  <>
                    {onReject && (
                      <Button
                        variant="secondary"
                        onClick={() => setShowRejectForm(true)}
                        leftIcon={<XCircleIcon className="w-4 h-4" />}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Reject Return
                      </Button>
                    )}
                    {onApprove && (
                      <Button
                        variant="primary"
                        onClick={handleApprove}
                        leftIcon={<CheckCircleIcon className="w-4 h-4" />}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        Approve & Process Refund
                      </Button>
                    )}
                  </>
                )}

                {returnRequest.status === 'processing' && onCompleteRefund && (
                  <Button
                    variant="primary"
                    onClick={handleCompleteRefund}
                    leftIcon={<CheckCircleIcon className="w-4 h-4" />}
                  >
                    Complete Refund
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Reject Form */}
          {showRejectForm && (
            <div className="sticky bottom-0 bg-white border-t border-grey-200 px-6 py-4">
              <div className="mb-4">
                <label className="block text-body-small font-semibold text-grey-900 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this return request..."
                  className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold resize-none"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Image Lightbox */}
      {selectedImage && (
        <Modal isOpen={true} onClose={() => setSelectedImage(null)} size="xl" showCloseButton={false}>
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
            <img
              src={selectedImage}
              alt="Return evidence"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ReturnDetailModal;


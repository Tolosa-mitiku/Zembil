import { OrderStatus, ORDER_STATUS } from '@/core/constants';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
  ClockIcon,
  CheckCircleIcon,
  BoltIcon,
  TruckIcon,
  MapPinIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/solid';

interface OrderTimelineEnhancedProps {
  currentStatus: OrderStatus;
  className?: string;
}

interface TimelineStep {
  status: OrderStatus;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

const timelineSteps: TimelineStep[] = [
  {
    status: ORDER_STATUS.PENDING,
    label: 'Pending',
    icon: ClockIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
  },
  {
    status: ORDER_STATUS.CONFIRMED,
    label: 'Confirmed',
    icon: CheckCircleIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
  },
  {
    status: ORDER_STATUS.PROCESSING,
    label: 'Processing',
    icon: BoltIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
  },
  {
    status: ORDER_STATUS.SHIPPED,
    label: 'Shipped',
    icon: TruckIcon,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-500',
  },
  {
    status: ORDER_STATUS.OUT_FOR_DELIVERY,
    label: 'Out for Delivery',
    icon: MapPinIcon,
    color: 'text-teal-600',
    bgColor: 'bg-teal-500',
  },
  {
    status: ORDER_STATUS.DELIVERED,
    label: 'Delivered',
    icon: CheckBadgeIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-500',
  },
];

const OrderTimelineEnhanced = ({ currentStatus, className }: OrderTimelineEnhancedProps) => {
  // Skip timeline if order is canceled
  if (currentStatus === ORDER_STATUS.CANCELED) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl px-6 py-4 flex items-center gap-3">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <div>
            <p className="text-body-medium font-bold text-red-900">Order Canceled</p>
            <p className="text-label-small text-red-700">This order has been canceled</p>
          </div>
        </div>
      </div>
    );
  }

  const currentStepIndex = timelineSteps.findIndex(step => step.status === currentStatus);

  return (
    <div className={clsx('w-full', className)}>
      {/* Mobile Timeline - Compact */}
      <div className="sm:hidden">
        <div className="bg-grey-50 rounded-xl p-4 border border-grey-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-small text-grey-600 font-semibold">Current Status:</span>
            <span className="text-label-medium text-grey-900 font-bold">
              {timelineSteps[currentStepIndex]?.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-grey-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStepIndex + 1) / timelineSteps.length) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-gold to-gold-dark"
              />
            </div>
            <span className="text-label-small text-grey-600 font-semibold">
              {currentStepIndex + 1}/{timelineSteps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Timeline - Full */}
      <div className="hidden sm:block">
        <div className="relative">
          {/* Progress Background Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-grey-200 rounded-full" />
          
          {/* Animated Progress Line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: currentStepIndex === timelineSteps.length - 1
                ? '100%'
                : `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%`
            }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-gold via-gold-dark to-gold rounded-full shadow-lg"
          />

          {/* Timeline Steps */}
          <div className="relative flex items-start justify-between">
            {timelineSteps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isUpcoming = index > currentStepIndex;
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.status}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                  className="flex-1 flex flex-col items-center relative"
                >
                  {/* Icon Circle */}
                  <motion.div
                    className={clsx(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 shadow-lg',
                      isCompleted && 'bg-gradient-to-br from-gold to-gold-dark',
                      isCurrent && step.bgColor + ' animate-pulse ring-4 ring-offset-2',
                      isCurrent && step.color.replace('text-', 'ring-'),
                      isUpcoming && 'bg-grey-200'
                    )}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon
                      className={clsx(
                        'w-6 h-6 transition-all',
                        (isCompleted || isCurrent) && 'text-white',
                        isUpcoming && 'text-grey-400'
                      )}
                    />
                    
                    {/* Checkmark overlay for completed */}
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                    className="mt-3 text-center"
                  >
                    <span
                      className={clsx(
                        'text-label-small font-semibold transition-colors block',
                        (isCompleted || isCurrent) && 'text-grey-900',
                        isCurrent && 'text-gold',
                        isUpcoming && 'text-grey-500'
                      )}
                    >
                      {step.label}
                    </span>
                    
                    {/* Status indicator text */}
                    {isCurrent && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-label-small text-gold-dark font-medium mt-1 block"
                      >
                        In progress
                      </motion.span>
                    )}
                    {isCompleted && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.7 }}
                        className="text-label-small text-green-600 font-medium mt-1 block"
                      >
                        ✓ Complete
                      </motion.span>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTimelineEnhanced;














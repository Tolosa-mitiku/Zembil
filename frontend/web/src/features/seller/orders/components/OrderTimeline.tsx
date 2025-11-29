import { OrderStatus, ORDER_STATUS } from '@/core/constants';
import clsx from 'clsx';
import {
  ClockIcon,
  CheckCircleIcon,
  BoltIcon,
  TruckIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/solid';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  className?: string;
}

const timelineSteps = [
  { status: ORDER_STATUS.PENDING, label: 'Pending', icon: ClockIcon },
  { status: ORDER_STATUS.CONFIRMED, label: 'Confirmed', icon: CheckCircleIcon },
  { status: ORDER_STATUS.PROCESSING, label: 'Processing', icon: BoltIcon },
  { status: ORDER_STATUS.SHIPPED, label: 'Shipped', icon: TruckIcon },
  { status: ORDER_STATUS.DELIVERED, label: 'Delivered', icon: CheckBadgeIcon },
];

const OrderTimeline = ({ currentStatus, className }: OrderTimelineProps) => {
  // Skip timeline if order is canceled
  if (currentStatus === ORDER_STATUS.CANCELED) {
    return null;
  }

  const currentStepIndex = timelineSteps.findIndex(step => step.status === currentStatus);

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex items-center justify-between">
        {timelineSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isLast = index === timelineSteps.length - 1;
          const Icon = step.icon;

          return (
            <div key={step.status} className="flex-1 relative">
              <div className="flex flex-col items-center">
                {/* Icon */}
                <div
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative z-10',
                    isCompleted
                      ? 'bg-gold text-white shadow-lg'
                      : 'bg-grey-200 text-grey-500',
                    isCurrent && 'animate-pulse ring-4 ring-gold-pale'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Label */}
                <span
                  className={clsx(
                    'text-label-small mt-2 text-center hidden sm:block transition-colors',
                    isCompleted ? 'text-grey-900 font-medium' : 'text-grey-500'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="absolute top-4 left-1/2 w-full h-0.5 -translate-y-1/2">
                  <div className="h-full bg-grey-200">
                    <div
                      className={clsx(
                        'h-full transition-all duration-500',
                        isCompleted ? 'bg-gold' : 'bg-grey-200',
                        isCompleted && 'w-full',
                        !isCompleted && 'w-0'
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;


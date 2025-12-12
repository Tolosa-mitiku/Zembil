import {
  ClockIcon,
  CheckCircleIcon,
  BoltIcon,
  TruckIcon,
  MapPinIcon,
  CheckBadgeIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import Badge from '@/shared/components/Badge';
import { OrderStatus, ORDER_STATUS } from '@/core/constants';
import clsx from 'clsx';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig = {
  [ORDER_STATUS.PENDING]: {
    label: 'Pending',
    icon: ClockIcon,
    className: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    iconColor: 'text-yellow-600',
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: 'Confirmed',
    icon: CheckCircleIcon,
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
    iconColor: 'text-blue-600',
  },
  [ORDER_STATUS.PROCESSING]: {
    label: 'Processing',
    icon: BoltIcon,
    className: 'bg-purple-50 text-purple-700 border border-purple-200',
    iconColor: 'text-purple-600',
  },
  [ORDER_STATUS.SHIPPED]: {
    label: 'Shipped',
    icon: TruckIcon,
    className: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    iconColor: 'text-cyan-600',
  },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: {
    label: 'Out for Delivery',
    icon: MapPinIcon,
    className: 'bg-teal-50 text-teal-700 border border-teal-200',
    iconColor: 'text-teal-600',
  },
  [ORDER_STATUS.DELIVERED]: {
    label: 'Delivered',
    icon: CheckBadgeIcon,
    className: 'bg-green-50 text-green-700 border border-green-200',
    iconColor: 'text-green-600',
  },
  [ORDER_STATUS.CANCELED]: {
    label: 'Canceled',
    icon: XCircleIcon,
    className: 'bg-red-50 text-red-700 border border-red-200',
    iconColor: 'text-red-600',
  },
};

const OrderStatusBadge = ({ status, size = 'md', showIcon = true }: OrderStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig[ORDER_STATUS.PENDING];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-label-small px-2 py-0.5',
    md: 'text-label-medium px-2.5 py-1',
    lg: 'text-label-large px-3 py-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-medium transition-all',
        config.className,
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon className={clsx(iconSizes[size], config.iconColor)} />}
      <span>{config.label}</span>
    </span>
  );
};

export default OrderStatusBadge;
















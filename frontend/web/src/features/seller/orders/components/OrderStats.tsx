import { Order } from '../api/ordersApi';
import { ORDER_STATUS } from '@/core/constants';
import { formatCurrency } from '@/core/utils/format';
import {
  ShoppingBagIcon,
  ClockIcon,
  TruckIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface OrderStatsProps {
  orders: Order[];
  isLoading?: boolean;
}

interface StatCardProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

const StatCard = ({ icon: Icon, label, value, color, bgColor }: StatCardProps) => {
  return (
    <div className="flex-1 min-w-[140px]">
      <div className="bg-white rounded-xl border border-grey-100 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', bgColor)}>
            <Icon className={clsx('w-5 h-5', color)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-label-small text-grey-600 mb-0.5">{label}</p>
            <p className="text-headline-small font-semibold text-grey-900 truncate">
              {value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderStats = ({ orders, isLoading }: OrderStatsProps) => {
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-1 min-w-[140px]">
            <div className="bg-grey-100 rounded-xl h-20 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const totalOrders = orders.length;
  
  const pendingFulfillment = orders.filter(
    order => 
      order.status === ORDER_STATUS.PENDING || 
      order.status === ORDER_STATUS.CONFIRMED
  ).length;

  const inTransit = orders.filter(
    order => 
      order.status === ORDER_STATUS.PROCESSING || 
      order.status === ORDER_STATUS.SHIPPED || 
      order.status === ORDER_STATUS.OUT_FOR_DELIVERY
  ).length;

  const deliveredThisWeek = orders.filter(order => {
    if (order.status !== ORDER_STATUS.DELIVERED) return false;
    const deliveredDate = new Date(order.updatedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return deliveredDate >= weekAgo;
  }).length;

  const totalRevenue = orders
    .filter(order => order.status !== ORDER_STATUS.CANCELED)
    .reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      <StatCard
        icon={ShoppingBagIcon}
        label="Total Orders"
        value={totalOrders}
        color="text-grey-700"
        bgColor="bg-grey-100"
      />
      
      <StatCard
        icon={ClockIcon}
        label="Pending Fulfillment"
        value={pendingFulfillment}
        color="text-orange-600"
        bgColor="bg-orange-50"
      />
      
      <StatCard
        icon={TruckIcon}
        label="In Transit"
        value={inTransit}
        color="text-blue-600"
        bgColor="bg-blue-50"
      />
      
      <StatCard
        icon={CheckBadgeIcon}
        label="Delivered (7 days)"
        value={deliveredThisWeek}
        color="text-green-600"
        bgColor="bg-green-50"
      />
      
      <StatCard
        icon={CurrencyDollarIcon}
        label="Total Revenue"
        value={formatCurrency(totalRevenue)}
        color="text-gold"
        bgColor="bg-gold-pale"
      />
    </div>
  );
};

export default OrderStats;
















import { AdminOrder } from '../api/ordersApi';
import { ORDER_STATUS } from '@/core/constants';
import { formatCurrency } from '@/core/utils/format';
import {
  ShoppingBagIcon,
  ClockIcon,
  TruckIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import clsx from 'clsx';

interface OrderStatsEnhancedProps {
  orders: AdminOrder[];
  isLoading?: boolean;
  onStatClick?: (filterType: string) => void;
}

interface StatCardProps {
  icon: React.ComponentType<any>;
  label: string;
  value: number;
  displayValue?: string;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  delay: number;
  onClick?: () => void;
  suffix?: string;
  prefix?: string;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  displayValue,
  color,
  bgColor,
  trend,
  delay,
  onClick,
  suffix = '',
  prefix = '',
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex-1 min-w-[180px]"
    >
      <div
        onClick={onClick}
        className={clsx(
          'bg-white rounded-2xl border border-grey-100 p-5 transition-all duration-300 shadow-md',
          'hover:shadow-xl hover:scale-105 hover:border-gold-pale',
          onClick && 'cursor-pointer'
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center', bgColor)}>
            <Icon className={clsx('w-6 h-6', color)} />
          </div>
          
          {trend && (
            <div
              className={clsx(
                'flex items-center gap-1 px-2 py-1 rounded-full text-label-small font-medium',
                trend.direction === 'up'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              )}
            >
              <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-label-small text-grey-600 mb-1 font-medium">{label}</p>
          <div className="text-headline-large font-bold text-grey-900">
            {prefix}
            {displayValue || (
              <CountUp
                end={value}
                duration={1.5}
                separator=","
                suffix={suffix}
                decimals={prefix === '$' ? 2 : 0}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const OrderStatsEnhanced = ({ orders, isLoading, onStatClick }: OrderStatsEnhancedProps) => {
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex-1 min-w-[180px]">
            <div className="bg-grey-100 rounded-2xl h-32 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Calculate metrics
  const totalOrders = orders.length;
  
  const pendingAction = orders.filter(
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

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Count unique sellers
  const uniqueSellers = new Set(orders.map(order => order.seller._id)).size;

  // Calculate trends (mock for now - in real app, compare with previous period)
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.round(Math.abs(change)),
      direction: change >= 0 ? 'up' as const : 'down' as const,
    };
  };

  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
        <StatCard
          icon={ShoppingBagIcon}
          label="Total Orders"
          value={totalOrders}
          color="text-grey-700"
          bgColor="bg-grey-100"
          trend={calculateTrend(totalOrders, totalOrders - 5) || undefined}
          delay={0}
          onClick={() => onStatClick?.('all')}
        />
        
        <StatCard
          icon={ClockIcon}
          label="Pending Action"
          value={pendingAction}
          color="text-orange-600"
          bgColor="bg-orange-50"
          trend={calculateTrend(pendingAction, pendingAction - 2) || undefined}
          delay={0.1}
          onClick={() => onStatClick?.('pending')}
        />
        
        <StatCard
          icon={TruckIcon}
          label="In Transit"
          value={inTransit}
          color="text-blue-600"
          bgColor="bg-blue-50"
          trend={calculateTrend(inTransit, inTransit - 3) || undefined}
          delay={0.2}
          onClick={() => onStatClick?.('transit')}
        />
        
        <StatCard
          icon={CheckBadgeIcon}
          label="Delivered (7 days)"
          value={deliveredThisWeek}
          color="text-green-600"
          bgColor="bg-green-50"
          trend={calculateTrend(deliveredThisWeek, deliveredThisWeek - 4) || undefined}
          delay={0.3}
          onClick={() => onStatClick?.('delivered')}
        />
        
        <StatCard
          icon={CurrencyDollarIcon}
          label="Total Revenue"
          value={totalRevenue}
          displayValue={formatCurrency(totalRevenue)}
          color="text-gold"
          bgColor="bg-gold-pale"
          trend={calculateTrend(totalRevenue, totalRevenue * 0.88) || undefined}
          delay={0.4}
        />
        
        <StatCard
          icon={ChartBarIcon}
          label="Average Order Value"
          value={averageOrderValue}
          displayValue={formatCurrency(averageOrderValue)}
          color="text-purple-600"
          bgColor="bg-purple-50"
          trend={calculateTrend(averageOrderValue, averageOrderValue * 0.95) || undefined}
          delay={0.5}
        />

        <StatCard
          icon={BuildingStorefrontIcon}
          label="Active Sellers"
          value={uniqueSellers}
          color="text-green-600"
          bgColor="bg-green-50"
          trend={calculateTrend(uniqueSellers, uniqueSellers - 2) || undefined}
          delay={0.6}
        />
      </div>
    </div>
  );
};

export default OrderStatsEnhanced;


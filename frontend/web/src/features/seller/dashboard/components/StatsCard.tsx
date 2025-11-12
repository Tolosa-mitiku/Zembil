import { ReactNode } from 'react';
import Card from '@/shared/components/Card';
import clsx from 'clsx';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconBgColor?: string;
}

const StatsCard = ({ title, value, icon, trend, iconBgColor = 'bg-gold-pale' }: StatsCardProps) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-grey-500 mb-2 font-medium">{title}</p>
          <p className="text-3xl text-grey-900 font-bold mb-2">{value}</p>
          {trend && (
            <div className="flex items-center">
              <span
                className={clsx(
                  'text-sm font-semibold flex items-center',
                  trend.isPositive ? 'text-success' : 'text-error'
                )}
              >
                {trend.isPositive ? (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {trend.value}%
              </span>
              <span className="text-xs text-grey-400 ml-2">vs last month</span>
            </div>
          )}
        </div>
        <div className={clsx('p-4 rounded-xl', iconBgColor)}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;


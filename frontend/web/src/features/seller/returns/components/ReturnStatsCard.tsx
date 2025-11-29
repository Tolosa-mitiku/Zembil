import clsx from 'clsx';
import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';

interface ReturnStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & RefAttributes<SVGSVGElement>>;
  iconColor: string;
  iconBgColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  delay?: number;
}

const ReturnStatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBgColor,
  trend,
  delay = 0,
}: ReturnStatsCardProps) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-grey-200 p-6 transition-all duration-300',
        'hover:shadow-lg hover:scale-105 hover:border-gold-pale',
        'animate-fade-in'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-label-small text-grey-600 font-semibold uppercase tracking-wide mb-2">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-headline-large font-bold text-grey-900">
              {value}
            </h3>
            {trend && (
              <span
                className={clsx(
                  'text-label-small font-semibold',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-body-small text-grey-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div
          className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110',
            iconBgColor
          )}
        >
          <Icon className={clsx('w-6 h-6', iconColor)} />
        </div>
      </div>
    </div>
  );
};

export default ReturnStatsCard;


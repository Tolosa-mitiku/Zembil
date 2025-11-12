import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  EyeIcon,
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface ProductStat {
  label: string;
  value: number;
  format?: 'number' | 'currency' | 'percentage';
  icon: React.ElementType;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface ProductStatsProps {
  views: number;
  addedToCart: number;
  favorites: number;
  rating: number;
  conversionRate: number;
  revenue: number;
  className?: string;
}

const ProductStats = ({
  views,
  addedToCart,
  favorites,
  rating,
  conversionRate,
  revenue,
  className,
}: ProductStatsProps) => {
  const stats: ProductStat[] = [
    {
      label: 'Views',
      value: views,
      icon: EyeIcon,
      color: 'blue',
      format: 'number',
    },
    {
      label: 'Added to Cart',
      value: addedToCart,
      icon: ShoppingCartIcon,
      color: 'purple',
      format: 'number',
    },
    {
      label: 'Favorites',
      value: favorites,
      icon: HeartIcon,
      color: 'red',
      format: 'number',
    },
    {
      label: 'Rating',
      value: rating,
      icon: StarIcon,
      color: 'gold',
      format: 'number',
    },
    {
      label: 'Conversion',
      value: conversionRate,
      icon: ChartBarIcon,
      color: 'green',
      format: 'percentage',
    },
    {
      label: 'Revenue',
      value: revenue,
      icon: CurrencyDollarIcon,
      color: 'gold',
      format: 'currency',
    },
  ];

  const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-200' },
    gold: { bg: 'bg-gold/10', icon: 'text-gold', border: 'border-gold/30' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' },
  };

  const formatValue = (value: number, format?: string) => {
    if (format === 'currency') {
      return `$${value.toLocaleString()}`;
    }
    if (format === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const colors = colorClasses[stat.color];
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className={clsx(
                'p-4 rounded-xl border-2 transition-all hover:shadow-lg',
                colors.bg,
                colors.border
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-grey-600 uppercase tracking-wide mb-2">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    {stat.format === 'currency' && (
                      <span className={clsx('text-lg font-bold', colors.icon)}>$</span>
                    )}
                    <CountUp
                      end={stat.value}
                      duration={1.5}
                      decimals={stat.format === 'number' && stat.label === 'Rating' ? 1 : stat.format === 'percentage' ? 1 : 0}
                      className={clsx('text-2xl font-bold', colors.icon)}
                    />
                    {stat.format === 'percentage' && (
                      <span className={clsx('text-lg font-bold', colors.icon)}>%</span>
                    )}
                  </div>
                </div>
                <div className={clsx('p-2 rounded-lg', colors.bg)}>
                  <Icon className={clsx('w-5 h-5', colors.icon)} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductStats;


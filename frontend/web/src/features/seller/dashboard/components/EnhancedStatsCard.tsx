import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import Card from '@/shared/components/Card';
import clsx from 'clsx';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

interface EnhancedStatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  iconBgColor?: string;
  iconColor?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  sparkline?: number[];
  badge?: {
    text: string;
    color: string;
  };
  onClick?: () => void;
  delay?: number;
}

const EnhancedStatsCard = ({
  title,
  value,
  icon,
  trend,
  iconBgColor = 'bg-gold-50',
  iconColor = 'text-gold-600',
  prefix = '',
  suffix = '',
  decimals = 0,
  sparkline,
  badge,
  onClick,
  delay = 0,
}: EnhancedStatsCardProps) => {
  const isClickable = !!onClick;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={isClickable ? { y: -4, scale: 1.02 } : undefined}
      className="h-full"
    >
      <Card
        className={clsx(
          'relative overflow-hidden h-full transition-all duration-300',
          'hover:shadow-xl',
          isClickable && 'cursor-pointer'
        )}
        onClick={onClick}
      >
        {/* Gradient Overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent via-transparent to-white/5 rounded-full -mr-16 -mt-16" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-grey-600 font-medium">{title}</p>
                {badge && (
                  <span
                    className={clsx(
                      'px-2 py-0.5 rounded-full text-xs font-semibold',
                      badge.color
                    )}
                  >
                    {badge.text}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                {prefix && <span className="text-2xl text-grey-700 font-bold">{prefix}</span>}
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: delay + 0.2 }}
                >
                  <p className="text-4xl text-grey-900 font-bold">
                    <CountUp
                      end={value}
                      duration={2}
                      decimals={decimals}
                      separator=","
                      delay={delay}
                    />
                  </p>
                </motion.div>
                {suffix && <span className="text-lg text-grey-600 font-semibold">{suffix}</span>}
              </div>
            </div>
            
            <motion.div
              className={clsx('p-3 rounded-xl shadow-sm', iconBgColor)}
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className={clsx('w-6 h-6', iconColor)}>{icon}</div>
            </motion.div>
          </div>

          {/* Trend Indicator */}
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
              className="flex items-center gap-2"
            >
              <div
                className={clsx(
                  'flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold',
                  trend.isPositive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                )}
              >
                {trend.isPositive ? (
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
              <span className="text-xs text-grey-500">
                {trend.label || 'vs previous period'}
              </span>
            </motion.div>
          )}

          {/* Sparkline */}
          {sparkline && sparkline.length > 0 && (
            <div className="mt-4 h-12">
              <svg
                className="w-full h-full"
                viewBox={`0 0 ${sparkline.length * 10} 50`}
                preserveAspectRatio="none"
              >
                <motion.polyline
                  fill="none"
                  stroke={trend?.isPositive ? '#10B981' : '#EF4444'}
                  strokeWidth="2"
                  points={sparkline
                    .map((val, idx) => {
                      const max = Math.max(...sparkline);
                      const min = Math.min(...sparkline);
                      const range = max - min || 1;
                      const normalized = ((val - min) / range) * 40 + 5;
                      return `${idx * 10},${50 - normalized}`;
                    })
                    .join(' ')}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: delay + 0.5 }}
                />
              </svg>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default EnhancedStatsCard;


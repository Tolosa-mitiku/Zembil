import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  CubeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface StatsData {
  total: number;
  active: number;
  lowStock: number;
  outOfStock: number;
}

interface StatsBannerProps {
  stats: StatsData;
  onFilterClick?: (filter: 'all' | 'active' | 'lowStock' | 'outOfStock') => void;
  isLoading?: boolean;
}

const StatsBanner = ({ stats, onFilterClick, isLoading }: StatsBannerProps) => {
  const statCards = [
    {
      id: 'all',
      label: 'Total Products',
      value: stats.total,
      icon: CubeIcon,
      gradient: 'from-amber-400 via-gold to-yellow-500',
      bgGradient: 'from-amber-50 via-gold-pale to-yellow-50',
      glowColor: 'shadow-gold/20',
      iconBg: 'bg-gradient-to-br from-gold to-amber-500',
      description: 'All inventory items',
      accentColor: 'text-gold',
    },
    {
      id: 'active',
      label: 'Active Products',
      value: stats.active,
      percentage: stats.total > 0 ? (stats.active / stats.total) * 100 : 0,
      icon: CheckCircleIcon,
      gradient: 'from-emerald-400 via-green-500 to-teal-500',
      bgGradient: 'from-emerald-50 via-green-50 to-teal-50',
      glowColor: 'shadow-green-500/20',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
      description: 'Live on store',
      accentColor: 'text-green-600',
      trend: 'up',
    },
    {
      id: 'lowStock',
      label: 'Low Stock',
      value: stats.lowStock,
      percentage: stats.total > 0 ? (stats.lowStock / stats.total) * 100 : 0,
      icon: ExclamationTriangleIcon,
      gradient: 'from-amber-400 via-orange-500 to-yellow-500',
      bgGradient: 'from-amber-50 via-orange-50 to-yellow-50',
      glowColor: 'shadow-orange-500/20',
      iconBg: 'bg-gradient-to-br from-orange-500 to-amber-600',
      description: 'Need restocking',
      accentColor: 'text-orange-600',
      trend: 'warning',
    },
    {
      id: 'outOfStock',
      label: 'Out of Stock',
      value: stats.outOfStock,
      percentage: stats.total > 0 ? (stats.outOfStock / stats.total) * 100 : 0,
      icon: XCircleIcon,
      gradient: 'from-red-400 via-rose-500 to-pink-500',
      bgGradient: 'from-red-50 via-rose-50 to-pink-50',
      glowColor: 'shadow-red-500/20',
      iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
      description: 'Unavailable',
      accentColor: 'text-red-600',
      trend: 'down',
    },
  ];

  return (
    <div className="relative">
      {/* Premium Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5 rounded-3xl blur-3xl" />

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
            onClick={() => onFilterClick?.(stat.id as any)}
            className={clsx(
              'relative overflow-hidden rounded-2xl transition-all duration-300',
              'bg-white border-2 border-grey-200',
              onFilterClick && 'cursor-pointer',
              'hover:border-transparent hover:shadow-2xl',
              stat.glowColor
            )}
          >
            {/* Gradient Border Effect on Hover */}
            <motion.div
              className={clsx(
                'absolute inset-0 opacity-0 bg-gradient-to-br rounded-2xl',
                stat.gradient
              )}
              whileHover={{ opacity: 0.1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Animated Background Pattern */}
            <div className={clsx(
              'absolute inset-0 bg-gradient-to-br opacity-5',
              stat.bgGradient
            )}>
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                backgroundSize: '32px 32px',
                opacity: 0.1,
              }} />
            </div>

            {/* Giant Background Icon */}
            <div className="absolute -right-6 -top-6 opacity-5">
              <stat.icon className="w-36 h-36 transform rotate-12" />
            </div>

            {/* Content */}
            <div className="relative p-6">
              {/* Top Section: Icon & Label */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={clsx(
                        'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
                        stat.iconBg
                      )}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    {stat.id === 'all' && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0] 
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3 
                        }}
                      >
                        <SparklesIcon className="w-5 h-5 text-gold" />
                      </motion.div>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-grey-600 uppercase tracking-wide">
                    {stat.label}
                  </h3>
                </div>

                {/* Trend Indicator */}
                {stat.trend && stat.trend !== 'warning' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={clsx(
                      'px-2 py-1 rounded-full flex items-center gap-1',
                      stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                    )}
                  >
                    {stat.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-3 h-3 text-red-600" />
                    )}
                  </motion.div>
                )}
              </div>

              {/* Main Number */}
              <div className="mb-3">
                {isLoading ? (
                  <div className="h-12 w-24 bg-grey-200 rounded-lg animate-pulse" />
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      delay: 0.3 + index * 0.1,
                    }}
                  >
                    <CountUp
                      end={stat.value}
                      duration={2}
                      separator=","
                      preserveValue
                      className={clsx(
                        'text-5xl font-black tracking-tight',
                        stat.accentColor
                      )}
                    />
                  </motion.div>
                )}
              </div>

              {/* Bottom Section: Percentage & Description */}
              <div className="space-y-2">
                {!isLoading && stat.percentage !== undefined && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '100%' }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  >
                    {/* Progress Bar */}
                    <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.percentage}%` }}
                        transition={{ delay: 1 + index * 0.1, duration: 1, ease: 'easeOut' }}
                        className={clsx(
                          'h-full rounded-full bg-gradient-to-r',
                          stat.gradient
                        )}
                      />
                    </div>
                    
                    {/* Percentage Text */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-medium text-grey-500">
                        {stat.description}
                      </span>
                      <span className={clsx('text-sm font-bold', stat.accentColor)}>
                        {stat.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </motion.div>
                )}

                {!isLoading && stat.percentage === undefined && (
                  <p className="text-xs text-grey-500 font-medium">
                    {stat.description}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Accent Line */}
            <motion.div
              className={clsx(
                'absolute bottom-0 left-0 h-1 bg-gradient-to-r',
                stat.gradient
              )}
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />

            {/* Shimmer Effect on Hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
              whileHover={{
                opacity: [0, 0.2, 0],
                x: ['-100%', '100%'],
              }}
              transition={{ duration: 1 }}
              style={{ pointerEvents: 'none' }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsBanner;

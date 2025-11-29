import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CustomerStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: 'blue' | 'green' | 'purple' | 'gold' | 'red' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  delay?: number;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-200',
    hover: 'hover:border-blue-300',
    gradient: 'from-blue-500 to-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    text: 'text-green-600',
    border: 'border-green-200',
    hover: 'hover:border-green-300',
    gradient: 'from-green-500 to-green-600',
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    text: 'text-purple-600',
    border: 'border-purple-200',
    hover: 'hover:border-purple-300',
    gradient: 'from-purple-500 to-purple-600',
  },
  gold: {
    bg: 'bg-gold-pale',
    iconBg: 'bg-gold-pale',
    iconColor: 'text-gold-dark',
    text: 'text-gold-dark',
    border: 'border-gold-accent',
    hover: 'hover:border-gold',
    gradient: 'from-gold to-gold-dark',
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    text: 'text-red-600',
    border: 'border-red-200',
    hover: 'hover:border-red-300',
    gradient: 'from-red-500 to-red-600',
  },
  orange: {
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    text: 'text-orange-600',
    border: 'border-orange-200',
    hover: 'hover:border-orange-300',
    gradient: 'from-orange-500 to-orange-600',
  },
};

const CustomerStatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  onClick,
  delay = 0,
}: CustomerStatsCardProps) => {
  const colors = colorVariants[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className={clsx(
        'bg-white rounded-xl border-2 p-6 transition-all duration-300',
        colors.border,
        colors.hover,
        'shadow-sm hover:shadow-xl',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Icon and Trend */}
      <div className="flex items-start justify-between mb-4">
        <div className={clsx('w-14 h-14 rounded-xl flex items-center justify-center', colors.iconBg)}>
          <Icon className={clsx('w-7 h-7', colors.iconColor)} />
        </div>
        
        {trend && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
            className={clsx(
              'flex items-center gap-1 px-2.5 py-1 rounded-full text-label-small font-medium',
              trend.isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            )}
          >
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </motion.div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-label-medium text-grey-600 font-medium mb-2">
        {title}
      </h3>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-1">
        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.3, type: 'spring', stiffness: 100 }}
          className={clsx('text-4xl font-bold', colors.text)}
        >
          {value}
        </motion.p>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-label-small text-grey-500 mt-2">
          {subtitle}
        </p>
      )}

      {/* Decorative gradient bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.4, duration: 0.6 }}
        className={clsx(
          'h-1 rounded-full mt-4 bg-gradient-to-r',
          colors.gradient
        )}
        style={{ transformOrigin: 'left' }}
      />
    </motion.div>
  );
};

export default CustomerStatsCard;


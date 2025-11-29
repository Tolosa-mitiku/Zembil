import { ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge = ({ children, variant = 'default', size = 'md', className }: BadgeProps) => {
  const variantStyles = {
    default: 'bg-grey-100 text-grey-800',
    success: 'badge-success',
    error: 'badge-error',
    warning: 'badge-warning',
    info: 'badge-info',
    gold: 'badge-gold',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-label-small',
    md: 'px-2.5 py-0.5 text-label-medium',
    lg: 'px-3 py-1 text-label-large',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;


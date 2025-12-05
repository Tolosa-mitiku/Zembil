import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Button Component - Reusable button with variants
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost)
 * - Multiple sizes
 * - Loading state
 * - Disabled state
 * - Icon support
 * - Smooth animations
 */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-gold text-white hover:bg-gold-dark border-transparent',
    secondary: 'bg-grey-100 text-grey-900 hover:bg-grey-200 border-transparent',
    outline: 'bg-transparent text-gold border-gold hover:bg-gold/10',
    ghost: 'bg-transparent text-grey-900 hover:bg-grey-100 border-transparent',
    danger: 'bg-error text-white hover:bg-error/90 border-transparent',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg',
  };

  // Icon sizes
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
      className={`
        relative inline-flex items-center justify-center gap-2
        font-medium rounded-lg border-2
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-gold/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {/* Loading Spinner */}
      {loading && (
        <svg
          className={`animate-spin ${iconSizes[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Left Icon */}
      {!loading && leftIcon && (
        <span className={iconSizes[size]}>{leftIcon}</span>
      )}

      {/* Button Text */}
      <span>{children}</span>

      {/* Right Icon */}
      {!loading && rightIcon && (
        <span className={iconSizes[size]}>{rightIcon}</span>
      )}
    </motion.button>
  );
};

export default Button;


import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  className,
  padding = 'md',
  hover = false,
}: CardProps) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={clsx(
      'bg-white rounded-2xl shadow-sm border border-grey-100',
      hover && 'hover:shadow-md transition-shadow duration-200',
      className
    )}>
      {(title || headerAction) && (
        <div className={clsx('flex items-center justify-between border-b border-grey-100 pb-5', paddingStyles[padding])}>
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-grey-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-grey-500 mt-1">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={clsx(!title && !headerAction && paddingStyles[padding], title && 'pt-5' + ' ' + paddingStyles[padding])}>
        {children}
      </div>
    </div>
  );
};

export default Card;


import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

const RatingStars = ({
  rating,
  size = 'md',
  showValue = false,
  animated = false,
  className,
}: RatingStarsProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const StarComponent = animated ? motion.div : 'div';

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star, index) => {
        const filled = star <= Math.floor(rating);
        const partial = star === Math.ceil(rating) && rating % 1 !== 0;

        return (
          <StarComponent
            key={star}
            {...(animated && {
              initial: { scale: 0, rotate: -180 },
              animate: { scale: 1, rotate: 0 },
              transition: { delay: index * 0.1, type: 'spring', stiffness: 200 },
            })}
          >
            {filled ? (
              <StarIcon className={clsx(sizeClasses[size], 'text-gold drop-shadow-sm')} />
            ) : partial ? (
              <div className="relative">
                <StarOutlineIcon className={clsx(sizeClasses[size], 'text-gold')} />
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${(rating % 1) * 100}%` }}
                >
                  <StarIcon className={clsx(sizeClasses[size], 'text-gold')} />
                </div>
              </div>
            ) : (
              <StarIcon className={clsx(sizeClasses[size], 'text-grey-300')} />
            )}
          </StarComponent>
        );
      })}
      {showValue && (
        <span className={clsx('font-semibold text-grey-700 ml-1', textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
















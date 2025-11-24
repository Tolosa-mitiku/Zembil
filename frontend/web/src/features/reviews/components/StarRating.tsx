import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showNumber?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showNumber = false,
  className = '',
}) => {
  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const filled = index < Math.floor(rating);
        const partial = index === Math.floor(rating) && rating % 1 !== 0;

        return (
          <motion.button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            disabled={!interactive}
            whileHover={interactive ? { scale: 1.1 } : {}}
            whileTap={interactive ? { scale: 0.95 } : {}}
            className={clsx(
              'relative transition-all duration-200',
              interactive && 'cursor-pointer hover:drop-shadow-md',
              !interactive && 'cursor-default'
            )}
          >
            {filled ? (
              <StarIcon className={clsx(sizeClasses[size], 'text-yellow-400')} />
            ) : partial ? (
              <div className="relative">
                <StarIconOutline className={clsx(sizeClasses[size], 'text-yellow-400')} />
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${(rating % 1) * 100}%` }}
                >
                  <StarIcon className={clsx(sizeClasses[size], 'text-yellow-400')} />
                </div>
              </div>
            ) : (
              <StarIconOutline className={clsx(sizeClasses[size], 'text-grey-300')} />
            )}
          </motion.button>
        );
      })}
      
      {showNumber && (
        <span className="ml-2 text-sm font-semibold text-grey-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};






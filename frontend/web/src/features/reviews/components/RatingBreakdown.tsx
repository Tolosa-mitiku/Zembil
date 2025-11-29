import { RatingDistribution } from '../types/review.types';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface RatingBreakdownProps {
  ratingDistribution: RatingDistribution[];
  totalReviews: number;
  onFilterByRating?: (rating: number | null) => void;
  selectedRating?: number | null;
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  ratingDistribution,
  totalReviews,
  onFilterByRating,
  selectedRating,
}) => {
  // Create a map for easy lookup
  const distributionMap = new Map(
    ratingDistribution.map((item) => [item._id, item.count])
  );

  // Create array for all ratings (5 to 1)
  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="space-y-3">
      {ratings.map((rating) => {
        const count = distributionMap.get(rating) || 0;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        const isSelected = selectedRating === rating;

        return (
          <motion.button
            key={rating}
            onClick={() => onFilterByRating?.(isSelected ? null : rating)}
            disabled={!onFilterByRating}
            whileHover={onFilterByRating ? { scale: 1.02 } : {}}
            whileTap={onFilterByRating ? { scale: 0.98 } : {}}
            className={clsx(
              'w-full flex items-center gap-3 group',
              onFilterByRating && 'cursor-pointer',
              !onFilterByRating && 'cursor-default'
            )}
          >
            {/* Star label */}
            <span
              className={clsx(
                'text-sm font-semibold w-12 text-right transition-colors',
                isSelected ? 'text-gold' : 'text-grey-700 group-hover:text-gold'
              )}
            >
              {rating} ★
            </span>

            {/* Progress bar */}
            <div className="flex-1 relative h-3 bg-grey-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: rating * 0.05 }}
                className={clsx(
                  'absolute inset-y-0 left-0 rounded-full transition-all duration-300',
                  isSelected
                    ? 'bg-gradient-to-r from-gold to-gold-dark'
                    : 'bg-gradient-to-r from-yellow-300 to-yellow-400 group-hover:from-gold group-hover:to-gold-dark'
                )}
              />
            </div>

            {/* Count */}
            <span
              className={clsx(
                'text-sm font-medium w-12 text-left transition-colors',
                isSelected ? 'text-gold' : 'text-grey-600 group-hover:text-gold'
              )}
            >
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};


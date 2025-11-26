import { motion } from 'framer-motion';

/**
 * CategoryChip - Clickable category filter chip
 * Features:
 * - Selected state with gold styling
 * - Hover animation
 * - Press animation
 * - Smooth transitions
 */

interface CategoryChipProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const CategoryChip = ({
  label,
  isSelected = false,
  onClick,
  icon,
}: CategoryChipProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full font-medium text-sm
        flex items-center gap-2 whitespace-nowrap
        transition-all duration-200
        ${
          isSelected
            ? 'bg-gold text-white shadow-medium border-2 border-gold'
            : 'bg-white text-grey-700 border-2 border-grey-200 hover:border-gold/50'
        }
      `}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{label}</span>
    </motion.button>
  );
};

export default CategoryChip;


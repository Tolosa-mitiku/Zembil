import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
  hasActiveFilters?: boolean;
  className?: string;
}

const SearchBar = ({
  value,
  onChange,
  onFilterClick,
  placeholder = 'Search products by name, category, seller, SKU...',
  hasActiveFilters,
  className
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={clsx('relative', className)}>
      <div
        className={clsx(
          'relative flex items-center gap-3 bg-white rounded-lg border-2 transition-all duration-300',
          isFocused
            ? 'border-gold shadow-medium'
            : 'border-grey-200 hover:border-grey-300'
        )}
      >
        {/* Search Icon */}
        <div className="pl-4">
          <MagnifyingGlassIcon
            className={clsx(
              'w-5 h-5 transition-colors duration-200',
              isFocused ? 'text-gold' : 'text-grey-400'
            )}
          />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 py-3 pr-2 text-body-medium text-grey-900 placeholder:text-grey-400 
                   bg-transparent border-none outline-none"
        />

        {/* Clear Button */}
        <AnimatePresence>
          {localValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="p-1 text-grey-400 hover:text-grey-600 transition-colors rounded-full 
                       hover:bg-grey-100"
              title="Clear search"
            >
              <XMarkIcon className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Divider */}
        {onFilterClick && (
          <div className="w-px h-6 bg-grey-200" />
        )}

        {/* Filter Button */}
        {onFilterClick && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFilterClick}
            className={clsx(
              'relative flex items-center gap-2 px-4 py-3 rounded-r-lg transition-colors',
              hasActiveFilters
                ? 'bg-gold text-white hover:bg-gold-dark'
                : 'text-grey-600 hover:bg-grey-50'
            )}
            title="Open filters"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span className="text-label-large font-medium hidden sm:inline">
              Filters
            </span>

            {/* Active Filters Indicator */}
            {hasActiveFilters && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border-2 border-white"
              />
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;


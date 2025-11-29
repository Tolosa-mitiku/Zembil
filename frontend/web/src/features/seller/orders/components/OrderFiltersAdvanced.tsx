import { useState } from 'react';
import { ORDER_STATUS, OrderStatus } from '@/core/constants';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import OrderStatusBadge from './OrderStatusBadge';

interface FilterOptions {
  searchQuery: string;
  statusFilters: OrderStatus[];
  dateRange: 'today' | 'week' | 'month' | '3months' | 'custom' | null;
  customDateRange?: { startDate: string; endDate: string };
  sortBy: 'recent' | 'oldest' | 'highest' | 'lowest' | 'status' | 'customer';
}

interface OrderFiltersAdvancedProps {
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  resultsCount?: number;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: ORDER_STATUS.PENDING, label: 'Pending' },
  { value: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
  { value: ORDER_STATUS.PROCESSING, label: 'Processing' },
  { value: ORDER_STATUS.SHIPPED, label: 'Shipped' },
  { value: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
  { value: ORDER_STATUS.DELIVERED, label: 'Delivered' },
  { value: ORDER_STATUS.CANCELED, label: 'Canceled' },
];

const dateRangeOptions = [
  { value: 'today' as const, label: 'Today' },
  { value: 'week' as const, label: 'Last 7 days' },
  { value: 'month' as const, label: 'Last 30 days' },
  { value: '3months' as const, label: 'Last 90 days' },
  { value: 'custom' as const, label: 'Custom range' },
];

const sortOptions = [
  { value: 'recent' as const, label: 'Most Recent' },
  { value: 'oldest' as const, label: 'Oldest First' },
  { value: 'highest' as const, label: 'Highest Amount' },
  { value: 'lowest' as const, label: 'Lowest Amount' },
  { value: 'status' as const, label: 'Status (grouped)' },
  { value: 'customer' as const, label: 'Customer Name (A-Z)' },
];

const OrderFiltersAdvanced = ({
  filters,
  onFiltersChange,
  resultsCount,
}: OrderFiltersAdvancedProps) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.searchQuery);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      onFiltersChange({ searchQuery: value });
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const toggleStatusFilter = (status: OrderStatus) => {
    const newStatuses = filters.statusFilters.includes(status)
      ? filters.statusFilters.filter(s => s !== status)
      : [...filters.statusFilters, status];
    onFiltersChange({ statusFilters: newStatuses });
  };

  const clearAllFilters = () => {
    setSearchValue('');
    onFiltersChange({
      searchQuery: '',
      statusFilters: [],
      dateRange: null,
      customDateRange: undefined,
      sortBy: 'recent',
    });
  };

  const activeFiltersCount =
    filters.statusFilters.length +
    (filters.dateRange ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar & Quick Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Enhanced Search */}
        <div className="flex-1 min-w-[280px] relative">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by order #, customer, email, or product..."
              className={clsx(
                'w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all',
                'text-body-medium text-grey-900 placeholder:text-grey-400',
                'focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold-pale',
                searchValue
                  ? 'border-gold bg-gold-pale/10'
                  : 'border-grey-200 bg-white hover:border-grey-300'
              )}
            />
            {searchValue && (
              <button
                onClick={() => {
                  setSearchValue('');
                  onFiltersChange({ searchQuery: '' });
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 hover:text-grey-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Search suggestions could go here */}
          {searchValue && resultsCount !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-lg border border-grey-200 p-3 z-10"
            >
              <p className="text-label-small text-grey-600">
                Found <span className="font-semibold text-grey-900">{resultsCount}</span> result{resultsCount !== 1 ? 's' : ''}
              </p>
            </motion.div>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          className={clsx(
            'flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-medium transition-all',
            'text-body-medium hover:shadow-md',
            isFilterPanelOpen || activeFiltersCount > 0
              ? 'border-gold bg-gold-pale text-gold-dark'
              : 'border-grey-200 bg-white text-grey-700 hover:border-grey-300'
          )}
        >
          <FunnelIcon className="w-5 h-5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-gold text-white text-label-small font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDownIcon
            className={clsx(
              'w-4 h-4 transition-transform',
              isFilterPanelOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Sort Dropdown */}
        <select
          value={filters.sortBy}
          onChange={(e) => onFiltersChange({ sortBy: e.target.value as any })}
          className="px-5 py-3 rounded-xl border-2 border-grey-200 bg-white text-body-medium text-grey-700 font-medium hover:border-grey-300 focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold-pale transition-all cursor-pointer"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              Sort: {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Advanced Filter Panel */}
      <AnimatePresence>
        {isFilterPanelOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-grey-200 p-6 space-y-6 shadow-lg">
              {/* Status Filters */}
              <div>
                <h4 className="text-body-large font-semibold text-grey-900 mb-3 flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 text-gold" />
                  Order Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status.value}
                      onClick={() => toggleStatusFilter(status.value)}
                      className={clsx(
                        'transition-all duration-200 hover:scale-105',
                        filters.statusFilters.includes(status.value)
                          ? 'opacity-100 shadow-md'
                          : 'opacity-50 hover:opacity-75'
                      )}
                    >
                      <OrderStatusBadge status={status.value} size="md" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <h4 className="text-body-large font-semibold text-grey-900 mb-3">
                  Date Range
                </h4>
                <div className="flex flex-wrap gap-2">
                  {dateRangeOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() =>
                        onFiltersChange({
                          dateRange: filters.dateRange === option.value ? null : option.value,
                        })
                      }
                      className={clsx(
                        'px-4 py-2 rounded-lg border-2 font-medium transition-all text-body-small',
                        filters.dateRange === option.value
                          ? 'border-gold bg-gold-pale text-gold-dark shadow-md'
                          : 'border-grey-200 bg-white text-grey-700 hover:border-grey-300'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Custom Date Range Inputs */}
                {filters.dateRange === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 grid grid-cols-2 gap-3"
                  >
                    <div>
                      <label className="block text-label-small text-grey-600 mb-1 font-medium">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={filters.customDateRange?.startDate || ''}
                        onChange={(e) =>
                          onFiltersChange({
                            customDateRange: {
                              ...filters.customDateRange,
                              startDate: e.target.value,
                            } as any,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 border-grey-200 focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold-pale"
                      />
                    </div>
                    <div>
                      <label className="block text-label-small text-grey-600 mb-1 font-medium">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={filters.customDateRange?.endDate || ''}
                        onChange={(e) =>
                          onFiltersChange({
                            customDateRange: {
                              ...filters.customDateRange,
                              endDate: e.target.value,
                            } as any,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 border-grey-200 focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold-pale"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <span className="text-label-small text-grey-600 font-medium">Active filters:</span>
            
            {filters.searchQuery && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-pale border border-gold text-label-small font-medium text-gold-dark"
              >
                <span>Search: "{filters.searchQuery}"</span>
                <button
                  onClick={() => {
                    setSearchValue('');
                    onFiltersChange({ searchQuery: '' });
                  }}
                  className="hover:bg-gold/20 rounded-full p-0.5 transition-colors"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </motion.div>
            )}

            {filters.statusFilters.map(status => (
              <motion.button
                key={status}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => toggleStatusFilter(status)}
                className="flex items-center gap-1.5"
              >
                <OrderStatusBadge status={status} size="sm" />
                <XMarkIcon className="w-3 h-3" />
              </motion.button>
            ))}

            {filters.dateRange && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-label-small font-medium text-purple-700"
              >
                <span>
                  {dateRangeOptions.find(opt => opt.value === filters.dateRange)?.label}
                </span>
                <button
                  onClick={() => onFiltersChange({ dateRange: null, customDateRange: undefined })}
                  className="hover:bg-purple-100 rounded-full p-0.5 transition-colors"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </motion.div>
            )}

            <button
              onClick={clearAllFilters}
              className="ml-2 text-label-small font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderFiltersAdvanced;


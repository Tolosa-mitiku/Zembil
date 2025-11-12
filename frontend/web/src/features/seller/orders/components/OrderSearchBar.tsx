import { useState, useEffect, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { ORDER_STATUS } from '@/core/constants';
import clsx from 'clsx';

interface OrderSearchBarProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (statuses: string[]) => void;
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onSortChange: (sort: string) => void;
  className?: string;
}

type DateRangePreset = 'all' | 'today' | '7days' | '30days' | '90days';

const OrderSearchBar = ({
  onSearchChange,
  onStatusChange,
  onDateRangeChange,
  onSortChange,
  className,
}: OrderSearchBarProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(searchValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue, onSearchChange]);

  useEffect(() => {
    onStatusChange(selectedStatuses);
  }, [selectedStatuses, onStatusChange]);

  useEffect(() => {
    const range = getDateRange(dateRangePreset);
    onDateRangeChange(range);
  }, [dateRangePreset, onDateRangeChange]);

  useEffect(() => {
    onSortChange(sortBy);
  }, [sortBy, onSortChange]);

  const getDateRange = (preset: DateRangePreset) => {
    const now = new Date();
    const startDate = new Date();

    switch (preset) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        return { startDate: startDate.toISOString(), endDate: now.toISOString() };
      case '7days':
        startDate.setDate(now.getDate() - 7);
        return { startDate: startDate.toISOString(), endDate: now.toISOString() };
      case '30days':
        startDate.setDate(now.getDate() - 30);
        return { startDate: startDate.toISOString(), endDate: now.toISOString() };
      case '90days':
        startDate.setDate(now.getDate() - 90);
        return { startDate: startDate.toISOString(), endDate: now.toISOString() };
      default:
        return {};
    }
  };

  const statusOptions = [
    { value: ORDER_STATUS.PENDING, label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: ORDER_STATUS.CONFIRMED, label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: ORDER_STATUS.PROCESSING, label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: ORDER_STATUS.SHIPPED, label: 'Shipped', color: 'bg-cyan-100 text-cyan-800' },
    { value: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery', color: 'bg-teal-100 text-teal-800' },
    { value: ORDER_STATUS.DELIVERED, label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: ORDER_STATUS.CANCELED, label: 'Canceled', color: 'bg-red-100 text-red-800' },
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Amount' },
    { value: 'lowest', label: 'Lowest Amount' },
  ];

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearchValue('');
    setSelectedStatuses([]);
    setDateRangePreset('all');
    setSortBy('recent');
  };

  const hasActiveFilters = searchValue || selectedStatuses.length > 0 || dateRangePreset !== 'all' || sortBy !== 'recent';

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Search and Primary Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-grey-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by order number, customer name, product..."
              className="w-full pl-10 pr-10 py-2.5 border border-grey-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-400 hover:text-grey-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowDateDropdown(false);
              setShowSortDropdown(false);
            }}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all',
              selectedStatuses.length > 0
                ? 'border-gold bg-gold-pale text-gold'
                : 'border-grey-200 bg-white text-grey-700 hover:bg-grey-50'
            )}
          >
            <FunnelIcon className="w-5 h-5" />
            <span className="text-body-medium">
              Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
            </span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {showStatusDropdown && (
            <div className="absolute top-full mt-2 w-64 bg-white border border-grey-200 rounded-lg shadow-lg z-50 py-2">
              {statusOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-grey-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(option.value)}
                    onChange={() => toggleStatus(option.value)}
                    className="w-4 h-4 text-gold border-grey-300 rounded focus:ring-gold"
                  />
                  <span className={clsx('px-2 py-0.5 rounded-full text-label-small', option.color)}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDateDropdown(!showDateDropdown);
              setShowStatusDropdown(false);
              setShowSortDropdown(false);
            }}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all',
              dateRangePreset !== 'all'
                ? 'border-gold bg-gold-pale text-gold'
                : 'border-grey-200 bg-white text-grey-700 hover:bg-grey-50'
            )}
          >
            <span className="text-body-medium">
              {dateRangeOptions.find(o => o.value === dateRangePreset)?.label}
            </span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {showDateDropdown && (
            <div className="absolute top-full mt-2 w-48 bg-white border border-grey-200 rounded-lg shadow-lg z-50 py-2">
              {dateRangeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setDateRangePreset(option.value as DateRangePreset);
                    setShowDateDropdown(false);
                  }}
                  className={clsx(
                    'w-full text-left px-4 py-2 hover:bg-grey-50 transition-colors',
                    dateRangePreset === option.value && 'bg-gold-pale text-gold font-medium'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSortDropdown(!showSortDropdown);
              setShowStatusDropdown(false);
              setShowDateDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 border border-grey-200 bg-white text-grey-700 rounded-lg hover:bg-grey-50 transition-all"
          >
            <span className="text-body-medium">
              {sortOptions.find(o => o.value === sortBy)?.label}
            </span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {showSortDropdown && (
            <div className="absolute top-full mt-2 w-48 bg-white border border-grey-200 rounded-lg shadow-lg z-50 py-2">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortDropdown(false);
                  }}
                  className={clsx(
                    'w-full text-left px-4 py-2 hover:bg-grey-50 transition-colors',
                    sortBy === option.value && 'bg-gold-pale text-gold font-medium'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-label-small text-grey-600">Active filters:</span>
          
          {selectedStatuses.map(status => {
            const option = statusOptions.find(o => o.value === status);
            return (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={clsx(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-small',
                  option?.color
                )}
              >
                <span>{option?.label}</span>
                <XMarkIcon className="w-3 h-3" />
              </button>
            );
          })}

          {dateRangePreset !== 'all' && (
            <button
              onClick={() => setDateRangePreset('all')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-small bg-blue-100 text-blue-800"
            >
              <span>{dateRangeOptions.find(o => o.value === dateRangePreset)?.label}</span>
              <XMarkIcon className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={clearFilters}
            className="text-label-small text-gold hover:text-gold-dark font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Close dropdowns when clicking outside */}
      {(showStatusDropdown || showDateDropdown || showSortDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowStatusDropdown(false);
            setShowDateDropdown(false);
            setShowSortDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default OrderSearchBar;


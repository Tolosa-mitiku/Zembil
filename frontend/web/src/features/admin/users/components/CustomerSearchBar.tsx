import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import clsx from 'clsx';

interface CustomerSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  totalResults: number;
}

const CustomerSearchBar = ({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  totalResults,
}: CustomerSearchBarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hasActiveFilters = roleFilter || statusFilter || searchQuery;

  const clearFilters = () => {
    onSearchChange('');
    onRoleFilterChange('');
    onStatusFilterChange('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border-2 border-grey-200 shadow-sm"
    >
      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-grey-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search customers by name, email..."
              className="w-full pl-12 pr-4 py-3 border-2 border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all text-body-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-grey-200 hover:bg-grey-300 flex items-center justify-center transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-grey-600" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={clsx(
              'flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-body-small transition-all border-2',
              isFilterOpen || hasActiveFilters
                ? 'bg-gold text-white border-gold shadow-lg'
                : 'bg-white text-grey-700 border-grey-300 hover:border-gold hover:text-gold'
            )}
          >
            <FunnelIcon className="w-5 h-5" />
            <span>Filters</span>
            {hasActiveFilters && !isFilterOpen && (
              <span className="w-2 h-2 rounded-full bg-white" />
            )}
          </motion.button>

          {/* Results Count */}
          <div className="hidden md:flex items-center px-4 py-3 bg-grey-100 rounded-lg">
            <span className="text-body-small font-semibold text-grey-700">
              {totalResults} {totalResults === 1 ? 'customer' : 'customers'}
            </span>
          </div>
        </div>

        {/* Mobile Results Count */}
        <div className="md:hidden mt-3 text-label-medium text-grey-600 text-center">
          {totalResults} {totalResults === 1 ? 'customer' : 'customers'} found
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t-2 border-grey-200 overflow-hidden"
          >
            <div className="p-5 bg-grey-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Role Filter */}
                <div>
                  <label className="block text-label-medium font-semibold text-grey-900 mb-2">
                    Role
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => onRoleFilterChange(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all text-body-small bg-white"
                  >
                    <option value="">All Roles</option>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-label-medium font-semibold text-grey-900 mb-2">
                    Account Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all text-body-small bg-white"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className={clsx(
                      'w-full px-4 py-2.5 rounded-lg font-semibold text-body-small transition-all',
                      hasActiveFilters
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-grey-200 text-grey-400 cursor-not-allowed'
                    )}
                  >
                    Clear All Filters
                  </motion.button>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex flex-wrap gap-2"
                >
                  {searchQuery && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-label-small font-medium">
                      <span>Search: {searchQuery}</span>
                      <button
                        onClick={() => onSearchChange('')}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {roleFilter && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-label-small font-medium">
                      <span>Role: {roleFilter}</span>
                      <button
                        onClick={() => onRoleFilterChange('')}
                        className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                      >
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {statusFilter && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-label-small font-medium">
                      <span>Status: {statusFilter}</span>
                      <button
                        onClick={() => onStatusFilterChange('')}
                        className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                      >
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomerSearchBar;


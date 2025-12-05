import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  FunnelIcon,
  CheckIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Button from '@/shared/components/Button';
import clsx from 'clsx';

export interface FilterState {
  status: string[];
  categories: string[];
  stockLevel: string[];
  priceRange: { min: number; max: number };
  isFeatured: boolean | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  categories: string[];
}

const FilterPanel = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  categories
}: FilterPanelProps) => {
  const statusOptions = [
    { 
      value: 'active', 
      label: 'Active', 
      icon: CheckCircleIcon,
      gradient: 'from-emerald-400 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50',
      color: 'text-green-600',
    },
    { 
      value: 'pending', 
      label: 'Pending', 
      icon: ClockIcon,
      gradient: 'from-amber-400 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      color: 'text-orange-600',
    },
    { 
      value: 'inactive', 
      label: 'Inactive', 
      icon: XCircleIcon,
      gradient: 'from-grey-400 to-grey-500',
      bgGradient: 'from-grey-50 to-grey-100',
      color: 'text-grey-600',
    },
    { 
      value: 'rejected', 
      label: 'Rejected', 
      icon: XCircleIcon,
      gradient: 'from-red-400 to-rose-500',
      bgGradient: 'from-red-50 to-rose-50',
      color: 'text-red-600',
    },
  ];

  const stockLevelOptions = [
    { 
      value: 'in-stock', 
      label: 'In Stock', 
      icon: CheckCircleIcon,
      gradient: 'from-emerald-400 to-green-500',
      description: 'Products available',
    },
    { 
      value: 'low-stock', 
      label: 'Low Stock', 
      icon: ExclamationTriangleIcon,
      gradient: 'from-amber-400 to-orange-500',
      description: 'Running low',
    },
    { 
      value: 'out-of-stock', 
      label: 'Out of Stock', 
      icon: XCircleIcon,
      gradient: 'from-red-400 to-rose-500',
      description: 'Unavailable',
    },
  ];

  const sortOptions = [
    { 
      value: 'createdAt-desc', 
      label: 'Newest First', 
      field: 'createdAt', 
      order: 'desc',
      icon: BoltIcon,
    },
    { 
      value: 'createdAt-asc', 
      label: 'Oldest First', 
      field: 'createdAt', 
      order: 'asc',
      icon: ClockIcon,
    },
    { 
      value: 'title-asc', 
      label: 'Name (A-Z)', 
      field: 'title', 
      order: 'asc',
      icon: ArrowUpIcon,
    },
    { 
      value: 'title-desc', 
      label: 'Name (Z-A)', 
      field: 'title', 
      order: 'desc',
      icon: ArrowDownIcon,
    },
    { 
      value: 'price-asc', 
      label: 'Price: Low to High', 
      field: 'price', 
      order: 'asc',
      icon: CurrencyDollarIcon,
    },
    { 
      value: 'price-desc', 
      label: 'Price: High to Low', 
      field: 'price', 
      order: 'desc',
      icon: CurrencyDollarIcon,
    },
    { 
      value: 'stock-asc', 
      label: 'Stock: Low to High', 
      field: 'stock', 
      order: 'asc',
      icon: ShoppingBagIcon,
    },
    { 
      value: 'stock-desc', 
      label: 'Stock: High to Low', 
      field: 'stock', 
      order: 'desc',
      icon: ShoppingBagIcon,
    },
    { 
      value: 'sold-desc', 
      label: 'Best Selling', 
      field: 'sold', 
      order: 'desc',
      icon: FireIcon,
    },
  ];

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    onChange({ ...filters, status: newStatus });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onChange({ ...filters, categories: newCategories });
  };

  const handleStockLevelToggle = (level: string) => {
    const newStockLevel = filters.stockLevel.includes(level)
      ? filters.stockLevel.filter(l => l !== level)
      : [...filters.stockLevel, level];
    onChange({ ...filters, stockLevel: newStockLevel });
  };

  const handleSortChange = (sortOption: string) => {
    const option = sortOptions.find(o => o.value === sortOption);
    if (option) {
      onChange({
        ...filters,
        sortBy: option.field,
        sortOrder: option.order as 'asc' | 'desc'
      });
    }
  };

  const activeFilterCount = 
    filters.status.length + 
    filters.categories.length + 
    filters.stockLevel.length +
    (filters.isFeatured !== null ? 1 : 0);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop with blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/40 backdrop-blur-md" />
        </Transition.Child>

        {/* Panel Container */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-500"
                enterFrom="translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transform transition ease-in duration-300"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="translate-x-full opacity-0"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-gradient-to-b from-white via-white to-grey-50 shadow-2xl">
                    {/* Premium Header with Gradient */}
                    <div className="relative bg-gradient-to-br from-gold via-gold-dark to-amber-600 px-6 py-8 overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                          backgroundSize: '24px 24px',
                        }} />
                      </div>
                      
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 20, repeat: Infinity }}
                        className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                      />

                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ rotate: 180, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg"
                          >
                            <FunnelIcon className="w-7 h-7 text-white" />
                          </motion.div>
                          <div>
                            <Dialog.Title className="text-3xl font-black text-white mb-1">
                              Filters
                            </Dialog.Title>
                            <AnimatePresence mode="wait">
                              {activeFilterCount > 0 ? (
                                <motion.div
                                  key="active"
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="flex items-center gap-2"
                                >
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="px-3 py-1 bg-white/30 backdrop-blur-xl rounded-full flex items-center gap-1.5"
                                  >
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    <span className="text-sm font-bold text-white">
                                      {activeFilterCount} Active
                                    </span>
                                  </motion.div>
                                </motion.div>
                              ) : (
                                <motion.p
                                  key="none"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-sm text-white/80"
                                >
                                  Refine your product search
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={onClose}
                          className="p-2 text-white hover:bg-white/20 rounded-xl transition-all backdrop-blur-xl"
                        >
                          <XMarkIcon className="w-6 h-6" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Filters Content with Custom Scrollbar */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-thin scrollbar-thumb-gold/30 scrollbar-track-transparent">
                      
                      {/* Product Status */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <ChartBarIcon className="w-5 h-5 text-gold" />
                          <h3 className="text-lg font-bold text-grey-900">
                            Product Status
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {statusOptions.map((option, index) => {
                            const isSelected = filters.status.includes(option.value);
                            const Icon = option.icon;
                            
                            return (
                              <motion.button
                                key={option.value}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleStatusToggle(option.value)}
                                className={clsx(
                                  'relative p-4 rounded-xl border-2 transition-all overflow-hidden group',
                                  isSelected
                                    ? 'border-gold shadow-lg shadow-gold/20'
                                    : 'border-grey-200 hover:border-grey-300 hover:shadow-md'
                                )}
                              >
                                {/* Background gradient */}
                                <motion.div
                                  className={clsx(
                                    'absolute inset-0 bg-gradient-to-br opacity-0',
                                    isSelected ? option.bgGradient : 'from-grey-50 to-white'
                                  )}
                                  animate={{ opacity: isSelected ? 1 : 0 }}
                                  transition={{ duration: 0.3 }}
                                />

                                {/* Content */}
                                <div className="relative flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <motion.div
                                      animate={{ rotate: isSelected ? 360 : 0 }}
                                      transition={{ duration: 0.5 }}
                                    >
                                      <Icon className={clsx('w-5 h-5', option.color)} />
                                    </motion.div>
                                    <span className={clsx(
                                      'text-sm font-semibold',
                                      isSelected ? option.color : 'text-grey-700'
                                    )}>
                                      {option.label}
                                    </span>
                                  </div>
                                  
                                  <AnimatePresence>
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, rotate: 180 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        className="w-6 h-6 bg-gradient-to-br from-gold to-amber-500 rounded-full flex items-center justify-center shadow-lg"
                                      >
                                        <CheckIcon className="w-4 h-4 text-white" />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>

                                {/* Shimmer effect on hover */}
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ x: '100%' }}
                                  transition={{ duration: 0.6 }}
                                />
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>

                      {/* Categories */}
                      {categories.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <ShoppingBagIcon className="w-5 h-5 text-gold" />
                            <h3 className="text-lg font-bold text-grey-900">
                              Categories
                            </h3>
                          </div>
                          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent pr-2">
                            {categories.map((category, index) => {
                              const isSelected = filters.categories.includes(category);
                              
                              return (
                                <motion.button
                                  key={category}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2 + index * 0.03 }}
                                  whileHover={{ scale: 1.02, x: 4 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleCategoryToggle(category)}
                                  className={clsx(
                                    'w-full p-3 rounded-xl border-2 transition-all text-left flex items-center justify-between group',
                                    isSelected
                                      ? 'border-gold bg-gradient-to-r from-gold-pale to-white shadow-md'
                                      : 'border-grey-200 hover:border-grey-300 hover:bg-grey-50'
                                  )}
                                >
                                  <span className={clsx(
                                    'text-sm font-medium',
                                    isSelected ? 'text-gold font-semibold' : 'text-grey-700'
                                  )}>
                                    {category}
                                  </span>
                                  
                                  <AnimatePresence>
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="w-5 h-5 bg-gold rounded-full flex items-center justify-center"
                                      >
                                        <CheckIcon className="w-3 h-3 text-white" />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* Stock Levels */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <CubeIcon className="w-5 h-5 text-gold" />
                          <h3 className="text-lg font-bold text-grey-900">
                            Stock Level
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {stockLevelOptions.map((option, index) => {
                            const isSelected = filters.stockLevel.includes(option.value);
                            const Icon = option.icon;
                            
                            return (
                              <motion.button
                                key={option.value}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleStockLevelToggle(option.value)}
                                className={clsx(
                                  'w-full p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden',
                                  isSelected
                                    ? 'border-gold shadow-lg shadow-gold/20'
                                    : 'border-grey-200 hover:border-grey-300 hover:shadow-md'
                                )}
                              >
                                {/* Gradient background */}
                                <motion.div
                                  className={clsx('absolute inset-0 bg-gradient-to-br opacity-0', option.gradient)}
                                  animate={{ opacity: isSelected ? 0.1 : 0 }}
                                />

                                <div className="relative flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <motion.div
                                      animate={{ 
                                        scale: isSelected ? [1, 1.2, 1] : 1,
                                      }}
                                      transition={{ duration: 0.5 }}
                                      className={clsx(
                                        'w-10 h-10 rounded-lg flex items-center justify-center',
                                        isSelected ? 'bg-white shadow-md' : 'bg-grey-100'
                                      )}
                                    >
                                      <Icon className="w-5 h-5 text-gold" />
                                    </motion.div>
                                    <div>
                                      <p className={clsx(
                                        'text-sm font-semibold',
                                        isSelected ? 'text-gold' : 'text-grey-900'
                                      )}>
                                        {option.label}
                                      </p>
                                      <p className="text-xs text-grey-500">
                                        {option.description}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <AnimatePresence>
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, rotate: 180 }}
                                        className="w-6 h-6 bg-gradient-to-br from-gold to-amber-500 rounded-full flex items-center justify-center shadow-lg"
                                      >
                                        <CheckIcon className="w-4 h-4 text-white" />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>

                      {/* Featured Products */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <SparklesIcon className="w-5 h-5 text-gold" />
                          <h3 className="text-lg font-bold text-grey-900">
                            Featured Status
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onChange({ ...filters, isFeatured: true })}
                            className={clsx(
                              'p-4 rounded-xl border-2 transition-all relative overflow-hidden',
                              filters.isFeatured === true
                                ? 'border-gold bg-gradient-to-br from-gold-pale to-white shadow-lg shadow-gold/20'
                                : 'border-grey-200 hover:border-grey-300'
                            )}
                          >
                            <div className="relative text-center">
                              <motion.div
                                animate={{ 
                                  rotate: filters.isFeatured === true ? 360 : 0,
                                  scale: filters.isFeatured === true ? [1, 1.2, 1] : 1
                                }}
                                transition={{ duration: 0.5 }}
                                className="w-8 h-8 mx-auto mb-2 text-gold"
                              >
                                ⭐
                              </motion.div>
                              <p className={clsx(
                                'text-sm font-semibold',
                                filters.isFeatured === true ? 'text-gold' : 'text-grey-700'
                              )}>
                                Featured
                              </p>
                            </div>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onChange({ ...filters, isFeatured: false })}
                            className={clsx(
                              'p-4 rounded-xl border-2 transition-all',
                              filters.isFeatured === false
                                ? 'border-gold bg-gradient-to-br from-gold-pale to-white shadow-lg shadow-gold/20'
                                : 'border-grey-200 hover:border-grey-300'
                            )}
                          >
                            <div className="relative text-center">
                              <div className="w-8 h-8 mx-auto mb-2 text-grey-400 text-2xl">
                                ○
                              </div>
                              <p className={clsx(
                                'text-sm font-semibold',
                                filters.isFeatured === false ? 'text-gold' : 'text-grey-700'
                              )}>
                                Regular
                              </p>
                            </div>
                          </motion.button>
                        </div>
                      </motion.div>

                      {/* Sort By */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <ArrowUpIcon className="w-5 h-5 text-gold" />
                          <h3 className="text-lg font-bold text-grey-900">
                            Sort By
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {sortOptions.map((option, index) => {
                            const isSelected = `${filters.sortBy}-${filters.sortOrder}` === option.value;
                            const Icon = option.icon;
                            
                            return (
                              <motion.button
                                key={option.value}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.03 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSortChange(option.value)}
                                className={clsx(
                                  'w-full p-3 rounded-xl border-2 transition-all text-left flex items-center justify-between',
                                  isSelected
                                    ? 'border-gold bg-gradient-to-r from-gold-pale to-white shadow-md'
                                    : 'border-grey-200 hover:border-grey-300 hover:bg-grey-50'
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon className={clsx('w-4 h-4', isSelected ? 'text-gold' : 'text-grey-500')} />
                                  <span className={clsx(
                                    'text-sm font-medium',
                                    isSelected ? 'text-gold font-semibold' : 'text-grey-700'
                                  )}>
                                    {option.label}
                                  </span>
                                </div>
                                
                                <AnimatePresence>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      exit={{ scale: 0 }}
                                      className="w-5 h-5 bg-gold rounded-full flex items-center justify-center"
                                    >
                                      <CheckIcon className="w-3 h-3 text-white" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </div>

                    {/* Premium Footer with Glassmorphism */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="relative border-t border-grey-200 px-6 py-5 bg-white/80 backdrop-blur-xl"
                    >
                      <div className="flex gap-3">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            variant="secondary"
                            onClick={onReset}
                            className="w-full"
                          >
                            Reset All
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            variant="primary"
                            onClick={onClose}
                            className="w-full"
                          >
                            Apply Filters
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FilterPanel;


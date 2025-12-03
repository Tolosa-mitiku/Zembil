import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  StarIcon,
  CheckIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  SparklesIcon,
  BoltIcon,
  ShoppingBagIcon,
  GiftIcon,
  FireIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  currentFilters?: FilterState;
}

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  minRating: number;
  sortBy: string;
  inStockOnly: boolean;
  conditions: string[];
}

const CATEGORIES = [
  { id: 'fashion', name: 'Fashion', icon: SparklesIcon, count: 342 },
  { id: 'electronics', name: 'Electronics', icon: BoltIcon, count: 189 },
  { id: 'home', name: 'Home & Living', icon: ShoppingBagIcon, count: 256 },
  { id: 'beauty', name: 'Beauty', icon: StarIcon, count: 178 },
  { id: 'sports', name: 'Sports', icon: FireIcon, count: 145 },
  { id: 'gifts', name: 'Gifts', icon: GiftIcon, count: 137 },
];

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Zara', 'H&M'];

const CONDITIONS = [
  { id: 'new', name: 'New', description: 'Brand new, unopened' },
  { id: 'mint', name: 'Like New', description: 'Mint condition, barely used' },
  { id: 'excellent', name: 'Excellent', description: 'Light signs of use' },
  { id: 'good', name: 'Good', description: 'Normal wear and tear' },
  { id: 'fair', name: 'Fair', description: 'Visible wear' },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
];

const FilterPanel = ({ isOpen, onClose, onApplyFilters, currentFilters }: FilterPanelProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>(currentFilters?.priceRange || [0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(currentFilters?.categories || []);
  const [minRating, setMinRating] = useState(currentFilters?.minRating || 0);
  const [sortBy, setSortBy] = useState(currentFilters?.sortBy || 'relevance');
  const [inStockOnly, setInStockOnly] = useState(currentFilters?.inStockOnly || false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>(currentFilters?.conditions || []);
  const [categorySearch, setCategorySearch] = useState('');
  const [conditionSearch, setConditionSearch] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isConditionDropdownOpen, setIsConditionDropdownOpen] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleBrand = (brand: string) => {
    // Kept for backwards compatibility, can be removed later
  };

  const toggleCondition = (conditionId: string) => {
    setSelectedConditions(prev =>
      prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  const removeCondition = (conditionId: string) => {
    setSelectedConditions(prev => prev.filter(id => id !== conditionId));
  };

  const toggleSection = (section: string) => {
    // Not needed anymore, but keeping for potential future use
  };

  const handleApply = () => {
    onApplyFilters({
      priceRange,
      categories: selectedCategories,
      minRating,
      sortBy,
      inStockOnly,
      conditions: selectedConditions,
    });
    onClose();
  };

  const handleReset = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setMinRating(0);
    setSortBy('relevance');
    setInStockOnly(false);
    setSelectedConditions([]);
    setCategorySearch('');
    setConditionSearch('');
    setIsCategoryDropdownOpen(false);
    setIsConditionDropdownOpen(false);
    setHoveredRating(0);
  };

  const activeFiltersCount = 
    selectedCategories.length + 
    selectedConditions.length + 
    (minRating > 0 ? 1 : 0) + 
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0);

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredConditions = CONDITIONS.filter(cond =>
    cond.name.toLowerCase().includes(conditionSearch.toLowerCase())
  );

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(prev => prev.filter(id => id !== categoryId));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Filter Panel - Slide from Right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[360px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-gold/10">
                    <AdjustmentsHorizontalIcon className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Filters</h2>
                    {activeFiltersCount > 0 && (
                      <p className="text-[9px] text-gray-500">{activeFiltersCount} active</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Filters Content - Scrollable */}
            <div 
              className="flex-1 overflow-y-auto px-4 py-3 space-y-4" 
              onClick={(e) => {
                e.stopPropagation();
                // Close dropdowns when clicking elsewhere in filter panel
                setIsCategoryDropdownOpen(false);
                setIsConditionDropdownOpen(false);
              }}
            >
              {/* Sort By */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">Sort By</h3>
                <div className="grid grid-cols-2 gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortBy(option.value);
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        sortBy === option.value
                          ? 'bg-gold text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Categories</h3>
                
                {/* Selected Categories - Chips */}
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedCategories.map((catId) => {
                      const category = CATEGORIES.find(c => c.id === catId);
                      return category ? (
                        <motion.div
                          key={catId}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-gold/10 border border-gold/30 rounded-lg"
                        >
                          <category.icon className="w-3 h-3 text-gold" />
                          <span className="text-xs font-medium text-gray-900">{category.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCategory(catId);
                            }}
                            className="ml-0.5 hover:bg-gold/20 rounded-full p-0.5 transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3 text-gray-600" />
                          </button>
                        </motion.div>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Category Search Field */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => {
                      e.stopPropagation();
                      setCategorySearch(e.target.value);
                    }}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setIsCategoryDropdownOpen(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCategoryDropdownOpen(true);
                    }}
                    placeholder="Search and add categories..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                  
                  {/* Dropdown List */}
                  <AnimatePresence>
                    {isCategoryDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto"
                      >
                        {filteredCategories.map((category) => (
                          <button
                            key={category.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategory(category.id);
                              setCategorySearch('');
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 p-2 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0 ${
                              selectedCategories.includes(category.id) ? 'bg-gold/5' : ''
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg ${selectedCategories.includes(category.id) ? 'bg-gold' : 'bg-gray-200'} flex items-center justify-center transition-colors shrink-0`}>
                              <category.icon className={`w-4 h-4 ${selectedCategories.includes(category.id) ? 'text-white' : 'text-gray-600'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium text-gray-900 block truncate">{category.name}</span>
                              <span className="text-[10px] text-gray-500">{category.count} items</span>
                            </div>
                            {selectedCategories.includes(category.id) && (
                              <CheckIcon className="w-4 h-4 text-gold shrink-0" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Price Range */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Price Range</h3>
                <div className="px-3 py-4 bg-gray-50 rounded-lg">
                  {/* Price Display */}
                  <div className="flex justify-between mb-4">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 mb-1">Min</p>
                      <p className="text-base font-bold text-gray-900">${priceRange[0]}</p>
                    </div>
                    <div className="flex items-center px-3">
                      <div className="h-px w-6 bg-gray-300" />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 mb-1">Max</p>
                      <p className="text-base font-bold text-gray-900">${priceRange[1]}</p>
                    </div>
                  </div>

                  {/* Dual Range Slider */}
                  <div className="relative h-2 bg-gray-200 rounded-full mb-1">
                    <div 
                      className="absolute h-2 bg-gold rounded-full"
                      style={{
                        left: `${(priceRange[0] / 1000) * 100}%`,
                        right: `${100 - (priceRange[1] / 1000) * 100}%`
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const newMin = Number(e.target.value);
                        if (newMin <= priceRange[1]) {
                          setPriceRange([newMin, priceRange[1]]);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer"
                      style={{ zIndex: 5 }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const newMax = Number(e.target.value);
                        if (newMax >= priceRange[0]) {
                          setPriceRange([priceRange[0], newMax]);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer"
                      style={{ zIndex: 4 }}
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Minimum Rating</h3>
                <div className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 rounded-lg">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMinRating(rating);
                      }}
                      onMouseEnter={() => setHoveredRating(rating)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-125"
                    >
                      <StarIconSolid
                        className={`w-7 h-7 transition-all duration-200 ${
                          rating <= (hoveredRating || minRating) 
                            ? 'text-gold drop-shadow-md' 
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {minRating > 0 && (
                  <p className="text-center text-xs text-gray-500 mt-2">{minRating}+ stars</p>
                )}
              </div>

              {/* Conditions */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Condition</h3>
                
                {/* Selected Conditions - Chips */}
                {selectedConditions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedConditions.map((condId) => {
                      const condition = CONDITIONS.find(c => c.id === condId);
                      return condition ? (
                        <motion.div
                          key={condId}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-300 rounded-lg"
                        >
                          <span className="text-xs font-medium text-gray-900">{condition.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCondition(condId);
                            }}
                            className="ml-0.5 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3 text-gray-600" />
                          </button>
                        </motion.div>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Condition Search Field */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={conditionSearch}
                    onChange={(e) => {
                      e.stopPropagation();
                      setConditionSearch(e.target.value);
                    }}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setIsConditionDropdownOpen(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsConditionDropdownOpen(true);
                    }}
                    placeholder="Search conditions..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                  
                  {/* Dropdown List */}
                  <AnimatePresence>
                    {isConditionDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto"
                      >
                        {filteredConditions.map((condition) => (
                          <button
                            key={condition.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCondition(condition.id);
                              setConditionSearch('');
                              setIsConditionDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0 ${
                              selectedConditions.includes(condition.id) ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex-1">
                              <span className="text-xs font-semibold text-gray-900 block">{condition.name}</span>
                              <span className="text-[10px] text-gray-500">{condition.description}</span>
                            </div>
                            {selectedConditions.includes(condition.id) && (
                              <CheckIcon className="w-4 h-4 text-blue-600 shrink-0" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Stock Availability */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Availability</h3>
                <motion.button
                  whileHover={{ x: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setInStockOnly(!inStockOnly);
                  }}
                  className={`w-full flex items-center gap-2 p-2.5 rounded-lg transition-all ${
                    inStockOnly
                      ? 'bg-green-50 border border-green-400'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                    inStockOnly
                      ? 'bg-green-600 border-green-600'
                      : 'bg-white border-gray-300'
                  }`}>
                    {inStockOnly && (
                      <CheckIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-900">In Stock Only</span>
                </motion.button>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50" onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:border-gray-400 hover:bg-gray-100 transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply();
                  }}
                  className="flex-[2] px-3 py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gold transition-all shadow-md"
                >
                  Apply {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;


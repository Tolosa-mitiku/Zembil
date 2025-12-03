import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSearchProductsQuery } from '../api/homeApi';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchBar = ({ 
  className = '', 
  onSearch,
  placeholder = 'Search for products...',
  autoFocus = false 
}: SearchBarProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  const debouncedQuery = useDebouncedValue(query, 300);

  // Search products
  const { data: searchResults, isLoading, isFetching } = useSearchProductsQuery(
    { query: debouncedQuery, limit: 5 },
    { skip: !debouncedQuery || debouncedQuery.length < 2 }
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
      if (onSearch) {
        onSearch(query.trim());
      }
    }
  };

  const handleResultClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setShowResults(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        {/* Search Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all outline-none text-gray-900 placeholder-gray-400 bg-white"
          />
          
          {/* Search Icon */}
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          )}

          {/* Loading Indicator */}
          {(isLoading || isFetching) && query.length >= 2 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && query.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
            >
              {/* Loading State */}
              {(isLoading || isFetching) && (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500">Searching...</p>
                </div>
              )}

              {/* Results */}
              {!isLoading && !isFetching && searchResults && searchResults.data.length > 0 && (
                <>
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs font-bold text-gray-600 uppercase">
                      Found {searchResults.pagination.total} results
                    </p>
                  </div>
                  {searchResults.data.map((product) => (
                    <motion.div
                      key={product._id}
                      whileHover={{ backgroundColor: '#F9FAFB' }}
                      onClick={() => handleResultClick(product._id)}
                      className="flex items-center gap-4 p-4 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <img
                        src={product.primaryImage || product.images[0]?.url || 'https://via.placeholder.com/80'}
                        alt={product.images[0]?.alt || product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {product.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {product.categoryNames?.[0] || product.category || 'General'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-gold">
                            ${(product.pricing.salePrice || product.pricing.basePrice).toFixed(2)}
                          </span>
                          {product.analytics.averageRating > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              ⭐ {product.analytics.averageRating.toFixed(1)}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <button
                    onClick={handleSearch}
                    className="w-full p-3 bg-gray-50 hover:bg-gray-100 text-center text-sm font-bold text-gold transition-colors"
                  >
                    View all {searchResults.pagination.total} results →
                  </button>
                </>
              )}

              {/* No Results */}
              {!isLoading && !isFetching && searchResults && searchResults.data.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No products found for "{query}"</p>
                  <p className="text-xs text-gray-400 mt-2">Try different keywords</p>
                </div>
              )}

              {/* Error State */}
              {!isLoading && !searchResults && query.length >= 2 && (
                <div className="p-8 text-center">
                  <p className="text-red-500">Failed to search products</p>
                  <button
                    onClick={() => setShowResults(false)}
                    className="mt-3 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default SearchBar;


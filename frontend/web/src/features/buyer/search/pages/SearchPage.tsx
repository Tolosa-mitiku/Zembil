import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingCartIcon,
  FireIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShoppingBagIcon,
  XMarkIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import FilterPanel, { FilterState } from '../components/FilterPanel';
import SearchPageSkeleton from '../components/SearchPageSkeleton';
import { useGetProductsQuery, useSearchProductsQuery, Product } from '@/features/buyer/home/api/homeApi';
import { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/features/buyer/wishlist/api/wishlistApi';
import { useGetCartQuery, useAddToCartMutation, useRemoveFromCartMutation } from '@/features/buyer/cart/api/cartApi';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { safeToast as toast } from '@/core/utils/toast-wrapper';
import { useAppSelector } from '@/store/hooks';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get('q') || '';
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Wishlist API hooks
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);
  const [optimisticWishlist, setOptimisticWishlist] = useState<Record<string, boolean>>({});

  // Cart API hooks
  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [cartLoading, setCartLoading] = useState<string | null>(null);
  const [optimisticCart, setOptimisticCart] = useState<Record<string, boolean>>({});

  // Get wishlist product IDs from server
  const serverWishlistIds = useMemo(() => {
    if (!wishlistData?.products) return new Set<string>();
    return new Set(
      wishlistData.products.map((item) =>
        typeof item.productId === 'string' ? item.productId : item.productId._id
      )
    );
  }, [wishlistData]);

  // Get cart product IDs from server
  const serverCartIds = useMemo(() => {
    if (!cartData?.items) return new Set<string>();
    return new Set(
      cartData.items.map((item) =>
        typeof item.productId === 'string' ? item.productId : item.productId._id
      )
    );
  }, [cartData]);

  // Check if product is in wishlist (with optimistic updates)
  const isInWishlist = (productId: string) => {
    if (productId in optimisticWishlist) {
      return optimisticWishlist[productId];
    }
    return serverWishlistIds.has(productId);
  };

  // Check if product is in cart (with optimistic updates)
  const isInCart = (productId: string) => {
    if (productId in optimisticCart) {
      return optimisticCart[productId];
    }
    return serverCartIds.has(productId);
  };

  // Clear optimistic state only when server confirms the expected value
  useEffect(() => {
    setOptimisticWishlist(prev => {
      const next = { ...prev };
      for (const [productId, optimisticValue] of Object.entries(next)) {
        // Only clear if server state matches what we expect
        if (serverWishlistIds.has(productId) === optimisticValue) {
          delete next[productId];
        }
      }
      return Object.keys(next).length === Object.keys(prev).length ? prev : next;
    });
  }, [serverWishlistIds]);

  // Clear optimistic cart state only when server confirms the expected value
  useEffect(() => {
    setOptimisticCart(prev => {
      const next = { ...prev };
      for (const [productId, optimisticValue] of Object.entries(next)) {
        if (serverCartIds.has(productId) === optimisticValue) {
          delete next[productId];
        }
      }
      return Object.keys(next).length === Object.keys(prev).length ? prev : next;
    });
  }, [serverCartIds]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
    condition: [],
    sortBy: 'relevance',
  });
  const lastScrollPosition = useRef(0);

  // Debounce search query for API calls
  const debouncedQuery = useDebouncedValue(searchQuery, 500);

  // Determine which query to use - search or all products
  const useSearch = debouncedQuery && debouncedQuery.length >= 2;

  // Build query params from filters
  const getQueryParams = () => {
    const params: any = {
      page: currentPage,
      limit: 12,
      status: 'active',
    };

    // Add filters
    if (filters.categories.length > 0) {
      params.category = filters.categories[0]; // Use first category for now
    }
    
    if (filters.priceRange) {
      params.minPrice = filters.priceRange[0];
      params.maxPrice = filters.priceRange[1];
    }

    if (filters.inStock) {
      // Will need backend support for this
    }

    // Add sort
    if (filters.sortBy === 'price-low') {
      params.sort = 'price';
      params.order = 'asc';
    } else if (filters.sortBy === 'price-high') {
      params.sort = 'price';
      params.order = 'desc';
    } else if (filters.sortBy === 'rating') {
      params.sort = 'rating';
      params.order = 'desc';
    } else if (filters.sortBy === 'newest') {
      params.sort = 'createdAt';
      params.order = 'desc';
    }

    return params;
  };

  // Search query with filters
  const {
    data: searchResponse,
    isLoading: searchLoading,
    isFetching: searchFetching,
    isError: searchError,
    refetch: refetchSearch,
  } = useSearchProductsQuery(
    { query: debouncedQuery, page: currentPage, limit: 12 },
    { skip: !useSearch }
  );

  // All products query with filters (when not searching)
  const {
    data: allProductsResponse,
    isLoading: allProductsLoading,
    isFetching: allProductsFetching,
    isError: allProductsError,
    refetch: refetchAllProducts,
  } = useGetProductsQuery(
    getQueryParams(),
    { skip: useSearch }
  );

  // Use appropriate response based on search mode
  const activeResponse = useSearch ? searchResponse : allProductsResponse;
  const isLoading = useSearch ? searchLoading : allProductsLoading;
  const isFetching = useSearch ? searchFetching : allProductsFetching;
  const isError = useSearch ? searchError : allProductsError;
  const refetch = useSearch ? refetchSearch : refetchAllProducts;
  const pagination = activeResponse?.pagination;

  // Update allProducts when new data arrives
  useEffect(() => {
    if (activeResponse?.data) {
      lastScrollPosition.current = window.scrollY;
      
      if (currentPage === 1) {
        setAllProducts(activeResponse.data);
        setLoadedImages(new Set());
      } else {
        setAllProducts(prev => [...prev, ...activeResponse.data]);
      }
      
      setIsLoadingMore(false);
      
      requestAnimationFrame(() => {
        window.scrollTo(0, lastScrollPosition.current);
      });
    }
  }, [activeResponse, currentPage]);

  // Reset when search query changes
  useEffect(() => {
    setCurrentPage(1);
    setAllProducts([]);
    setLoadedImages(new Set());
  }, [debouncedQuery]);

  // Reset when filters change
  useEffect(() => {
    setCurrentPage(1);
    setAllProducts([]);
  }, [filters]);

  // Update search query from URL
  useEffect(() => {
    if (queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  // Infinite scroll
  const loadMore = () => {
    if (pagination && currentPage < pagination.totalPages && !isFetching && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: !isLoading && !isError && pagination ? currentPage < pagination.totalPages : false,
    loading: isFetching,
    threshold: 400,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Update URL if search has content
    if (value.trim()) {
      setSearchParams({ q: value.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    setCurrentPage(1);
    setAllProducts([]);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
    setCurrentPage(1);
    setAllProducts([]);
  };

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    const wasInWishlist = isInWishlist(productId);
    const newState = !wasInWishlist;

    // Optimistically update UI immediately
    setOptimisticWishlist(prev => ({ ...prev, [productId]: newState }));
    setWishlistLoading(productId);

    try {
      if (wasInWishlist) {
        await removeFromWishlist(productId).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(productId).unwrap();
        toast.success('Added to wishlist');
      }
      // Keep optimistic state - it will be cleared when server data updates
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticWishlist(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(null);
    }
  };

  const toggleCart = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const wasInCart = isInCart(productId);
    const newState = !wasInCart;

    // Optimistically update UI immediately
    setOptimisticCart(prev => ({ ...prev, [productId]: newState }));
    setCartLoading(productId);

    try {
      if (wasInCart) {
        await removeFromCart(productId).unwrap();
        toast.success('Removed from cart');
      } else {
        await addToCart({ productId, quantity: 1 }).unwrap();
        toast.success('Added to cart');
      }
      // Keep optimistic state - it will be cleared when server data updates
    } catch (error: any) {
      // Revert optimistic update on error
      setOptimisticCart(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      toast.error(error?.data?.message || 'Failed to update cart');
    } finally {
      setCartLoading(null);
    }
  };

  const getConditionLabel = (condition: string) => {
    const labels: { [key: string]: string } = {
      'new': 'Brand New',
      'mint': 'Like New',
      'excellent': 'Excellent',
      'good': 'Good',
      'fair': 'Fair'
    };
    return labels[condition] || 'New';
  };

  const getConditionColor = (condition: string) => {
    const colors: { [key: string]: string } = {
      'new': 'bg-green-100 text-green-700 border-green-300',
      'mint': 'bg-blue-100 text-blue-700 border-blue-300',
      'excellent': 'bg-purple-100 text-purple-700 border-purple-300',
      'good': 'bg-amber-100 text-amber-700 border-amber-300',
      'fair': 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[condition] || 'bg-green-100 text-green-700 border-green-300';
  };

  // Count active filters
  const activeFilterCount = 
    filters.categories.length + 
    (filters.inStock ? 1 : 0) + 
    (filters.condition.length) +
    (filters.rating > 0 ? 1 : 0);

  if (isLoading && currentPage === 1) {
    return <SearchPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            {searchQuery ? (
              <>
                Search Results for <span className="text-gold">"{searchQuery}"</span>
              </>
            ) : (
              'Browse All Products'
            )}
          </motion.h1>

          {/* Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for products..."
                className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all outline-none text-gray-900 placeholder-gray-400"
                autoFocus={!!queryParam}
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              
              {/* Clear Button */}
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-400" />
                </button>
              )}

              {/* Loading Indicator */}
              {isFetching && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gold transition-colors flex items-center gap-2 relative"
            >
              <FunnelIcon className="w-5 h-5" />
              <span className="hidden md:inline font-semibold">Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-gold text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-600">Active Filters:</span>
              {filters.categories.map(cat => (
                <span key={cat} className="px-3 py-1 bg-gold/10 text-gold text-sm font-medium rounded-full flex items-center gap-2">
                  {cat}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }))}
                    className="hover:text-gold-dark"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.inStock && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center gap-2">
                  In Stock
                  <button onClick={() => setFilters(prev => ({ ...prev, inStock: false }))}>
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.rating > 0 && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full flex items-center gap-2">
                  {filters.rating}★ & up
                  <button onClick={() => setFilters(prev => ({ ...prev, rating: 0 }))}>
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={() => setFilters({
                  categories: [],
                  priceRange: [0, 10000],
                  rating: 0,
                  inStock: false,
                  condition: [],
                  sortBy: 'relevance',
                })}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Count & Sort */}
          <div className="mt-4 flex items-center justify-between">
            {pagination && (
              <p className="text-gray-600">
                Showing <span className="font-bold text-gray-900">{allProducts.length}</span> of{' '}
                <span className="font-bold text-gray-900">{pagination.total}</span> products
                {searchQuery && <span className="text-gray-500"> for "{searchQuery}"</span>}
              </p>
            )}
            
            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, sortBy: e.target.value as any }));
                setCurrentPage(1);
                setAllProducts([]);
              }}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm font-medium"
            >
              <option value="relevance">Most Relevant</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700 mb-2">
              {searchQuery ? 'Search Failed' : 'Failed to Load Products'}
            </h3>
            <p className="text-red-600 mb-4">There was an error loading the products.</p>
            <button 
              onClick={() => refetch()}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Grid */}
        {!isError && allProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts.map((product, idx) => {
                const discount = product.pricing.salePrice 
                  ? Math.round(((product.pricing.basePrice - product.pricing.salePrice) / product.pricing.basePrice) * 100)
                  : 0;
                const displayPrice = product.pricing.salePrice || product.pricing.basePrice;
                const isImageLoaded = loadedImages.has(product._id);

                return (
                  <div
                    key={product._id}
                    onMouseEnter={() => setHoveredProduct(product._id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gold hover:shadow-xl hover:-translate-y-2"
                    style={{
                      animation: idx >= allProducts.length - 12 ? `fadeInUp 0.4s ease-out ${(idx % 12) * 0.03}s both` : 'none'
                    }}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      {/* Shimmer while image loads */}
                      {!isImageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%]" />
                      )}
                      
                      <img 
                        src={product.primaryImage || product.images[0]?.url || 'https://via.placeholder.com/400'}
                        alt={product.images[0]?.alt || product.title}
                        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                          isImageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setLoadedImages(prev => new Set(prev).add(product._id))}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image';
                          setLoadedImages(prev => new Set(prev).add(product._id));
                        }}
                        loading="lazy"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {discount > 0 && (
                          <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
                            -{discount}%
                          </div>
                        )}
                        {product.isFeatured && (
                          <div className="bg-gold text-white p-1.5 rounded-full shadow-md">
                            <StarIconSolid className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Stock Warning */}
                      {product.inventory.stockQuantity === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <span className="text-xs font-medium text-white">Out of Stock</span>
                        </div>
                      )}

                      {/* Low Stock */}
                      {product.inventory.stockQuantity > 0 && 
                       product.inventory.stockQuantity <= (product.inventory.lowStockThreshold || 10) && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-500/70 to-transparent p-3">
                          <span className="text-xs font-medium text-white">Only {product.inventory.stockQuantity} left!</span>
                        </div>
                      )}

                      {/* Quick Actions on Hover */}
                      <div
                        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-2 transition-opacity duration-200 ${
                          hoveredProduct === product._id ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product._id);
                          }}
                          disabled={wishlistLoading === product._id}
                          className={`p-2.5 backdrop-blur-sm rounded-full transition-all shadow-md hover:scale-110 ${
                            isInWishlist(product._id)
                              ? 'bg-red-50 hover:bg-red-100'
                              : 'bg-white/90 hover:bg-white'
                          }`}
                        >
                          {wishlistLoading === product._id ? (
                            <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                          ) : isInWishlist(product._id) ? (
                            <HeartIconSolid className="w-5 h-5 text-red-500" />
                          ) : (
                            <HeartIcon className="w-5 h-5 text-gray-700" />
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (product.inventory.stockQuantity > 0) {
                              toggleCart(product._id);
                            }
                          }}
                          disabled={cartLoading === product._id || product.inventory.stockQuantity === 0}
                          className={`p-2.5 rounded-full backdrop-blur-sm shadow-md transition-all hover:scale-110 ${
                            product.inventory.stockQuantity === 0
                              ? 'bg-gray-300/90 cursor-not-allowed text-gray-500'
                              : isInCart(product._id)
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-white/90 hover:bg-gold hover:text-white text-gold'
                          }`}
                        >
                          {cartLoading === product._id ? (
                            <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <ShoppingCartIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Product Info - Fade in with image */}
                    <div className={`p-4 space-y-1.5 transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-50'}`}>
                      {/* Category & Condition */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-600 uppercase font-medium">
                          {product.categoryNames?.[0] || 'General'}
                        </span>
                        {product.condition && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getConditionColor(product.condition)}`}>
                              {getConditionLabel(product.condition)}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Rating */}
                      {product.analytics.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <StarIconSolid className="w-3.5 h-3.5 text-gold" />
                          <span className="text-xs text-gray-600">
                            {product.analytics.averageRating.toFixed(1)} ({product.analytics.totalReviews})
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                        {product.title}
                      </h3>

                      {/* Seller */}
                      {product.sellerId && typeof product.sellerId === 'object' && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>by {product.sellerId.businessInfo?.businessName || 'Seller'}</span>
                          {product.sellerId.verification?.status === 'verified' && (
                            <span className="text-blue-500" title="Verified Seller">✓</span>
                          )}
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg text-gray-900 font-bold">
                          ${displayPrice.toFixed(2)}
                        </span>
                        {product.pricing.salePrice && product.pricing.basePrice > product.pricing.salePrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.pricing.basePrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Trending Badge */}
                      {product.analytics.totalSold > 50 && (
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium pt-2 border-t border-gray-100">
                          <FireIcon className="w-3 h-3" />
                          <span>Trending ({product.analytics.totalSold} sold)</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Infinite Scroll Shimmer Loader */}
            {(isLoadingMore || isFetching) && pagination && currentPage < pagination.totalPages && (
              <div className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(12)].map((_, idx) => (
                    <div key={`shimmer-${idx}`} className="bg-white rounded-lg overflow-hidden border border-gray-200">
                      <div className="aspect-[3/4] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%]"></div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 animate-shimmer bg-[length:200%_100%]"></div>
                          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-16 animate-shimmer bg-[length:200%_100%]"></div>
                        </div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full animate-shimmer bg-[length:200%_100%]"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 animate-shimmer bg-[length:200%_100%]"></div>
                        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-24 animate-shimmer bg-[length:200%_100%]"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Invisible sentinel */}
            {pagination && currentPage < pagination.totalPages && (
              <div ref={sentinelRef} className="h-1 mt-8" />
            )}

            {/* End of Results */}
            {pagination && currentPage >= pagination.totalPages && allProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-12 py-8"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-full text-gray-600">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="font-medium">You've seen all {allProducts.length} results</span>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && !isError && allProducts.length === 0 && searchQuery && (
          <div className="text-center py-20">
            <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Results Found</h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any products matching "{searchQuery}"
              {activeFilterCount > 0 && ' with your current filters'}
            </p>
            <div className="flex gap-3 justify-center">
              {activeFilterCount > 0 && (
                <button
                  onClick={() => setFilters({
                    categories: [],
                    priceRange: [0, 10000],
                    rating: 0,
                    inStock: false,
                    condition: [],
                    sortBy: 'relevance',
                  })}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-gold transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={handleClearSearch}
                className="px-8 py-3 bg-gold text-white font-bold rounded-xl hover:bg-gold-dark transition-colors"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Initial State - No Query */}
        {!searchQuery && allProducts.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <MagnifyingGlassIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Browse Our Products</h3>
            <p className="text-gray-500 mb-6">Search for products or browse all available items</p>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default SearchPage;


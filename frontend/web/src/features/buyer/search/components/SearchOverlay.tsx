import {
  CheckCircleIcon,
  FireIcon,
  FunnelIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product, useGetProductsQuery, useSearchProductsQuery } from "@/features/buyer/home/api/homeApi";
import { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from "@/features/buyer/wishlist/api/wishlistApi";
import { useGetCartQuery, useAddToCartMutation, useRemoveFromCartMutation } from "@/features/buyer/cart/api/cartApi";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useAppSelector } from "@/store/hooks";
import { safeToast as toast } from "@/core/utils/toast-wrapper";
import FilterPanel, { FilterState } from "./FilterPanel";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const SearchOverlay = ({
  isOpen,
  onClose,
  initialQuery = "",
}: SearchOverlayProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
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
  const [hasMore, setHasMore] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 10000],
    minRating: 0,
    inStockOnly: false,
    conditions: [],
    sortBy: 'relevance',
  });
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Debounce search query for API calls
  const debouncedQuery = useDebouncedValue(searchQuery, 500);

  // Determine which query to use - search or all products
  const useSearch = debouncedQuery && debouncedQuery.length >= 2;

  // Build query params from filters
  const getQueryParams = () => {
    const params: any = {
      page: currentPage,
      limit: 20,
    };

    // Add filters
    if (filters.categories.length > 0) {
      params.category = filters.categories[0]; // Backend supports single category
    }

    if (filters.priceRange[0] > 0) {
      params.minPrice = filters.priceRange[0];
    }

    if (filters.priceRange[1] < 10000) {
      params.maxPrice = filters.priceRange[1];
    }

    if (filters.minRating > 0) {
      params.minRating = filters.minRating;
    }

    if (filters.conditions.length > 0) {
      params.condition = filters.conditions[0]; // Backend supports single condition
    }

    if (filters.inStockOnly) {
      params.inStockOnly = 'true';
    }

    // Map sortBy to backend format
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
    } else if (filters.sortBy === 'popular') {
      params.sort = 'sold';
      params.order = 'desc';
    }

    return params;
  };

  // Build search query params (includes search query + filters)
  const getSearchQueryParams = () => {
    const params = getQueryParams();
    params.query = debouncedQuery;
    return params;
  };

  // Use appropriate query based on search state
  const searchParams = useSearch ? getSearchQueryParams() : getQueryParams();
  
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useSearchProductsQuery(
    searchParams,
    { skip: !useSearch || !isOpen }
  );

  const {
    data: productsData,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
  } = useGetProductsQuery(
    searchParams,
    { skip: useSearch || !isOpen }
  );

  const data = useSearch ? searchData : productsData;
  const isLoading = useSearch ? isSearchLoading : isProductsLoading;
  const isFetching = useSearch ? isSearchFetching : isProductsFetching;

  // Reset to page 1 when search query or filters change
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setAllProducts([]);
      setHasMore(true);
    }
  }, [debouncedQuery, filters, isOpen]);

  // Sync search query when overlay opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialQuery);
      setCurrentPage(1);
      setAllProducts([]);
      setHasMore(true);
    }
  }, [isOpen, initialQuery]);

  // Update products when data changes
  useEffect(() => {
    if (data?.data) {
      if (currentPage === 1) {
        setAllProducts(data.data);
      } else {
        setAllProducts((prev) => {
          // Avoid duplicates
          const existingIds = new Set(prev.map(p => p._id));
          const newProducts = data.data.filter(p => !existingIds.has(p._id));
          return [...prev, ...newProducts];
        });
      }

      // Check if there are more pages
      if (data.pagination) {
        setHasMore(currentPage < data.pagination.totalPages);
      }
    }
  }, [data, currentPage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setAllProducts([]);
    setHasMore(true);
  }, []);

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      onClose();
      navigate("/login");
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
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId).unwrap();
        toast.success("Added to wishlist");
      }
      // Keep optimistic state - it will be cleared when server data updates
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticWishlist(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading(null);
    }
  };

  const toggleCart = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      onClose();
      navigate("/login");
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
        toast.success("Removed from cart");
      } else {
        await addToCart({ productId, quantity: 1 }).unwrap();
        toast.success("Added to cart");
      }
      // Keep optimistic state - it will be cleared when server data updates
    } catch (error: any) {
      // Revert optimistic update on error
      setOptimisticCart(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      toast.error(error?.data?.message || "Failed to update cart");
    } finally {
      setCartLoading(null);
    }
  };

  const getConditionLabel = (condition: string) => {
    const labels: { [key: string]: string } = {
      new: "Brand New",
      mint: "Like New",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
    };
    return labels[condition] || "New";
  };

  const getConditionColor = (condition: string) => {
    const colors: { [key: string]: string } = {
      new: "bg-green-100 text-green-700 border-green-300",
      mint: "bg-blue-100 text-blue-700 border-blue-300",
      excellent: "bg-purple-100 text-purple-700 border-purple-300",
      good: "bg-amber-100 text-amber-700 border-amber-300",
      fair: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return colors[condition] || "bg-green-100 text-green-700 border-green-300";
  };

  const getImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return product.primaryImage || 'https://via.placeholder.com/400x500?text=No+Image';
  };

  const getPrice = (product: Product) => {
    return product.pricing.salePrice || product.pricing.basePrice;
  };

  const getOriginalPrice = (product: Product) => {
    return product.pricing.salePrice ? product.pricing.basePrice : undefined;
  };

  const getDiscount = (product: Product) => {
    if (product.pricing.salePrice && product.pricing.basePrice) {
      const discount = ((product.pricing.basePrice - product.pricing.salePrice) / product.pricing.basePrice) * 100;
      return Math.round(discount);
    }
    return undefined;
  };

  const isInStock = (product: Product) => {
    return product.inventory.stockQuantity > 0;
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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Search Overlay */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={onClose}
            className="fixed top-20 left-0 right-0 bottom-0 bg-white z-40 overflow-hidden"
          >
            {/* Results Info Bar */}
            <div
              className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {isLoading ? (
                      <span className="inline-block h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
                    ) : searchQuery ? (
                      <>
                        <span className="font-bold text-gray-900">
                          {data?.pagination?.total || allProducts.length}
                        </span>{" "}
                        results for "{searchQuery}"
                      </>
                    ) : (
                      <>
                        Showing{" "}
                        <span className="font-bold text-gray-900">
                          {data?.pagination?.total || allProducts.length}
                        </span>{" "}
                        products
                      </>
                    )}
                  </p>
                  
                  {/* Filter Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFilterOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-gold hover:bg-gold/5 transition-colors"
                  >
                    <FunnelIcon className="w-4 h-4 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Filters</span>
                    {(filters.categories.length > 0 || filters.conditions.length > 0 || filters.minRating > 0 || filters.inStockOnly) && (
                      <span className="w-5 h-5 rounded-full bg-gold text-white text-xs flex items-center justify-center font-bold">
                        {filters.categories.length + filters.conditions.length + (filters.minRating > 0 ? 1 : 0) + (filters.inStockOnly ? 1 : 0)}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div
              ref={scrollContainerRef}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {isLoading && currentPage === 1 ? (
                // Initial loading shimmer
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-white rounded-lg overflow-hidden border border-gray-200"
                    >
                      {/* Image Skeleton */}
                      <div className="aspect-[3/4] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] relative">
                        <div className="absolute top-3 right-3 w-12 h-6 bg-gray-300/50 rounded-md" />
                      </div>
                      
                      {/* Info Skeleton */}
                      <div className="p-4 space-y-1.5">
                        {/* Category */}
                        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-20" />
                        
                        {/* Rating */}
                        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-24" />
                        
                        {/* Title */}
                        <div className="space-y-1.5">
                          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-full" />
                          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-3/4" />
                        </div>
                        
                        {/* Price */}
                        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-20 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : allProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500">Try a different search term or adjust your filters</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                    {allProducts.map((product, idx) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.5) }}
                        onMouseEnter={() => setHoveredProduct(product._id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                        onClick={() => {
                          onClose();
                          navigate(`/product/${product._id}`);
                        }}
                        className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gold hover:shadow-xl hover:-translate-y-2"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                          <img
                            src={getImage(product)}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=No+Image';
                            }}
                          />

                          {/* Badges */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            {getDiscount(product) && (
                              <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
                                -{getDiscount(product)}%
                              </div>
                            )}
                            {product.isFeatured && (
                              <div className="bg-gold text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
                                Featured
                              </div>
                            )}
                          </div>

                          {/* Stock Warning */}
                          {!isInStock(product) && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                              <span className="text-xs font-medium text-white">
                                Out of Stock
                              </span>
                            </div>
                          )}

                          {/* Quick Actions */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                              opacity: hoveredProduct === product._id ? 1 : 0,
                              y: hoveredProduct === product._id ? 0 : 20,
                            }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-2"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product._id);
                              }}
                              disabled={wishlistLoading === product._id}
                              className={`p-2.5 backdrop-blur-sm rounded-full transition-all shadow-md hover:scale-110 ${
                                isInWishlist(product._id)
                                  ? "bg-red-50 hover:bg-red-100"
                                  : "bg-white/90 hover:bg-white"
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
                              className={`p-2.5 backdrop-blur-sm rounded-full transition-all shadow-md hover:scale-110 ${
                                product.inventory.stockQuantity === 0
                                  ? "bg-gray-300/90 cursor-not-allowed text-gray-500"
                                  : isInCart(product._id)
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : "bg-white/90 hover:bg-gold hover:text-white text-gold"
                              }`}
                            >
                              {cartLoading === product._id ? (
                                <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <ShoppingCartIcon className="w-5 h-5" />
                              )}
                            </button>
                          </motion.div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4 space-y-1.5">
                          {/* Category & Condition */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-600 uppercase font-medium">
                              {product.categoryNames?.[0] || 'General'}
                            </span>
                            {product.condition && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getConditionColor(
                                    product.condition
                                  )}`}
                                >
                                  {getConditionLabel(product.condition)}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Rating */}
                          {product.analytics.averageRating > 0 && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <StarIconSolid
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(product.analytics.averageRating)
                                      ? "text-gold"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-600">
                                ({product.analytics.totalReviews})
                              </span>
                            </div>
                          )}

                          {/* Title */}
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                            {product.title}
                          </h3>

                          <div className="flex items-baseline gap-2">
                            <span className="text-lg text-gray-900 font-bold">
                              ${getPrice(product).toFixed(2)}
                            </span>
                            {getOriginalPrice(product) && (
                              <span className="text-sm text-gray-500 line-through">
                                ${getOriginalPrice(product)!.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {product.analytics.totalSold > 100 && (
                            <div className="flex items-center gap-1 text-xs text-green-600 font-medium pt-2 border-t border-gray-100">
                              <FireIcon className="w-3 h-3" />
                              <span>Trending</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Loading More Shimmer */}
                  {(isFetching && currentPage > 1) || hasMore ? (
                    <div ref={loadMoreRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200 animate-pulse">
                          <div className="relative aspect-[3/4] bg-gray-200" />
                          <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-6 bg-gray-200 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </motion.div>

          {/* Filter Panel */}
          <FilterPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApplyFilters={handleApplyFilters}
            currentFilters={filters}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;

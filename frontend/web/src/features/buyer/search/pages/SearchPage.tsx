import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingCartIcon,
  FireIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import FilterPanel, { FilterState } from '../components/FilterPanel';
import SearchPageSkeleton from '../components/SearchPageSkeleton';

// Mock products for search - in real implementation, this will come from API
const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.9,
    reviews: 2847,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    category: "Electronics",
    discount: 25,
    inStock: true,
    condition: "new"
  },
  {
    id: 2,
    name: "Handcrafted Leather Bag",
    price: 189.00,
    originalPrice: 259.00,
    rating: 4.8,
    reviews: 1243,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2012&auto=format&fit=crop",
    category: "Fashion",
    discount: 27,
    inStock: true,
    condition: "new"
  },
  {
    id: 3,
    name: "Smart Watch Pro",
    price: 349.99,
    rating: 4.7,
    reviews: 3124,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
    category: "Electronics",
    inStock: true,
    condition: "new"
  },
  {
    id: 4,
    name: "Minimalist Desk Lamp",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1507473888900-52e1adad5452?q=80&w=1973&auto=format&fit=crop",
    category: "Home",
    discount: 20,
    inStock: true,
    condition: "mint"
  },
  {
    id: 5,
    name: "Organic Cotton Hoodie",
    price: 59.99,
    rating: 4.5,
    reviews: 567,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1887&auto=format&fit=crop",
    category: "Fashion",
    inStock: true,
    condition: "new"
  },
  {
    id: 6,
    name: "Ceramic Planter Set",
    price: 45.00,
    rating: 4.8,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=2072&auto=format&fit=crop",
    category: "Home",
    inStock: true,
    condition: "new"
  },
  {
    id: 7,
    name: "Bluetooth Speaker",
    price: 129.99,
    rating: 4.7,
    reviews: 1456,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=2080&auto=format&fit=crop",
    category: "Electronics",
    inStock: true,
    condition: "mint"
  },
  {
    id: 8,
    name: "Yoga Mat Premium",
    price: 49.99,
    rating: 4.9,
    reviews: 678,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=2080&auto=format&fit=crop",
    category: "Sports",
    inStock: true,
    condition: "new"
  },
  {
    id: 9,
    name: "Luxury Face Serum",
    price: 89.99,
    rating: 4.8,
    reviews: 1892,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop",
    category: "Beauty",
    inStock: true,
    condition: "new"
  },
  {
    id: 10,
    name: "Designer Sneakers",
    price: 149.99,
    rating: 4.6,
    reviews: 445,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop",
    category: "Fashion",
    inStock: false,
    condition: "excellent"
  },
  {
    id: 11,
    name: "Coffee Maker Deluxe",
    price: 199.99,
    rating: 4.9,
    reviews: 789,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=2072&auto=format&fit=crop",
    category: "Home",
    inStock: true,
    condition: "new"
  },
  {
    id: 12,
    name: "Gift Box Assortment",
    price: 69.99,
    rating: 4.7,
    reviews: 324,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1824&auto=format&fit=crop",
    category: "Gifts",
    inStock: true,
    condition: "new"
  }
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState(ALL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null);

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

  // Sync with URL params
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  // Simulate API call - debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    
    // Simulate API call
    // In production: await fetch(`/api/products/search?q=${query}`)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query.trim()) {
      setResults(ALL_PRODUCTS);
    } else {
      const filtered = ALL_PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
    
    setIsLoading(false);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    // Apply filters to results
    let filtered = ALL_PRODUCTS;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.some(cat => product.category.toLowerCase().includes(cat))
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Filter by rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.minRating);
    }

    // Filter by stock
    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Note: Conditions filter will be applied when product data includes condition field

    // Sort results
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    setResults(filtered);
  };

  return (
    <div 
      className="min-h-screen bg-white"
      onClick={() => navigate('/')}
    >
      {/* Results Info Bar - Minimal */}
      <div 
        className="sticky top-20 z-40 bg-white border-b border-gray-100 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                Searching...
              </span>
            ) : searchQuery ? (
              <>
                <span className="font-bold text-gray-900">{results.length}</span> results for "{searchQuery}"
              </>
            ) : (
              <>
                Showing <span className="font-bold text-gray-900">{results.length}</span> products
              </>
            )}
          </p>
        </div>
      </div>

      {/* Search Results */}
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          // Loading Skeleton
          <SearchPageSkeleton />
        ) : results.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearSearch}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gold transition-colors"
            >
              Clear Search
            </button>
          </motion.div>
        ) : (
          // Products Grid
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {results.map((product, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  key={product.id}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${product.id}`);
                  }}
                  className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gold hover:shadow-xl hover:-translate-y-2"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <motion.img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Badges Overlay - Top Right */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {/* Discount Badge */}
                      {product.discount && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md"
                        >
                          -{product.discount}%
                        </motion.div>
                      )}
                    </div>

                    {/* Stock Warning */}
                    {!product.inStock && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="flex items-center gap-1.5 text-white">
                          <span className="text-xs font-medium">Out of Stock</span>
                        </div>
                      </div>
                    )}

                    {/* Quick Actions - Appear on Hover */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: hoveredProduct === product.id ? 1 : 0, 
                        y: hoveredProduct === product.id ? 0 : 20 
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
                        title="Add to Wishlist"
                      >
                        {wishlist.includes(product.id) ? (
                          <HeartIconSolid className="w-5 h-5 text-red-500" />
                        ) : (
                          <HeartIcon className="w-5 h-5 text-gray-700" />
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add to cart logic
                        }}
                        className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-gold hover:text-white transition-colors shadow-md"
                        title="Add to Cart"
                      >
                        <ShoppingCartIcon className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Product Information */}
                  <div className="p-4 space-y-2">
                    {/* Category, Condition & Rating */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-600 uppercase font-medium">
                          {product.category}
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
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIconSolid
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.floor(product.rating || 0) ? 'text-gold' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">
                            ({product.reviews || 0})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg text-gray-900 font-bold">
                        ${(product.price).toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Trending Badge */}
                    {product.reviews > 500 && (
                      <div className="flex items-center gap-1 text-xs text-green-600 font-medium pt-2 border-t border-gray-100">
                        <FireIcon className="w-3 h-3" />
                        <span>Trending</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;


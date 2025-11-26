import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  ShareIcon,
  SparklesIcon,
  TagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  condition: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  addedAt: Date;
  discount?: number;
}

const MOCK_WISHLIST: WishlistItem[] = [
  {
    id: '1',
    productId: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Electronics',
    condition: 'new',
    inStock: true,
    rating: 4.9,
    reviews: 2847,
    addedAt: new Date(Date.now() - 86400000),
    discount: 25,
  },
  {
    id: '2',
    productId: '2',
    name: 'Handcrafted Leather Bag',
    price: 189.00,
    originalPrice: 259.00,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
    category: 'Fashion',
    condition: 'new',
    inStock: true,
    rating: 4.8,
    reviews: 1243,
    addedAt: new Date(Date.now() - 259200000),
    discount: 27,
  },
  {
    id: '3',
    productId: '3',
    name: 'Smart Watch Pro',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Electronics',
    condition: 'new',
    inStock: false,
    rating: 4.7,
    reviews: 3124,
    addedAt: new Date(Date.now() - 604800000),
  },
  {
    id: '4',
    productId: '4',
    name: 'Minimalist Desk Lamp',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1507473888900-52e1adad5452?w=400',
    category: 'Home',
    condition: 'mint',
    inStock: true,
    rating: 4.6,
    reviews: 892,
    addedAt: new Date(Date.now() - 1209600000),
    discount: 20,
  },
];

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState(MOCK_WISHLIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'name'>('recent');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = [
    { value: 'recent', label: 'Recently Added', icon: ClockIcon },
    { value: 'price-low', label: 'Price: Low to High', icon: ArrowsUpDownIcon },
    { value: 'price-high', label: 'Price: High to Low', icon: ArrowsUpDownIcon },
    { value: 'name', label: 'Name A-Z', icon: TagIcon },
  ] as const;

  const categories = ['all', ...Array.from(new Set(MOCK_WISHLIST.map(item => item.category)))];

  const getConditionLabel = (condition: string) => {
    const labels: { [key: string]: string } = {
      'new': 'Brand New',
      'mint': 'Like New',
      'excellent': 'Excellent',
      'good': 'Good',
    };
    return labels[condition] || 'New';
  };

  const getConditionColor = (condition: string) => {
    const colors: { [key: string]: string } = {
      'new': 'bg-green-100 text-green-700 border-green-300',
      'mint': 'bg-blue-100 text-blue-700 border-blue-300',
      'excellent': 'bg-purple-100 text-purple-700 border-purple-300',
      'good': 'bg-amber-100 text-amber-700 border-amber-300',
    };
    return colors[condition] || 'bg-green-100 text-green-700 border-green-300';
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addToCart = (itemId: string) => {
    console.log('Add to cart:', itemId);
    // Add to cart logic here
  };

  const filteredItems = wishlistItems
    .filter(item => 
      (selectedCategory === 'all' || item.category === selectedCategory) &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        case 'recent': return b.addedAt.getTime() - a.addedAt.getTime();
        default: return 0;
      }
    });

  const totalSavings = wishlistItems.reduce((sum, item) => 
    sum + ((item.originalPrice || item.price) - item.price), 0
  );

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-red-400/20 to-pink-400/20 flex items-center justify-center">
            <HeartIcon className="w-16 h-16 text-red-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">
            Save items you love to your wishlist and shop them later!
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
          >
            Discover Products
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20" onClick={() => setIsSortOpen(false)}>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
              {totalSavings > 0 && (
                <span className="ml-2 text-green-600 font-semibold">
                  • ${totalSavings.toFixed(2)} in potential savings
                </span>
              )}
            </p>

            {/* Add All to Cart */}
            {wishlistItems.length > 0 && (
              <button 
                onClick={() => navigate('/cart')}
                className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-bold text-sm hover:bg-gold transition-all shadow-lg flex items-center gap-2"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Add All to Cart
              </button>
            )}
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row gap-4" onClick={(e) => e.stopPropagation()}>
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wishlist..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-sm bg-white"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-all text-sm font-semibold text-gray-700 min-w-[200px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                  <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-full bg-white border-2 border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-10"
                  >
                    {sortOptions.map((option, idx) => (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={clsx(
                          'w-full px-4 py-3 text-left flex items-center justify-between transition-all border-b border-gray-100 last:border-b-0',
                          sortBy === option.value
                            ? 'bg-gold/10 text-gold font-bold'
                            : 'text-gray-700 hover:bg-gray-50 font-semibold'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <option.icon className={`w-4 h-4 ${sortBy === option.value ? 'text-gold' : 'text-gray-400'}`} />
                          <span className="text-sm">{option.label}</span>
                        </div>
                        {sortBy === option.value && (
                          <CheckIcon className="w-4 h-4 text-gold" />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={clsx(
                  'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all',
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-red-300'
                )}
              >
                {cat === 'all' ? 'All Items' : cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Wishlist Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No items found</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  transition={{ delay: idx * 0.05 }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => navigate(`/product/${item.productId}`)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-red-300 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Discount Badge */}
                    {item.discount && (
                      <div className="absolute top-3 right-3 w-14 h-14 rounded-full bg-red-500 text-white flex flex-col items-center justify-center shadow-xl font-bold text-xs">
                        <span>-{item.discount}%</span>
                      </div>
                    )}

                    {/* Stock Status */}
                    {!item.inStock && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-gray-900/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                        Out of Stock
                      </div>
                    )}

                    {/* Hover Actions - Like Homepage */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: hoveredItem === item.id ? 1 : 0,
                        y: hoveredItem === item.id ? 0 : 20
                      }}
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-3"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.inStock) addToCart(item.id);
                        }}
                        disabled={!item.inStock}
                        className={clsx(
                          'p-3 rounded-full shadow-xl transition-all',
                          item.inStock
                            ? 'bg-white/90 backdrop-blur-sm hover:bg-gold text-gray-700 hover:text-white'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        )}
                        title={item.inStock ? "Add to Cart" : "Out of Stock"}
                      >
                        <ShoppingCartIcon className="w-6 h-6" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(item.id);
                        }}
                        className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-xl hover:bg-red-500 text-gray-700 hover:text-white transition-all"
                        title="Remove from Wishlist"
                      >
                        <TrashIcon className="w-6 h-6" />
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-600 uppercase font-medium">{item.category}</span>
                        <span className="text-gray-300">•</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getConditionColor(item.condition)}`}>
                          {getConditionLabel(item.condition)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIconSolid
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(item.rating) ? 'text-amber-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({item.reviews})</span>
                      </div>
                    </div>

                    <h3 
                      className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 leading-snug hover:text-red-500 transition-colors"
                    >
                      {item.name}
                    </h3>

                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-extrabold text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {item.discount && (
                      <p className="text-xs text-green-600 font-semibold mt-1">
                        Save ${((item.originalPrice || item.price) - item.price).toFixed(2)}
                      </p>
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

export default WishlistPage;

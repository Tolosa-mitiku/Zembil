import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { 
  ShoppingBagIcon, 
  SparklesIcon, 
  StarIcon,
  ArrowRightIcon,
  HeartIcon,
  ShoppingCartIcon,
  FireIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  BoltIcon,
  GiftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon as SparklesIconOutline,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import HomePageSkeleton from '../components/HomePageSkeleton';

// Mock Data - Premium E-commerce Homepage
const HERO_BANNERS = [
  {
    id: 1,
    title: "Luxury Meets Comfort",
    subtitle: "Discover our exclusive summer collection",
    tagline: "Up to 50% OFF",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    gradient: "from-purple-600/80 via-pink-600/70 to-rose-500/80",
    ctaText: "Shop Now",
    ctaColor: "bg-white text-gray-900"
  },
  {
    id: 2,
    title: "Tech Innovation",
    subtitle: "Latest gadgets at unbeatable prices",
    tagline: "New Arrivals",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=2041&auto=format&fit=crop",
    gradient: "from-blue-600/80 via-cyan-600/70 to-teal-500/80",
    ctaText: "Explore Tech",
    ctaColor: "bg-white text-blue-900"
  },
  {
    id: 3,
    title: "Artisan Treasures",
    subtitle: "Handcrafted with love, delivered to you",
    tagline: "Limited Edition",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop",
    gradient: "from-amber-600/80 via-orange-600/70 to-gold/80",
    ctaText: "Browse Collection",
    ctaColor: "bg-white text-amber-900"
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All', icon: TagIcon, color: 'bg-gradient-to-br from-gray-600 to-gray-800', count: 1247 },
  { id: 'fashion', name: 'Fashion', icon: SparklesIcon, color: 'bg-gradient-to-br from-pink-500 to-rose-600', count: 342 },
  { id: 'electronics', name: 'Electronics', icon: BoltIcon, color: 'bg-gradient-to-br from-blue-500 to-indigo-600', count: 189 },
  { id: 'home', name: 'Home', icon: ShoppingBagIcon, color: 'bg-gradient-to-br from-green-500 to-emerald-600', count: 256 },
  { id: 'beauty', name: 'Beauty', icon: StarIcon, color: 'bg-gradient-to-br from-purple-500 to-violet-600', count: 178 },
  { id: 'sports', name: 'Sports', icon: FireIcon, color: 'bg-gradient-to-br from-orange-500 to-red-600', count: 145 },
  { id: 'gifts', name: 'Gifts', icon: GiftIcon, color: 'bg-gradient-to-br from-yellow-500 to-amber-600', count: 137 },
];

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "Immersive sound quality with 30-hour battery",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.9,
    reviews: 2847,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    category: "Electronics",
    badge: "🔥 Hot Deal",
    inStock: true,
    discount: 25,
    featured: true,
    condition: "new"
  },
  {
    id: 2,
    name: "Handcrafted Leather Bag",
    description: "Italian leather, premium craftsmanship",
    price: 189.00,
    originalPrice: 259.00,
    rating: 4.8,
    reviews: 1243,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2012&auto=format&fit=crop",
    category: "Fashion",
    badge: "✨ Bestseller",
    inStock: true,
    discount: 27,
    featured: true,
    condition: "new"
  },
  {
    id: 3,
    name: "Smart Watch Pro",
    description: "Health tracking meets elegant design",
    price: 349.99,
    rating: 4.7,
    reviews: 3124,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
    category: "Electronics",
    badge: "🆕 New",
    inStock: true,
    featured: true,
    condition: "new"
  },
  {
    id: 4,
    name: "Minimalist Desk Lamp",
    description: "Wireless charging base, adjustable brightness",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1507473888900-52e1adad5452?q=80&w=1973&auto=format&fit=crop",
    category: "Home",
    inStock: true,
    discount: 20,
    featured: true,
    condition: "mint"
  }
];

const PRODUCTS = [
  ...FEATURED_PRODUCTS,
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

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [featuredCarouselIndex, setFeaturedCarouselIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll featured carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedCarouselIndex((prev) => {
        const newIndex = (prev + 1) % FEATURED_PRODUCTS.length;
        
        // Smooth scroll to the new index
        if (carouselRef.current) {
          const scrollWidth = carouselRef.current.scrollWidth;
          const itemWidth = scrollWidth / FEATURED_PRODUCTS.length;
          carouselRef.current.scrollTo({
            left: itemWidth * newIndex,
            behavior: 'smooth'
          });
        }
        
        return newIndex;
      });
    }, 4000); // Change every 4 seconds
    
    return () => clearInterval(timer);
  }, []);

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = selectedCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category.toLowerCase() === selectedCategory);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Carousel - Only show when NOT authenticated */}
      {!isAuthenticated && (
        <section className="relative h-[650px] md:h-[700px] w-full overflow-hidden bg-gray-900">
          <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            {/* Background Image with Ken Burns Effect */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 6, ease: "linear" }}
              className="absolute inset-0"
            >
              <img 
                src={HERO_BANNERS[currentSlide].image} 
                alt={HERO_BANNERS[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${HERO_BANNERS[currentSlide].gradient} mix-blend-multiply`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <div className="max-w-5xl">
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mb-6"
                >
                  <span className="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold tracking-widest shadow-2xl">
                    {HERO_BANNERS[currentSlide].tagline}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tight drop-shadow-2xl"
                  style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
                >
                  {HERO_BANNERS[currentSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-2xl md:text-3xl text-white/95 mb-12 font-light tracking-wide drop-shadow-lg"
                >
                  {HERO_BANNERS[currentSlide].subtitle}
                </motion.p>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  <button
                    onClick={() => navigate('/shop')}
                    className={`${HERO_BANNERS[currentSlide].ctaColor} px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-transform duration-300 flex items-center gap-3 mx-auto`}
                  >
                    {HERO_BANNERS[currentSlide].ctaText}
                    <ArrowRightIcon className="w-6 h-6" />
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/40 transition-all z-10"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/40 transition-all z-10"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </motion.div>
        </AnimatePresence>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {HERO_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-500 rounded-full ${
                currentSlide === idx 
                  ? 'w-12 h-2 bg-white shadow-lg' 
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
        </section>
      )}

      {/* Trust Badges - Floating (only when NOT authenticated) */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: TruckIcon, title: "Free Shipping", desc: "On orders over $50", color: "from-blue-500 to-cyan-600" },
              { icon: ShieldCheckIcon, title: "Secure Checkout", desc: "100% protected payment", color: "from-green-500 to-emerald-600" },
              { icon: GiftIcon, title: "Easy Returns", desc: "30-day money back", color: "from-purple-500 to-pink-600" }
            ].map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <badge.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{badge.title}</h3>
                <p className="text-sm text-gray-500">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Carousel */}
      <section className={`py-20 bg-gradient-to-br from-gray-50 to-white ${isAuthenticated ? 'pt-8' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2"
              >
                Featured Collection
              </motion.h2>
              <p className="text-gray-500 font-medium">Handpicked items just for you</p>
            </div>
            <button 
              onClick={() => navigate('/shop')}
              className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gold transition-colors shadow-lg group"
            >
              View All 
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Carousel Container */}
          <div className="relative">
            {/* Carousel Track */}
            <div 
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {FEATURED_PRODUCTS.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer snap-start shrink-0 w-[500px]"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {/* Full Background Image Card */}
                  <div className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-[400px]">
                    {/* Background Image */}
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 group-hover:from-black/95 transition-all duration-300" />

                    {/* Content Overlay */}
                    <div className="relative h-full flex flex-col justify-between p-8">
                      {/* Top Section - Badges */}
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-2">
                          {product.badge && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="inline-block px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 shadow-lg"
                            >
                              {product.badge}
                            </motion.div>
                          )}
                        </div>
                        
                        {product.discount && (
                          <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-base shadow-xl">
                            -{product.discount}%
                          </div>
                        )}
                      </div>

                      {/* Bottom Section - Product Info */}
                      <div>
                        {/* Category & Rating */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider">
                            {product.category}
                          </span>
                          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full">
                            <StarIconSolid className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-bold text-white">{product.rating}</span>
                            <span className="text-xs text-white/80">({product.reviews.toLocaleString()})</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-2xl md:text-3xl text-white mb-2 drop-shadow-lg">
                          {product.name}
                        </h3>

                        {/* Description */}
                        {product.description && (
                          <p className="text-sm text-white/90 mb-4 line-clamp-2 leading-relaxed drop-shadow-md">
                            {product.description}
                          </p>
                        )}

                        {/* Price & Actions */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-extrabold text-white drop-shadow-lg">
                              ${product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-lg text-white/60 line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product.id);
                              }}
                              className="p-3 rounded-xl bg-white/90 backdrop-blur-md hover:bg-white transition-all shadow-lg"
                              title="Add to Wishlist"
                            >
                              {wishlist.includes(product.id) ? (
                                <HeartIconSolid className="w-5 h-5 text-red-500" />
                              ) : (
                                <HeartIcon className="w-5 h-5 text-gray-700" />
                              )}
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="px-6 py-3 rounded-xl bg-gold text-white font-bold hover:bg-gold-dark transition-all shadow-xl flex items-center gap-2"
                            >
                              <ShoppingCartIcon className="w-5 h-5" />
                              Add to Cart
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {FEATURED_PRODUCTS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFeaturedCarouselIndex(idx);
                    if (carouselRef.current) {
                      const scrollWidth = carouselRef.current.scrollWidth;
                      const itemWidth = scrollWidth / FEATURED_PRODUCTS.length;
                      carouselRef.current.scrollTo({
                        left: itemWidth * idx,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    featuredCarouselIndex === idx 
                      ? 'w-8 h-2 bg-gold' 
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter - Sticky */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-xl border-y border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-bold text-gray-900">Shop by Category</h3>
            <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-bold rounded-full">{filteredProducts.length} items</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat, idx) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap 
                  transition-all duration-300 shadow-sm hover:shadow-md
                  ${selectedCategory === cat.id 
                    ? `${cat.color} text-white scale-105 shadow-lg` 
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gold hover:text-gold'}
                `}
              >
                <cat.icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredProducts.map((product, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => navigate(`/product/${product.id}`)}
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

                    {/* Featured Star */}
                    {product.featured && (
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="bg-gold text-white p-1.5 rounded-full shadow-md"
                      >
                        <StarIconSolid className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>

                  {/* Stock Warning - Bottom Overlay */}
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

                  {/* Stats Row */}
                  {product.reviews > 500 && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <FireIcon className="w-3 h-3" />
                        <span>Trending</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More */}
        {filteredProducts.length >= 8 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <button className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gold transition-colors shadow-xl">
              Load More Products
            </button>
          </motion.div>
        )}
      </section>

      {/* Newsletter */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Never Miss a Deal
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Subscribe for exclusive offers, early access, and personalized recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all"
              />
              <button className="px-8 py-4 bg-gold text-white font-bold rounded-2xl hover:bg-gold-dark transition-colors shadow-2xl shadow-gold/30">
                Subscribe Now
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">No spam, unsubscribe anytime</p>
          </motion.div>
        </div>
      </section>

      {/* Footer Promo */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Products" },
              { number: "50K+", label: "Happy Customers" },
              { number: "500+", label: "Brands" },
              { number: "24/7", label: "Support" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-extrabold text-gold mb-2">{stat.number}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


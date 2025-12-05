import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  ShoppingCartIcon,
  ShareIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  TagIcon,
  ClockIcon,
  ChevronRightIcon,
  ChatBubbleLeftIcon,
  ChevronLeftIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';

// Mock product data - will be fetched from API
const MOCK_PRODUCT = {
  _id: '1',
  title: 'Premium Wireless Headphones',
  description: 'Experience studio-quality sound with our Premium Wireless Headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort for all-day wear. Perfect for music lovers, commuters, and professionals.',
  price: 299.99,
  discountPrice: 399.99,
  stock: 45,
  category: 'Electronics',
  brand: 'AudioTech',
  sku: 'AT-WH-PRO-001',
  condition: 'new',
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=2069&auto=format&fit=crop',
  ],
  rating: 4.9,
  reviewCount: 2847,
  sold: 1234,
  views: 15678,
  tags: ['wireless', 'noise-canceling', 'bluetooth', 'premium'],
  specifications: {
    'Battery Life': '30 hours',
    'Connectivity': 'Bluetooth 5.3',
    'Weight': '250g',
    'Warranty': '2 years',
    'Driver Size': '40mm',
    'Frequency Response': '20Hz - 20kHz',
  },
  features: [
    'Active Noise Cancellation',
    'Premium Leather Earcups',
    'Foldable Design',
    'Built-in Microphone',
    'Touch Controls',
    'Multi-device Pairing',
  ],
  seller: {
    name: 'AudioTech Store',
    rating: 4.8,
    totalSales: 15000,
    responseTime: '< 1 hour',
  },
  reviews: [
    {
      id: 1,
      user: 'John D.',
      avatar: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      date: '2024-03-15',
      comment: 'Absolutely amazing headphones! The sound quality is incredible and the noise cancellation works perfectly. Best purchase I\'ve made this year!',
      verified: true,
      helpful: 234,
    },
    {
      id: 2,
      user: 'Sarah M.',
      avatar: 'https://i.pravatar.cc/150?img=45',
      rating: 5,
      date: '2024-03-10',
      comment: 'Great for work calls and music. Battery lasts forever and they\'re super comfortable.',
      verified: true,
      helpful: 156,
    },
    {
      id: 3,
      user: 'Mike R.',
      avatar: 'https://i.pravatar.cc/150?img=33',
      rating: 4,
      date: '2024-03-08',
      comment: 'Very good headphones, slightly pricey but worth it for the quality.',
      verified: true,
      helpful: 89,
    },
  ],
};

const RELATED_PRODUCTS = [
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    price: 149.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1932&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Portable Speaker",
    price: 89.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=2080&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Headphone Stand",
    price: 29.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?q=80&w=1887&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "USB-C Audio Cable",
    price: 19.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1884&auto=format&fit=crop",
  },
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product] = useState(MOCK_PRODUCT);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id]);

  const discount = product.discountPrice 
    ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)
    : 0;

  const getConditionInfo = (condition: string) => {
    const conditions: { [key: string]: { label: string; color: string; icon: string } } = {
      'new': { label: 'Brand New', color: 'bg-green-100 text-green-700 border-green-300', icon: '✨' },
      'mint': { label: 'Like New', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: '💎' },
      'excellent': { label: 'Excellent', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: '⭐' },
      'good': { label: 'Good', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: '👍' },
      'fair': { label: 'Fair', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: '📦' },
    };
    return conditions[condition] || conditions.new;
  };

  const conditionInfo = getConditionInfo(product.condition);

  // Scroll to top when component mounts or product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    // Add to cart logic
    console.log(`Added ${quantity} items to cart`);
  };

  const handleBuyNow = () => {
    // Direct checkout logic
    console.log('Buy now:', quantity);
  };

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white" onClick={() => setShowShareMenu(false)}>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gold transition-colors">
              Home
            </button>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <button onClick={() => navigate('/shop')} className="text-gray-500 hover:text-gold transition-colors">
              {product.category}
            </button>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border-2 border-gray-200 shadow-xl group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                />
              </AnimatePresence>
              
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-6 left-6 w-20 h-20 rounded-full bg-red-500 text-white flex flex-col items-center justify-center shadow-2xl">
                  <span className="text-2xl font-extrabold">-{discount}%</span>
                  <span className="text-[10px] font-medium">OFF</span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-6 right-6 p-4 rounded-full bg-white/90 backdrop-blur-md shadow-xl hover:scale-110 transition-transform"
              >
                {isWishlisted ? (
                  <HeartIconSolid className="w-7 h-7 text-red-500" />
                ) : (
                  <HeartIcon className="w-7 h-7 text-gray-700" />
                )}
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              >
                <ArrowsPointingOutIcon className="w-5 h-5 text-gray-700" />
              </button>

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-6 left-6 px-3 py-2 bg-black/70 backdrop-blur-md rounded-lg">
                  <span className="text-sm font-medium text-white">
                    {selectedImage + 1} / {product.images.length}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-gold shadow-lg ring-4 ring-gold/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                <TruckIcon className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-blue-900">Free Delivery</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
                <ShieldCheckIcon className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-green-900">Secure Payment</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-200">
                <CheckCircleIcon className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-purple-900">Easy Returns</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Title & Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-gray-300">•</span>
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${conditionInfo.color}`}>
                  {conditionInfo.icon} {conditionInfo.label}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {product.title}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIconSolid
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-base font-bold text-gray-900">{product.rating}</span>
                  <span className="text-xs text-gray-600">({product.reviewCount.toLocaleString()} reviews)</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-semibold text-green-600">{product.sold.toLocaleString()}</span> sold
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-gold/5 via-white to-gold/10 border-2 border-gold/30">
              <div className="flex items-end gap-4 mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Price</p>
                  <p className="text-4xl font-extrabold text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                {product.discountPrice && (
                  <div className="pb-1">
                    <p className="text-xl font-bold text-gray-400 line-through">
                      ${product.discountPrice.toFixed(2)}
                    </p>
                    <p className="text-base font-bold text-green-600">
                      Save ${(product.discountPrice - product.price).toFixed(2)}!
                    </p>
                  </div>
                )}
              </div>

              {/* Stock Indicator */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                product.stock > 10 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                <CheckCircleIcon className="w-4 h-4" />
                <span className="font-semibold text-xs">
                  {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`} - Order soon!
                </span>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-gray-50 transition-colors border-r-2 border-gray-200"
                  >
                    <MinusIcon className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="px-6 py-2.5 font-bold text-base text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2.5 hover:bg-gray-50 transition-colors border-l-2 border-gray-200"
                  >
                    <PlusIcon className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                <p className="text-xs text-gray-500">
                  {product.stock} available
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-base hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Add to Cart
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="flex-1 py-3 bg-gold text-white rounded-xl font-bold text-base hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl"
                >
                  Buy Now
                </motion.button>
              </div>

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowShareMenu(!showShareMenu);
                  }}
                  className="w-full py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-sm text-gray-700 hover:border-gold hover:text-gold transition-all flex items-center justify-center gap-2"
                >
                  <ShareIcon className="w-4 h-4" />
                  Share this product
                </button>

                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full left-0 right-0 mt-2 p-3 bg-white rounded-xl shadow-2xl border border-gray-200 z-10"
                    >
                      <div className="grid grid-cols-4 gap-2">
                        {['Facebook', 'Twitter', 'WhatsApp', 'Copy Link'].map((platform) => (
                          <button
                            key={platform}
                            className="p-3 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700"
                          >
                            {platform}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Seller Info */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white font-bold text-base shadow-lg">
                    {product.seller.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{product.seller.name}</p>
                    <div className="flex items-center gap-1">
                      <StarIconSolid className="w-3 h-3 text-amber-400" />
                      <span className="text-xs font-semibold text-gray-700">{product.seller.rating}</span>
                      <span className="text-[10px] text-gray-500">({product.seller.totalSales.toLocaleString()} sales)</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/messages', { 
                    state: { 
                      sellerId: 'seller1',
                      sellerName: product.seller.name,
                      productName: product.title,
                      productImage: product.images[0]
                    } 
                  })}
                  className="px-3 py-1.5 bg-gold/10 text-gold rounded-lg font-semibold text-xs hover:bg-gold/20 transition-colors flex items-center gap-1.5"
                >
                  <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                  Chat
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <ClockIcon className="w-3.5 h-3.5" />
                <span>Response time: {product.seller.responseTime}</span>
              </div>
            </div>

            {/* Key Features */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-gold" />
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-2 text-xs text-gray-700"
                  >
                    <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          {/* Tab Headers */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex gap-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'reviews', label: `Reviews (${product.reviewCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`pb-3 text-sm font-bold transition-all relative ${
                    selectedTab === tab.id
                      ? 'text-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                  {selectedTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gold rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {selectedTab === 'description' && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {product.description}
                  </p>
                  
                  {product.tags && product.tags.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TagIcon className="w-4 h-4 text-gold" />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gold/10 border border-gray-200 hover:border-gold/30 text-xs font-medium text-gray-700 hover:text-gold transition-all cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl bg-white border border-gray-200 hover:border-gold/50 hover:shadow-md transition-all"
                    >
                      <p className="text-xs font-medium text-gray-500 mb-1">{key}</p>
                      <p className="text-base font-bold text-gray-900">{value}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Overall Rating */}
                      <div className="text-center md:border-r border-amber-200">
                        <p className="text-6xl font-extrabold text-gray-900 mb-2">{product.rating}</p>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <StarIconSolid
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 font-medium">
                          Based on {product.reviewCount.toLocaleString()} reviews
                        </p>
                      </div>

                      {/* Rating Breakdown */}
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const percentage = star === 5 ? 78 : star === 4 ? 15 : star === 3 ? 5 : star === 2 ? 1 : 1;
                          return (
                            <div key={star} className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-700 w-12">{star} star</span>
                              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ delay: star * 0.1, duration: 0.5 }}
                                  className="h-full bg-amber-400 rounded-full"
                                />
                              </div>
                              <span className="text-xs font-semibold text-gray-600 w-10 text-right">{percentage}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {product.reviews.map((review, idx) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={review.avatar}
                            alt={review.user}
                            className="w-12 h-12 rounded-full border-2 border-gold/30"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-gray-900">{review.user}</p>
                                  {review.verified && (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-300">
                                      ✓ Verified Purchase
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{review.date}</p>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <StarIconSolid
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? 'text-amber-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                            <button className="text-sm text-gray-500 hover:text-gold transition-colors">
                              👍 Helpful ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {RELATED_PRODUCTS.map((related, idx) => (
              <motion.div
                key={related.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/product/${related.id}`)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gold hover:shadow-xl transition-all"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={related.image}
                    alt={related.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-xs text-gray-900 mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                    {related.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-gray-900">${related.price}</span>
                    <div className="flex items-center gap-1">
                      <StarIconSolid className="w-3 h-3 text-amber-400" />
                      <span className="text-xs font-semibold text-gray-600">{related.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Image Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              onClick={() => setIsLightboxOpen(false)}
            >
              <XMarkIcon className="w-7 h-7 text-white" />
            </motion.button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full">
              <span className="text-white font-semibold text-lg">
                {selectedImage + 1} / {product.images.length}
              </span>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center p-20">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={`${product.title} - Image ${selectedImage + 1}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviousImage();
                    }}
                    className="absolute left-8 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all hover:scale-110"
                  >
                    <ChevronLeftIcon className="w-7 h-7 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-8 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all hover:scale-110"
                  >
                    <ChevronRightIcon className="w-7 h-7 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip at Bottom */}
            {product.images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-3xl">
                <div className="flex gap-3 overflow-x-auto pb-2 px-4 scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(index);
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        index === selectedImage
                          ? 'border-gold scale-110 ring-2 ring-gold/50'
                          : 'border-white/30 opacity-50 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Keyboard Hint */}
            <div className="absolute bottom-8 right-8 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full">
              <span className="text-white text-sm">Use ← → to navigate</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;

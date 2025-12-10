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
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import ReviewForm from '../components/ReviewForm';
import { useGetProductByIdQuery, useGetRelatedProductsQuery } from '../api/productsApi';
import { useGetProductReviewsQuery } from '../../../reviews/api/reviewsApi';
import { 
  useGetWishlistQuery, 
  useAddToWishlistMutation, 
  useRemoveFromWishlistMutation 
} from '../../wishlist/api/wishlistApi';
import {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} from '../../cart/api/cartApi';
import type { Product, ProductImage, SellerInfo } from '../types/product.types';
import type { Review } from '../../../reviews/types/review.types';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // API Queries
  const { data: productResponse, isLoading, isError, error } = useGetProductByIdQuery(id!, {
    skip: !id,
  });
  const { data: relatedProductsResponse } = useGetRelatedProductsQuery(
    { productId: id!, limit: 4 },
    { skip: !id }
  );
  const { data: reviewsResponse } = useGetProductReviewsQuery(
    { productId: id!, page: 1, limit: 5 },
    { skip: !id }
  );

  // Wishlist state and mutations
  const { data: wishlistData } = useGetWishlistQuery();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  
  // Local loading state for wishlist (more reliable than mutation's isLoading)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Cart state and mutations
  const { data: cartData } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  
  // Local loading state for cart
  const [isCartLoading, setIsCartLoading] = useState(false);

  // Check if product is in wishlist from server data
  const serverIsInWishlist = wishlistData?.products?.some((item) => {
    const productId = typeof item.productId === 'string' ? item.productId : item.productId._id;
    return productId === id;
  }) ?? false;

  // Check if product is in cart from server data
  const serverIsInCart = cartData?.items?.some((item) => {
    const productId = typeof item.productId === 'string' ? item.productId : item.productId._id;
    return productId === id;
  }) ?? false;

  // Optimistic local state for wishlist (provides instant feedback)
  const [optimisticWishlist, setOptimisticWishlist] = useState<boolean | null>(null);
  
  // Optimistic local state for cart
  const [optimisticCart, setOptimisticCart] = useState<boolean | null>(null);
  
  // Use optimistic state if set, otherwise use server state
  const isInWishlist = optimisticWishlist !== null ? optimisticWishlist : serverIsInWishlist;
  const isInCart = optimisticCart !== null ? optimisticCart : serverIsInCart;

  // Only clear optimistic state when server confirms the expected value
  useEffect(() => {
    if (optimisticWishlist !== null && serverIsInWishlist === optimisticWishlist) {
      setOptimisticWishlist(null);
    }
  }, [serverIsInWishlist, optimisticWishlist]);

  // Only clear optimistic cart state when server confirms the expected value
  useEffect(() => {
    if (optimisticCart !== null && serverIsInCart === optimisticCart) {
      setOptimisticCart(null);
    }
  }, [serverIsInCart, optimisticCart]);

  // Local State
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Extract data from responses
  const product = productResponse?.data;
  const relatedProducts = relatedProductsResponse?.data || [];
  const reviews = reviewsResponse?.data || [];
  const reviewStats = reviewsResponse?.ratingDistribution || [];

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Helper functions to normalize data
  const getProductImages = (): string[] => {
    if (!product?.images || product.images.length === 0) {
      return ['https://via.placeholder.com/800x800?text=No+Image'];
    }
    return product.images.map((img) => {
      if (typeof img === 'string') return img;
      return (img as ProductImage).url;
    });
  };

  const getPrice = (): number => {
    return product?.pricing?.salePrice || product?.pricing?.basePrice || product?.price || 0;
  };

  const getOriginalPrice = (): number | undefined => {
    if (product?.pricing?.salePrice && product?.pricing?.basePrice) {
      return product.pricing.basePrice;
    }
    return product?.pricing?.compareAtPrice;
  };

  const getDiscount = (): number => {
    const salePrice = product?.pricing?.salePrice;
    const basePrice = product?.pricing?.basePrice || product?.price;
    
    if (salePrice && basePrice && salePrice < basePrice) {
      return Math.round(((basePrice - salePrice) / basePrice) * 100);
    }
    
    if (product?.discount?.isActive && product?.discount?.percentage) {
      return product.discount.percentage;
    }
    
    return 0;
  };

  const getStock = (): number => {
    return product?.inventory?.availableQuantity ?? product?.inventory?.stockQuantity ?? product?.stockQuantity ?? 0;
  };

  const getSeller = (): { name: string; rating: number; totalSales: number; responseTime: string } => {
    const sellerData = product?.sellerId as SellerInfo | undefined;
    return {
      name: sellerData?.businessName || product?.sellerInfo?.name || 'Unknown Seller',
      rating: sellerData?.metrics?.averageRating || product?.sellerInfo?.rating || 0,
      totalSales: sellerData?.metrics?.totalSales || 0,
      responseTime: '< 1 hour',
    };
  };

  const getRating = (): number => {
    return product?.analytics?.averageRating || product?.averageRating || 0;
  };

  const getReviewCount = (): number => {
    return product?.analytics?.totalReviews || product?.totalReviews || 0;
  };

  const getSoldCount = (): number => {
    return product?.analytics?.totalSold || product?.totalSold || 0;
  };

  const getSpecifications = (): Record<string, any> => {
    if (product?.specifications) {
      // Convert Map to object if needed
      if (product.specifications instanceof Map) {
        return Object.fromEntries(product.specifications);
      }
      return product.specifications;
    }
    return {};
  };

  const getCategoryName = (): string => {
    if (typeof product?.category === 'string') {
      return product.category;
    }
    if (typeof product?.category === 'object' && product.category !== null) {
      return (product.category as any).name || 'Uncategorized';
    }
    return product?.categoryNames?.[0] || 'Uncategorized';
  };

  // Computed values
  const images = getProductImages();
  const price = getPrice();
  const originalPrice = getOriginalPrice();
  const discount = getDiscount();
  const stock = getStock();
  const seller = getSeller();
  const rating = getRating();
  const reviewCount = getReviewCount();
  const soldCount = getSoldCount();
  const specifications = getSpecifications();
  const categoryName = getCategoryName();

  const getConditionInfo = (condition?: string) => {
    const conditions: { [key: string]: { label: string; color: string; icon: string } } = {
      'new': { label: 'Brand New', color: 'bg-green-100 text-green-700 border-green-300', icon: '✨' },
      'refurbished': { label: 'Refurbished', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: '🔧' },
      'used_like_new': { label: 'Like New', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: '💎' },
      'used_good': { label: 'Good', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: '👍' },
      'used_acceptable': { label: 'Acceptable', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: '📦' },
    };
    return conditions[condition || 'new'] || conditions.new;
  };

  const conditionInfo = getConditionInfo(product?.condition);

  const handleAddToCart = async () => {
    if (!product || !id) return;
    
    if (stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }
    
    // If already in cart, toggle (remove)
    if (isInCart) {
      handleCartToggle();
      return;
    }
    
    // Add to cart with selected quantity
    setOptimisticCart(true);
    setIsCartLoading(true);
    
    try {
      await addToCart({ productId: id, quantity }).unwrap();
      toast.success(`Added ${quantity} item(s) to cart`);
    } catch (err: any) {
      setOptimisticCart(false);
      toast.error(err?.data?.message || 'Failed to add to cart');
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || !id) return;
    
    if (stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }
    
    // Add to cart first, then navigate to checkout
    try {
      if (!isInCart) {
        await addToCart({ productId: id, quantity }).unwrap();
      }
      navigate('/checkout');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to add to cart');
    }
  };

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = product?.title || 'Check out this product';
    
    switch (platform) {
      case 'Facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'Twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'WhatsApp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        break;
      case 'Copy Link':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        break;
    }
    setShowShareMenu(false);
  };

  const handleWishlistToggle = async () => {
    if (!product || !id) {
      console.log('[Wishlist] Missing product or id:', { product: !!product, id });
      return;
    }

    console.log('[Wishlist] Toggle clicked:', {
      productId: id,
      currentIsInWishlist: isInWishlist,
      serverIsInWishlist,
      optimisticWishlist,
    });

    // Capture current state before optimistic update
    const wasInWishlist = isInWishlist;
    const newWishlistState = !wasInWishlist;
    
    // Set optimistic state immediately for instant feedback
    setOptimisticWishlist(newWishlistState);
    setIsWishlistLoading(true);

    try {
      if (wasInWishlist) {
        console.log('[Wishlist] Removing from wishlist:', id);
        const result = await removeFromWishlist(id).unwrap();
        console.log('[Wishlist] Remove result:', result);
        toast.success('Removed from wishlist');
      } else {
        console.log('[Wishlist] Adding to wishlist:', id);
        const result = await addToWishlist(id).unwrap();
        console.log('[Wishlist] Add result:', result);
        toast.success('Added to wishlist');
      }
    } catch (err: any) {
      console.error('[Wishlist] Error:', err);
      // Revert optimistic update on error
      setOptimisticWishlist(wasInWishlist);
      const errorMessage = err?.data?.message || 'Failed to update wishlist';
      toast.error(errorMessage);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleCartToggle = async () => {
    if (!product || !id) {
      return;
    }

    // Capture current state before optimistic update
    const wasInCart = isInCart;
    const newCartState = !wasInCart;
    
    // Set optimistic state immediately for instant feedback
    setOptimisticCart(newCartState);
    setIsCartLoading(true);

    try {
      if (wasInCart) {
        await removeFromCart(id).unwrap();
        toast.success('Removed from cart');
      } else {
        await addToCart({ productId: id, quantity }).unwrap();
        toast.success('Added to cart');
      }
    } catch (err: any) {
      // Revert optimistic update on error
      setOptimisticCart(wasInCart);
      const errorMessage = err?.data?.message || 'Failed to update cart';
      toast.error(errorMessage);
    } finally {
      setIsCartLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // Error state
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error && 'data' in error && (error.data as any)?.message
              ? (error.data as any).message
              : 'Sorry, we couldn\'t find the product you\'re looking for.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold-dark transition-colors"
            >
              Home
            </button>
          </div>
        </motion.div>
      </div>
    );
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
              Product
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
                  src={images[selectedImage]}
                  alt={product.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x800?text=No+Image';
                  }}
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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlistToggle}
                disabled={isWishlistLoading}
                className="absolute top-6 right-6 p-4 rounded-full bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all disabled:opacity-70"
              >
                <AnimatePresence mode="wait">
                  {isWishlistLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                  ) : isInWishlist ? (
                    <motion.div
                      key="wishlisted"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 500, 
                        damping: 15,
                        mass: 0.5
                      }}
                    >
                      <HeartIconSolid className="w-7 h-7 text-red-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="not-wishlisted"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <HeartIcon className="w-7 h-7 text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              >
                <ArrowsPointingOutIcon className="w-5 h-5 text-gray-700" />
              </button>

              {/* Navigation Arrows */}
              {images.length > 1 && (
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
              {images.length > 1 && (
                <div className="absolute bottom-6 left-6 px-3 py-2 bg-black/70 backdrop-blur-md rounded-lg">
                  <span className="text-sm font-medium text-white">
                    {selectedImage + 1} / {images.length}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, idx) => (
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
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/200x200?text=No+Image';
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            )}

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
                {product.brand && (
                  <>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <span className="text-gray-300">•</span>
                  </>
                )}
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
                          i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-base font-bold text-gray-900">{rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-600">({reviewCount.toLocaleString()} reviews)</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-semibold text-green-600">{soldCount.toLocaleString()}</span> sold
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-gold/5 via-white to-gold/10 border-2 border-gold/30">
              <div className="flex items-end gap-4 mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Price</p>
                  <p className="text-4xl font-extrabold text-gray-900">
                    ${price.toFixed(2)}
                  </p>
                </div>
                {originalPrice && originalPrice > price && (
                  <div className="pb-1">
                    <p className="text-xl font-bold text-gray-400 line-through">
                      ${originalPrice.toFixed(2)}
                    </p>
                    <p className="text-base font-bold text-green-600">
                      Save ${(originalPrice - price).toFixed(2)}!
                    </p>
                  </div>
                )}
              </div>

              {/* Stock Indicator */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                stock > 10 
                  ? 'bg-green-100 text-green-700' 
                  : stock > 0
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                <CheckCircleIcon className="w-4 h-4" />
                <span className="font-semibold text-xs">
                  {stock > 10 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'} 
                  {stock > 0 && ' - Order soon!'}
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
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    className="p-2.5 hover:bg-gray-50 transition-colors border-l-2 border-gray-200"
                    disabled={quantity >= stock}
                  >
                    <PlusIcon className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                <p className="text-xs text-gray-500">
                  {stock} available
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={stock === 0 || isCartLoading}
                  className={`flex-1 py-3 rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isInCart
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isCartLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ShoppingCartIcon className="w-5 h-5" />
                  )}
                  {stock === 0 ? 'Out of Stock' : isInCart ? 'In Cart' : 'Add to Cart'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={stock === 0}
                  className="flex-1 py-3 bg-gold text-white rounded-xl font-bold text-base hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                            onClick={() => handleShare(platform)}
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
                    {seller.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{seller.name}</p>
                    <div className="flex items-center gap-1">
                      <StarIconSolid className="w-3 h-3 text-amber-400" />
                      <span className="text-xs font-semibold text-gray-700">{seller.rating.toFixed(1)}</span>
                      {seller.totalSales > 0 && (
                        <span className="text-[10px] text-gray-500">({seller.totalSales.toLocaleString()} sales)</span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/messages', { 
                    state: { 
                      sellerId: typeof product.sellerId === 'string' ? product.sellerId : (product.sellerId as SellerInfo)?._id,
                      sellerName: seller.name,
                      productName: product.title,
                      productImage: images[0]
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
                <span>Response time: {seller.responseTime}</span>
              </div>
            </div>

            {/* Key Features */}
            {(product.features && product.features.length > 0) || (product.keyFeatures && product.keyFeatures.length > 0) ? (
              <div className="p-5 rounded-2xl bg-white border border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-gold" />
                  Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(product.keyFeatures || product.features || []).map((feature, idx) => (
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
            ) : null}
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
                { id: 'reviews', label: `Reviews (${reviewCount})` },
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
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                    {product.description}
                  </p>
                  
                  {product.shortDescription && product.shortDescription !== product.description && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-gray-700">{product.shortDescription}</p>
                    </div>
                  )}
                  
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
                <div>
                  {Object.keys(specifications).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(specifications).map(([key, value]) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 rounded-xl bg-white border border-gray-200 hover:border-gold/50 hover:shadow-md transition-all"
                        >
                          <p className="text-xs font-medium text-gray-500 mb-1">{key}</p>
                          <p className="text-base font-bold text-gray-900">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No specifications available for this product.</p>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Write Review Button - Only show if not already showing form */}
                  {!showReviewForm && reviews.length > 0 && (
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowReviewForm(true)}
                        className="px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl font-bold text-sm hover:shadow-xl transition-all flex items-center gap-2"
                      >
                        <StarIconSolid className="w-5 h-5" />
                        Write a Review
                      </motion.button>
                    </div>
                  )}

                  {/* Review Form */}
                  <AnimatePresence>
                    {showReviewForm && (
                      <ReviewForm
                        productId={id!}
                        productName={product.title}
                        onSuccess={() => {
                          setShowReviewForm(false);
                          // Reviews will auto-refresh due to RTK Query cache invalidation
                        }}
                        onCancel={() => setShowReviewForm(false)}
                      />
                    )}
                  </AnimatePresence>

                  {/* Review Summary */}
                  {!showReviewForm && (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Overall Rating */}
                      <div className="text-center md:border-r border-amber-200">
                        <p className="text-6xl font-extrabold text-gray-900 mb-2">{rating.toFixed(1)}</p>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <StarIconSolid
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 font-medium">
                          Based on {reviewCount.toLocaleString()} reviews
                        </p>
                      </div>

                      {/* Rating Breakdown */}
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const dist = reviewStats.find((r) => r._id === star);
                          const count = dist?.count || 0;
                          const percentage = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
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
                  )}

                  {/* Individual Reviews */}
                  {!showReviewForm && reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review, idx) => (
                        <motion.div
                          key={review._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={review.userId.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userId.name)}&background=D4AF37&color=fff`}
                              alt={review.userId.name}
                              className="w-12 h-12 rounded-full border-2 border-gold/30"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userId.name)}&background=D4AF37&color=fff`;
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-gray-900">{review.userId.name}</p>
                                    {review.verifiedPurchase && (
                                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-300">
                                        ✓ Verified Purchase
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </p>
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
                              {review.title && (
                                <p className="font-semibold text-gray-900 mb-1">{review.title}</p>
                              )}
                              <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                              {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 mb-3">
                                  {review.images.map((img, imgIdx) => (
                                    <img
                                      key={imgIdx}
                                      src={img}
                                      alt={`Review ${imgIdx + 1}`}
                                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                              <button className="text-sm text-gray-500 hover:text-gold transition-colors">
                                👍 Helpful ({review.helpful})
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {reviewCount > 5 && (
                        <div className="text-center pt-4">
                          <button
                            onClick={() => navigate(`/products/${id}/reviews`)}
                            className="px-6 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold-dark transition-colors"
                          >
                            View All {reviewCount} Reviews
                          </button>
                        </div>
                      )}
                    </div>
                  ) : !showReviewForm ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16"
                    >
                      <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-amber-200">
                        <StarIconSolid className="w-12 h-12 text-amber-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">No reviews yet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Be the first to share your experience with this product and help other shoppers make informed decisions!
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowReviewForm(true)}
                        className="px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all inline-flex items-center gap-3"
                      >
                        <StarIconSolid className="w-6 h-6" />
                        Write the First Review
                      </motion.button>
                    </motion.div>
                  ) : null}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20"
          >
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((related, idx) => {
                const relatedPrice = related.pricing?.salePrice || related.pricing?.basePrice || related.price || 0;
                const relatedRating = related.analytics?.averageRating || related.averageRating || 0;
                const relatedImage = Array.isArray(related.images) && related.images.length > 0 
                  ? (typeof related.images[0] === 'string' ? related.images[0] : (related.images[0] as ProductImage).url)
                  : related.primaryImage || 'https://via.placeholder.com/400x400?text=No+Image';
                
                return (
                  <motion.div
                    key={related._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate(`/product/${related._id}`)}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gold hover:shadow-xl transition-all"
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={relatedImage}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-xs text-gray-900 mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                        {related.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-extrabold text-gray-900">${relatedPrice.toFixed(2)}</span>
                        <div className="flex items-center gap-1">
                          <StarIconSolid className="w-3 h-3 text-amber-400" />
                          <span className="text-xs font-semibold text-gray-600">{relatedRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
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
                {selectedImage + 1} / {images.length}
              </span>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center p-20">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={`${product.title} - Image ${selectedImage + 1}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x800?text=No+Image';
                  }}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && (
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
            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-3xl">
                <div className="flex gap-3 overflow-x-auto pb-2 px-4 scrollbar-hide">
                  {images.map((image, index) => (
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
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/200x200?text=No+Image';
                        }}
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

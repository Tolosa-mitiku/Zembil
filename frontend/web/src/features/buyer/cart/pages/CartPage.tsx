import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  HeartIcon,
  ShoppingBagIcon,
  TagIcon,
  TruckIcon,
  LockClosedIcon,
  ArrowRightIcon,
  XMarkIcon,
  SparklesIcon,
  GiftIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { toast } from 'react-hot-toast';

// API hooks
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  CartItem,
  CartProduct,
} from '../api/cartApi';
import { useAddToWishlistMutation } from '../../wishlist/api/wishlistApi';

// ============= HELPER FUNCTIONS =============

const getProductDetails = (item: CartItem) => {
  const product = item.productId;

  if (typeof product === 'string') {
    // Not populated - use cached data
    return {
      id: product,
      title: item.title || 'Product',
      image: item.image || '',
      price: item.price || 0,
      originalPrice: undefined as number | undefined,
      maxQuantity: 99,
      inStock: true,
      seller: 'Seller',
    };
  }

  // Populated product
  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
  const salePrice = product.pricing?.salePrice;
  const basePrice = product.pricing?.basePrice || item.price || 0;
  const price = salePrice || basePrice;
  const originalPrice = salePrice && salePrice < basePrice ? basePrice : undefined;
  const availableQty = product.inventory?.availableQuantity ?? product.inventory?.stockQuantity ?? 99;

  return {
    id: product._id,
    title: product.title || item.title || 'Product',
    image: mainImage?.url || item.image || '',
    price,
    originalPrice,
    maxQuantity: Math.max(availableQty, item.quantity),
    inStock: product.status === 'active' && availableQty > 0,
    seller: 'Seller', // Could be populated if backend includes seller info
  };
};

const getConditionLabel = (condition: string) => {
  const labels: { [key: string]: string } = {
    'new': 'Brand New',
    'mint': 'Like New',
    'excellent': 'Excellent',
    'good': 'Good',
  };
  return labels[condition] || 'New';
};

// Loading skeleton component
const CartItemSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 animate-pulse">
    <div className="p-6">
      <div className="flex gap-6">
        <div className="w-32 h-32 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
            <div className="h-5 w-12 bg-gray-200 rounded-full" />
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-10 w-32 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Recommended products (still mock for now - could be API driven in future)
const RECOMMENDED_PRODUCTS = [
  {
    id: 10,
    name: "USB-C Charging Cable",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=300",
    rating: 4.7,
  },
  {
    id: 11,
    name: "Wireless Mouse",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=300",
    rating: 4.5,
  },
  {
    id: 12,
    name: "Laptop Stand",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=300",
    rating: 4.8,
  },
  {
    id: 13,
    name: "Phone Holder",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=300",
    rating: 4.6,
  },
];

const CartPage = () => {
  const navigate = useNavigate();
  
  // API hooks
  const { data: cart, isLoading, isError, refetch } = useGetCartQuery();
  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  
  // Local state
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  // Get cart items from API response
  const cartItems = cart?.items || [];

  // Handle quantity update with debouncing
  const handleUpdateQuantity = useCallback(async (productId: string, newQuantity: number) => {
    if (newQuantity < 1 || pendingUpdates.has(productId)) return;
    
    setPendingUpdates(prev => new Set(prev).add(productId));
    
    try {
      await updateCartItem({ productId, quantity: newQuantity }).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update quantity');
    } finally {
      setPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }, [updateCartItem, pendingUpdates]);

  // Handle remove item
  const handleRemoveItem = useCallback(async (productId: string) => {
    try {
      await removeFromCart(productId).unwrap();
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to remove item');
    }
  }, [removeFromCart]);

  // Handle move to wishlist
  const handleMoveToWishlist = useCallback(async (productId: string) => {
    try {
      await addToWishlist(productId).unwrap();
      await removeFromCart(productId).unwrap();
      toast.success('Item moved to wishlist');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to move item');
    }
  }, [addToWishlist, removeFromCart]);

  // Handle clear all
  const handleClearAll = useCallback(async () => {
    try {
      await clearCart().unwrap();
      setAppliedPromo(null);
      setShowClearConfirm(false);
      toast.success('Cart cleared');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to clear cart');
    }
  }, [clearCart]);

  // Apply promo code (mock for now - could be API driven)
  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setAppliedPromo({ code: promoCode, discount: 10 });
      setPromoCode('');
      toast.success('Promo code applied!');
    } else if (promoCode.toUpperCase() === 'WELCOME20') {
      setAppliedPromo({ code: promoCode, discount: 20 });
      setPromoCode('');
      toast.success('Promo code applied!');
    } else {
      toast.error('Invalid promo code');
    }
  };

  // Calculate totals
  const { subtotal, savings } = useMemo(() => {
    let subtotal = 0;
    let savings = 0;

    cartItems.forEach((item) => {
      const details = getProductDetails(item);
      subtotal += details.price * item.quantity;
      if (details.originalPrice) {
        savings += (details.originalPrice - details.price) * item.quantity;
      }
    });

    return { subtotal, savings };
  }, [cartItems]);

  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount / 100) : 0;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = (subtotal - promoDiscount) * 0.08; // 8% tax
  const total = subtotal - promoDiscount + shipping + tax;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map(i => <CartItemSkeleton key={i} />)}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl h-96 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-red-50 flex items-center justify-center">
            <ExclamationCircleIcon className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-500 mb-8">
            We couldn't load your cart. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-8 py-4 bg-gold text-white rounded-2xl font-bold hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center">
            <ShoppingBagIcon className="w-16 h-16 text-gold" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added anything to your cart yet. Start shopping to find amazing products!
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gold text-white rounded-2xl font-bold hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
            <div className="flex items-center gap-3">
              {cartItems.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={isClearing}
                  className="text-gray-500 hover:text-red-500 font-semibold text-xs transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  <TrashIcon className="w-4 h-4" />
                  Clear All
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gold font-semibold text-sm transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left 2/3 */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item, index) => {
                const details = getProductDetails(item);
                const isPending = pendingUpdates.has(details.id);
                
                return (
                  <motion.div
                    key={details.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                    onClick={() => navigate(`/product/${details.id}`)}
                    className={clsx(
                      "bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group cursor-pointer",
                      isPending && "opacity-70"
                    )}
                  >
                    <div className="p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div 
                          className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 group/image"
                        >
                          <img
                            src={details.image || 'https://via.placeholder.com/128?text=No+Image'}
                            alt={details.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=No+Image';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 
                                  className="font-bold text-base text-gray-900 mb-1 group-hover:text-gold transition-colors line-clamp-2"
                                >
                                  {details.title}
                                </h3>
                                <p className="text-xs text-gray-600 mb-2">
                                  Sold by <span className="font-semibold text-gray-900">{details.seller}</span>
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-300">
                                    {getConditionLabel('new')}
                                  </span>
                                  {details.inStock ? (
                                    <span className="text-[10px] font-medium text-green-600">In Stock</span>
                                  ) : (
                                    <span className="text-[10px] font-medium text-red-600">Out of Stock</span>
                                  )}
                                </div>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveItem(details.id);
                                }}
                                disabled={isRemoving}
                                className="p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-600 transition-all disabled:opacity-50"
                                title="Remove from cart"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* Bottom Section: Price & Quantity */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-extrabold text-gray-900">
                                  ${(details.price * item.quantity).toFixed(2)}
                                </span>
                                {details.originalPrice && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ${(details.originalPrice * item.quantity).toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-500 mt-0.5">
                                ${details.price.toFixed(2)} each
                              </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveToWishlist(details.id);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/save"
                                title="Save for later"
                              >
                                <HeartIcon className="w-5 h-5 text-gray-400 group-hover/save:text-red-500 transition-colors" />
                              </button>

                              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => handleUpdateQuantity(details.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || isPending}
                                  className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <MinusIcon className="w-4 h-4 text-gray-600" />
                                </button>
                                <span className="px-4 py-2 font-bold text-gray-900 min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(details.id, item.quantity + 1)}
                                  disabled={item.quantity >= details.maxQuantity || isPending}
                                  className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <PlusIcon className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Promo Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-4">
                <TagIcon className="w-4 h-4 text-gold" />
                <h3 className="font-bold text-sm text-gray-900">Have a promo code?</h3>
              </div>
              
              {appliedPromo ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-300 rounded-xl">
                  <div className="flex items-center gap-2">
                    <GiftIcon className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-bold text-green-900 text-sm">{appliedPromo.code}</p>
                      <p className="text-xs text-green-700">-{appliedPromo.discount}% discount applied</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAppliedPromo(null)}
                    className="p-1 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-green-700" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/10 transition-all text-sm font-medium"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={!promoCode.trim()}
                    className={clsx(
                      'px-6 py-3 rounded-xl font-bold text-sm transition-all',
                      promoCode.trim()
                        ? 'bg-gray-900 text-white hover:bg-gold shadow-md hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    Apply
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary - Right 1/3 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 bg-gradient-to-br from-gold/10 via-white to-white border-b-2 border-gray-200">
                  <h2 className="text-xl font-extrabold text-gray-900 mb-1">Order Summary</h2>
                  <p className="text-xs text-gray-600">{cartItems.length} items</p>
                </div>

                {/* Price Breakdown */}
                <div className="p-5 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600 font-medium">Savings</span>
                      <span className="font-bold text-green-600">-${savings.toFixed(2)}</span>
                    </div>
                  )}

                  {appliedPromo && (
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600 font-medium">Promo ({appliedPromo.code})</span>
                      <span className="font-bold text-green-600">-${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 flex items-center gap-1">
                      Shipping
                      {shipping === 0 && <span className="text-[10px] font-bold text-green-600">(FREE)</span>}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t-2 border-gray-200">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-base font-bold text-gray-900">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-gray-900">
                          ${total.toFixed(2)}
                        </span>
                        {(savings > 0 || promoDiscount > 0) && (
                          <p className="text-[10px] text-green-600 font-semibold mt-1">
                            You saved ${(savings + promoDiscount).toFixed(2)}!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Free Shipping Progress */}
                  {shipping > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TruckIcon className="w-4 h-4 text-blue-600" />
                        <p className="text-xs font-bold text-blue-900">
                          Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                        </p>
                      </div>
                      <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          className="h-full bg-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/checkout')}
                    disabled={cartItems.length === 0}
                    className="w-full py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to Checkout
                    <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <LockClosedIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-gray-700">Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <ClockIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-gray-700">Easy Returns</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <SparklesIcon className="w-7 h-7 text-gold" />
              You Might Also Like
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {RECOMMENDED_PRODUCTS.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/product/${product.id}`)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gold hover:shadow-xl transition-all"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic
                    }}
                    className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-gold hover:text-white"
                  >
                    <ShoppingBagIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-xs text-gray-900 mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-gray-900">${product.price}</span>
                    <div className="flex items-center gap-1">
                      <StarIconSolid className="w-3 h-3 text-amber-400" />
                      <span className="text-xs font-semibold text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Clear All Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearConfirm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <TrashIcon className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Clear Cart?</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to remove all {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} from your cart?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      disabled={isClearing}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearAll}
                      disabled={isClearing}
                      className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg disabled:opacity-50"
                    >
                      {isClearing ? 'Clearing...' : 'Clear All'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;

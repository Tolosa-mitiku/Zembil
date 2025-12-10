/**
 * Wishlist Page - Integrated with Backend API
 * Product cards styled to match homepage ProductCard component
 */

import {
  ArrowPathIcon,
  ArrowsUpDownIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  StarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  WishlistProduct,
  useClearWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../api/wishlistApi";

type SortOption = "recent" | "price-low" | "price-high" | "name";

// Helper: Check if string is a MongoDB ObjectId (24 hex characters)
const isObjectId = (str: string): boolean => {
  return /^[a-f\d]{24}$/i.test(str);
};

// Helper: Extract category name from product (handles both string and populated object)
const getCategoryName = (product: WishlistProduct): string => {
  const category = product.category;
  if (!category) return "General";
  if (typeof category === "string") {
    // If it's an ObjectId, don't show it
    if (isObjectId(category)) {
      return "General";
    }
    return category;
  }
  // Handle populated category object
  if (typeof category === "object" && category !== null) {
    const catObj = category as { name?: string };
    if (catObj.name) return catObj.name;
  }
  return "General";
};

// Helper: Get product image URL
const getProductImage = (product: WishlistProduct): string => {
  if (!product.images || product.images.length === 0) {
    return "/placeholder-product.jpg";
  }
  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];
  return mainImage?.url || "/placeholder-product.jpg";
};

// Helper: Get current price (considering sales and discounts)
const getPrice = (product: WishlistProduct): number => {
  const basePrice = product.pricing?.basePrice || 0;
  const salePrice = product.pricing?.salePrice;

  // If there's an explicit sale price, use it
  if (salePrice && salePrice > 0 && salePrice < basePrice) {
    return salePrice;
  }

  // Check if there's an active discount
  if (product.discount?.isActive) {
    if (product.discount.percentage && product.discount.percentage > 0) {
      return basePrice * (1 - product.discount.percentage / 100);
    }
    if (product.discount.value && product.discount.value > 0) {
      return Math.max(0, basePrice - product.discount.value);
    }
  }

  return basePrice;
};

// Helper: Get original price (before any discounts)
const getOriginalPrice = (product: WishlistProduct): number | undefined => {
  const basePrice = product.pricing?.basePrice || 0;
  const compareAtPrice = product.pricing?.compareAtPrice;
  const salePrice = product.pricing?.salePrice;

  // Use compareAtPrice if available and higher than base price
  if (compareAtPrice && compareAtPrice > basePrice) {
    return compareAtPrice;
  }

  // If there's a sale price lower than base price, base price is original
  if (salePrice && salePrice > 0 && salePrice < basePrice) {
    return basePrice;
  }

  // If there's an active discount, base price is original
  if (product.discount?.isActive) {
    if (
      (product.discount.percentage && product.discount.percentage > 0) ||
      (product.discount.value && product.discount.value > 0)
    ) {
      return basePrice;
    }
  }

  return undefined;
};

// Helper: Calculate discount percentage
const getDiscountPercentage = (product: WishlistProduct): number => {
  const originalPrice = getOriginalPrice(product);
  const currentPrice = getPrice(product);

  if (originalPrice && originalPrice > currentPrice && originalPrice > 0) {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  // Check explicit discount percentage
  if (product.discount?.isActive && product.discount.percentage) {
    return Math.round(product.discount.percentage);
  }

  return 0;
};

// Helper: Get stock quantity
const getStock = (product: WishlistProduct): number => {
  return (
    product.inventory?.availableQuantity ??
    product.inventory?.stockQuantity ??
    0
  );
};

// Helper: Get average rating
const getRating = (product: WishlistProduct): number => {
  return product.analytics?.averageRating || 0;
};

// Helper: Get total reviews count
const getReviewCount = (product: WishlistProduct): number => {
  return product.analytics?.totalReviews || 0;
};

// Helper: Calculate total savings for a product
const getProductSavings = (product: WishlistProduct): number => {
  const originalPrice = getOriginalPrice(product);
  const currentPrice = getPrice(product);

  if (originalPrice && originalPrice > currentPrice) {
    return originalPrice - currentPrice;
  }
  return 0;
};

const WishlistPage = () => {
  const navigate = useNavigate();

  // Fetch wishlist from backend
  const {
    data: wishlist,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetWishlistQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Mutations
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation();
  const [clearWishlist, { isLoading: isClearing }] = useClearWishlistMutation();
  
  // Track which item is currently being removed (for spinner)
  const [removingProductId, setRemovingProductId] = useState<string | null>(null);

  // Local state for UI controls
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const sortOptions = [
    { value: "recent" as const, label: "Recently Added", icon: ClockIcon },
    {
      value: "price-low" as const,
      label: "Price: Low to High",
      icon: ArrowsUpDownIcon,
    },
    {
      value: "price-high" as const,
      label: "Price: High to Low",
      icon: ArrowsUpDownIcon,
    },
    { value: "name" as const, label: "Name A-Z", icon: TagIcon },
  ];

  // Process wishlist items
  const validWishlistItems = useMemo(() => {
    if (!wishlist?.products) return [];

    return wishlist.products
      .filter((item) => {
        const product = item.productId as WishlistProduct;
        return product && product._id && product.title;
      })
      .map((item) => ({
        product: item.productId as WishlistProduct,
        productId: (item.productId as WishlistProduct)._id,
        addedAt: item.addedAt,
        priceAtAdd: item.priceAtAdd,
      }));
  }, [wishlist]);

  // Get unique categories (excluding ObjectIds) - reuse getCategoryName helper
  const categories = useMemo(() => {
    const cats = validWishlistItems
      .map((item) => getCategoryName(item.product))
      .filter((cat) => cat !== "General");

    const uniqueCats = Array.from(new Set(cats));
    return ["all", ...uniqueCats];
  }, [validWishlistItems]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return validWishlistItems
      .filter((item) => {
        const product = item.product;
        if (!product) return false;
        const categoryName = getCategoryName(product);
        const matchesCategory =
          selectedCategory === "all" || categoryName === selectedCategory;
        const matchesSearch =
          product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          categoryName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return getPrice(a.product) - getPrice(b.product);
          case "price-high":
            return getPrice(b.product) - getPrice(a.product);
          case "name":
            return (a.product.title || "").localeCompare(b.product.title || "");
          case "recent":
          default:
            return (
              new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
            );
        }
      });
  }, [validWishlistItems, selectedCategory, searchQuery, sortBy]);

  // Calculate total savings across all wishlist items
  const totalSavings = useMemo(() => {
    return validWishlistItems.reduce((sum, item) => {
      return sum + getProductSavings(item.product);
    }, 0);
  }, [validWishlistItems]);

  // Handlers
  const handleRemoveFromWishlist = async (
    e: React.MouseEvent,
    productId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setRemovingProductId(productId);
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove from wishlist");
    } finally {
      setRemovingProductId(null);
    }
  };

  const handleClearWishlist = async () => {
    if (
      !window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      return;
    }
    try {
      await clearWishlist().unwrap();
      toast.success("Wishlist cleared");
    } catch (err) {
      toast.error("Failed to clear wishlist");
    }
  };

  const handleAddToCart = (e: React.MouseEvent, _productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement add to cart functionality
    toast.success("Added to cart");
  };

  const handleImageLoad = (productId: string) => {
    setLoadedImages((prev) => new Set(prev).add(productId));
  };

  // Shimmer skeleton component for product cards
  const ProductCardSkeleton = ({ index }: { index: number }) => (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden border border-grey-200"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image skeleton */}
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 animate-shimmer bg-[length:200%_100%]" />
        {/* Discount badge skeleton */}
        <div
          className="absolute top-3 left-3 w-14 h-6 bg-gradient-to-r from-grey-300 via-grey-200 to-grey-300 rounded-full animate-shimmer bg-[length:200%_100%]"
          style={{ animationDelay: `${index * 0.05 + 0.1}s` }}
        />
        {/* Heart button skeleton */}
        <div
          className="absolute top-3 right-3 w-9 h-9 bg-gradient-to-r from-grey-300 via-grey-200 to-grey-300 rounded-full animate-shimmer bg-[length:200%_100%]"
          style={{ animationDelay: `${index * 0.05 + 0.15}s` }}
        />
      </div>
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category & Rating row */}
        <div className="flex items-center justify-between">
          <div
            className="h-3 w-20 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded animate-shimmer bg-[length:200%_100%]"
            style={{ animationDelay: `${index * 0.05 + 0.2}s` }}
          />
          <div className="flex items-center gap-1">
            <div
              className="w-3.5 h-3.5 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded animate-shimmer bg-[length:200%_100%]"
              style={{ animationDelay: `${index * 0.05 + 0.25}s` }}
            />
            <div
              className="h-3 w-8 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded animate-shimmer bg-[length:200%_100%]"
              style={{ animationDelay: `${index * 0.05 + 0.25}s` }}
            />
          </div>
        </div>
        {/* Title - two lines */}
        <div className="space-y-2">
          <div
            className="h-4 w-full bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded animate-shimmer bg-[length:200%_100%]"
            style={{ animationDelay: `${index * 0.05 + 0.3}s` }}
          />
          <div
            className="h-4 w-2/3 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded animate-shimmer bg-[length:200%_100%]"
            style={{ animationDelay: `${index * 0.05 + 0.35}s` }}
          />
        </div>
        {/* Price row */}
        <div className="flex items-baseline gap-2 pt-1">
          <div
            className="h-6 w-16 bg-gradient-to-r from-grey-300 via-grey-200 to-grey-300 rounded animate-shimmer bg-[length:200%_100%]"
            style={{ animationDelay: `${index * 0.05 + 0.4}s` }}
          />
          <div
            className="h-4 w-12 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded animate-shimmer bg-[length:200%_100%]"
            style={{ animationDelay: `${index * 0.05 + 0.45}s` }}
          />
        </div>
        {/* Added date */}
        <div
          className="h-3 w-28 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded animate-shimmer bg-[length:200%_100%]"
          style={{ animationDelay: `${index * 0.05 + 0.5}s` }}
        />
      </div>
    </div>
  );

  // Loading state with shimmer skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-grey-50 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-8 w-40 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-lg animate-shimmer bg-[length:200%_100%] mb-2" />
                <div
                  className="h-4 w-48 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded animate-shimmer bg-[length:200%_100%]"
                  style={{ animationDelay: "0.1s" }}
                />
              </div>
              <div
                className="h-10 w-28 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-lg animate-shimmer bg-[length:200%_100%]"
                style={{ animationDelay: "0.15s" }}
              />
            </div>

            {/* Filters skeleton */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div
                className="flex-1 h-11 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-lg animate-shimmer bg-[length:200%_100%]"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="h-11 w-[180px] bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-lg animate-shimmer bg-[length:200%_100%]"
                style={{ animationDelay: "0.25s" }}
              />
            </div>

            {/* Category pills skeleton */}
            <div className="flex gap-2 mt-4 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-full animate-shimmer bg-[length:200%_100%] flex-shrink-0"
                  style={{
                    width: `${70 + (i % 3) * 25}px`,
                    animationDelay: `${0.3 + i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product grid skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, index) => (
              <ProductCardSkeleton key={index} index={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-grey-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-12 h-12 text-error" />
          </div>
          <h3 className="text-xl font-bold text-grey-900 mb-2">
            Failed to Load Wishlist
          </h3>
          <p className="text-grey-500 mb-6 max-w-md mx-auto">
            {(error as { data?: { message?: string } })?.data?.message ||
              "Something went wrong. Please try again."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-gold text-white rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (validWishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-grey-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
            <HeartIcon className="w-12 h-12 text-error" />
          </div>
          <h2 className="text-2xl font-bold text-grey-900 mb-3">
            Your wishlist is empty
          </h2>
          <p className="text-grey-500 mb-6">
            Save items you love to your wishlist and shop them later!
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gold text-white rounded-lg font-medium hover:bg-gold-dark transition-colors"
          >
            Discover Products
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-grey-50 pb-16"
      onClick={() => setIsSortOpen(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-grey-900 mb-1">
                My Wishlist
              </h1>
              <p className="text-sm text-grey-600">
                {validWishlistItems.length} item
                {validWishlistItems.length !== 1 ? "s" : ""} saved
                {totalSavings > 0 && (
                  <span className="ml-2 text-success font-medium">
                    • ${totalSavings.toFixed(2)} in savings
                  </span>
                )}
              </p>
            </div>

            {validWishlistItems.length > 0 && (
              <button
                onClick={handleClearWishlist}
                disabled={isClearing}
                className="px-4 py-2 text-error border border-error rounded-lg text-sm font-medium hover:bg-error hover:text-white transition-colors disabled:opacity-50"
              >
                {isClearing ? "Clearing..." : "Clear All"}
              </button>
            )}
          </div>

          {/* Filters */}
          <div
            className="flex flex-col sm:flex-row gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wishlist..."
                className="w-full pl-10 pr-4 py-2.5 border border-grey-300 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSortOpen(!isSortOpen);
                }}
                className="flex items-center gap-2 px-4 py-2.5 border border-grey-300 rounded-lg bg-white hover:border-grey-400 transition-all text-sm font-medium text-grey-700 min-w-[180px] justify-between"
              >
                <span>
                  {sortOptions.find((o) => o.value === sortBy)?.label}
                </span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-full bg-white border border-grey-200 rounded-lg shadow-heavy overflow-hidden z-20"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={clsx(
                          "w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors",
                          sortBy === option.value
                            ? "bg-gold/10 text-gold font-medium"
                            : "text-grey-700 hover:bg-grey-50"
                        )}
                      >
                        <span>{option.label}</span>
                        {sortBy === option.value && (
                          <CheckIcon className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Category Pills */}
          {categories.length > 2 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={clsx(
                    "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                    selectedCategory === cat
                      ? "bg-gold text-white"
                      : "bg-white border border-grey-300 text-grey-700 hover:border-gold"
                  )}
                >
                  {cat === "all" ? "All Items" : cat}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Grid - Matching Homepage ProductCard Style */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-grey-500">No items match your search</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => {
                const product = item.product;
                const productId = item.productId;
                const price = getPrice(product);
                const originalPrice = getOriginalPrice(product);
                const discount = getDiscountPercentage(product);
                const stock = getStock(product);
                const inStock = stock > 0;
                const rating = getRating(product);
                const reviewCount = getReviewCount(product);
                const isImageLoaded = loadedImages.has(productId);

                return (
                  <motion.div
                    key={productId}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.3,
                      x: 50,
                      rotate: 10,
                      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                    }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                  >
                    <Link to={`/product/${productId}`}>
                      <motion.div
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-white rounded-lg shadow-light hover:shadow-heavy transition-shadow duration-300 overflow-hidden group h-full flex flex-col"
                      >
                      {/* Image Container */}
                      <div className="relative aspect-square overflow-hidden bg-grey-100">
                        <motion.img
                          src={getProductImage(product)}
                          alt={product.title}
                          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                            isImageLoaded ? "opacity-100" : "opacity-0"
                          }`}
                          onLoad={() => handleImageLoad(productId)}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/400x400?text=No+Image";
                            handleImageLoad(productId);
                          }}
                          loading="lazy"
                        />

                        {/* Shimmer while loading */}
                        {!isImageLoaded && (
                          <div className="absolute inset-0 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 animate-shimmer bg-[length:200%_100%]" />
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {!inStock && (
                            <span className="px-2 py-1 bg-grey-900 text-white text-xs font-bold rounded-full">
                              OUT OF STOCK
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="px-2 py-1 bg-error text-white text-xs font-bold rounded-full">
                              -{discount}%
                            </span>
                          )}
                        </div>

                        {/* Remove from Wishlist Button */}
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.7, rotate: -15 }}
                          onClick={(e) =>
                            handleRemoveFromWishlist(e, productId)
                          }
                          disabled={removingProductId === productId}
                          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-medium hover:bg-error/10 hover:shadow-lg transition-all duration-200"
                        >
                          {removingProductId === productId ? (
                            <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <motion.div
                              whileTap={{ scale: 0.5 }}
                            >
                              <HeartIconSolid className="w-5 h-5 text-error" />
                            </motion.div>
                          )}
                        </motion.button>

                        {/* Quick Add to Cart - Shows on hover */}
                        {inStock && (
                          <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => handleAddToCart(e, productId)}
                            className="absolute bottom-3 left-3 right-3 py-2 bg-gold text-white rounded-lg font-medium flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gold-dark text-sm"
                          >
                            <ShoppingCartIcon className="w-4 h-4" />
                            Quick Add
                          </motion.button>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-3 sm:p-4 flex-1 flex flex-col">
                        {/* Category */}
                        <p className="text-xs text-grey-500 mb-1 uppercase tracking-wide">
                          {getCategoryName(product)}
                        </p>

                        {/* Title */}
                        <h3 className="text-sm font-semibold text-grey-900 mb-2 line-clamp-2 flex-1">
                          {product.title}
                        </h3>

                        {/* Rating */}
                        {rating > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(rating)
                                      ? "text-gold fill-gold"
                                      : "text-grey-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-grey-500">
                              ({reviewCount})
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base sm:text-lg font-bold text-gold">
                            ${price.toFixed(2)}
                          </span>
                          {originalPrice && (
                            <span className="text-xs text-grey-400 line-through">
                              ${originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Low Stock Warning */}
                        {stock > 0 && stock < 10 && (
                          <p className="text-xs text-warning mt-1 font-medium">
                            Only {stock} left!
                          </p>
                        )}
                      </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;

import { safeToast as toast } from "@/core/utils/toast-wrapper";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useAppSelector } from "@/store/hooks";
import {
  ArrowRightIcon,
  BoltIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  FireIcon,
  GiftIcon,
  HeartIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  SparklesIcon,
  StarIcon,
  TagIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Product,
  useGetBannersQuery,
  useGetCategoriesQuery,
  useGetFeaturedProductsQuery,
  useGetProductsQuery,
} from "../api/homeApi";
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/features/buyer/wishlist/api/wishlistApi";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} from "@/features/buyer/cart/api/cartApi";
import HomePageSkeleton from "../components/HomePageSkeleton";

// Fallback data for offline/error states
const FALLBACK_CATEGORIES = [
  {
    id: "all",
    name: "All",
    icon: TagIcon,
    color: "bg-gradient-to-br from-gray-600 to-gray-800",
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: SparklesIcon,
    color: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: BoltIcon,
    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
  },
  {
    id: "home",
    name: "Home",
    icon: ShoppingBagIcon,
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  {
    id: "beauty",
    name: "Beauty",
    icon: StarIcon,
    color: "bg-gradient-to-br from-purple-500 to-violet-600",
  },
  {
    id: "sports",
    name: "Sports",
    icon: FireIcon,
    color: "bg-gradient-to-br from-orange-500 to-red-600",
  },
  {
    id: "gifts",
    name: "Gifts",
    icon: GiftIcon,
    color: "bg-gradient-to-br from-yellow-500 to-amber-600",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
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
  const [featuredCarouselIndex, setFeaturedCarouselIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSwitchingCategory, setIsSwitchingCategory] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const previousCategory = useRef(selectedCategory);

  // API Queries
  const {
    data: featuredProducts = [],
    isLoading: featuredLoading,
    isError: featuredError,
  } = useGetFeaturedProductsQuery({ limit: 8 });

  const {
    data: categoriesData = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery({});

  const { data: bannersData = [], isLoading: bannersLoading } =
    useGetBannersQuery({ type: "hero" });

  const {
    data: productsResponse,
    isLoading: productsLoading,
    isFetching: productsFetching,
    isError: productsError,
    refetch: refetchProducts,
  } = useGetProductsQuery(
    {
      page: currentPage,
      limit: 12,
      ...(selectedCategory !== "all" && { category: selectedCategory }),
      status: "active",
    },
    {
      // Force refetch when switching categories to ensure fresh data
      refetchOnMountOrArgChange: true,
    }
  );

  const pagination = productsResponse?.pagination;

  // Update allProducts when new data arrives or when component mounts with cached data
  useEffect(() => {
    if (productsResponse?.data) {
      if (currentPage === 1) {
        // First page - replace all products
        setAllProducts(productsResponse.data);
        setLoadedImages(new Set()); // Reset loaded images
      } else {
        // Subsequent pages - append to existing products (no scroll manipulation)
        setAllProducts((prev) => [...prev, ...productsResponse.data]);
      }

      setIsLoadingMore(false);
      setIsSwitchingCategory(false); // Category switch complete
    }
  }, [productsResponse, currentPage]);

  // Safety check: Clear switching state if we have data but switching is stuck
  useEffect(() => {
    if (isSwitchingCategory && !productsFetching && !productsLoading && productsResponse?.data) {
      setIsSwitchingCategory(false);
    }
  }, [isSwitchingCategory, productsFetching, productsLoading, productsResponse]);

  // Reset to first page when category changes (but not on initial mount)
  useEffect(() => {
    // Skip the initial mount - don't mark as switching on first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Only mark as switching if category actually changed
    if (previousCategory.current !== selectedCategory) {
      previousCategory.current = selectedCategory;
      setIsSwitchingCategory(true); // Mark that we're switching
      setCurrentPage(1);
      setAllProducts([]);
      setLoadedImages(new Set());
    }
  }, [selectedCategory]);

  // Infinite scroll - load more when user scrolls near bottom
  const loadMore = () => {
    if (
      pagination &&
      currentPage < pagination.totalPages &&
      !productsFetching &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled:
      !productsLoading && !productsError && pagination
        ? currentPage < pagination.totalPages
        : false,
    loading: productsFetching,
    threshold: 400,
  });

  // Utility functions
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

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    const iconMap: { [key: string]: any } = {
      fashion: SparklesIcon,
      electronics: BoltIcon,
      "home & living": ShoppingBagIcon,
      home: ShoppingBagIcon,
      beauty: StarIcon,
      sports: FireIcon,
      gifts: GiftIcon,
      books: StarIcon,
      toys: GiftIcon,
      "health & wellness": StarIcon,
      automotive: BoltIcon,
      jewelry: SparklesIcon,
      accessories: SparklesIcon,
    };
    return iconMap[name] || TagIcon;
  };

  const getCategoryColor = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    const colorMap: { [key: string]: string } = {
      fashion: "bg-gradient-to-br from-pink-500 to-rose-600",
      electronics: "bg-gradient-to-br from-blue-500 to-indigo-600",
      "home & living": "bg-gradient-to-br from-green-500 to-emerald-600",
      home: "bg-gradient-to-br from-green-500 to-emerald-600",
      beauty: "bg-gradient-to-br from-purple-500 to-violet-600",
      sports: "bg-gradient-to-br from-orange-500 to-red-600",
      gifts: "bg-gradient-to-br from-yellow-500 to-amber-600",
      books: "bg-gradient-to-br from-indigo-500 to-blue-600",
      toys: "bg-gradient-to-br from-red-500 to-pink-600",
      "health & wellness": "bg-gradient-to-br from-teal-500 to-cyan-600",
      automotive: "bg-gradient-to-br from-slate-500 to-gray-600",
      jewelry: "bg-gradient-to-br from-amber-400 to-yellow-500",
      accessories: "bg-gradient-to-br from-violet-500 to-purple-600",
    };
    return colorMap[name] || "bg-gradient-to-br from-gray-600 to-gray-800";
  };

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
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

  const calculateDiscount = (product: Product) => {
    if (
      product.pricing.salePrice &&
      product.pricing.basePrice > product.pricing.salePrice
    ) {
      return Math.round(
        ((product.pricing.basePrice - product.pricing.salePrice) /
          product.pricing.basePrice) *
          100
      );
    }
    return 0;
  };

  const getDisplayPrice = (product: Product) => {
    return product.pricing.salePrice || product.pricing.basePrice;
  };

  // Auto-advance hero carousel
  useEffect(() => {
    if (bannersData.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannersData.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [bannersData.length]);

  // Auto-scroll featured carousel
  useEffect(() => {
    if (featuredProducts.length > 0) {
      const timer = setInterval(() => {
        setFeaturedCarouselIndex((prev) => {
          const newIndex = (prev + 1) % featuredProducts.length;

          if (carouselRef.current) {
            const scrollWidth = carouselRef.current.scrollWidth;
            const itemWidth = scrollWidth / featuredProducts.length;
            carouselRef.current.scrollTo({
              left: itemWidth * newIndex,
              behavior: "smooth",
            });
          }

          return newIndex;
        });
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [featuredProducts.length]);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page
    setAllProducts([]); // Clear existing products
    setLoadedImages(new Set()); // Clear loaded images
    // Don't scroll - keep user at current position (category bar is sticky)
  };

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % bannersData.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + bannersData.length) % bannersData.length
    );

  // Show loading skeleton
  if (featuredLoading || categoriesLoading || productsLoading) {
    return <HomePageSkeleton isAuthenticated={isAuthenticated} />;
  }

  // Prepare categories for display - show all active categories
  const displayCategories = [
    {
      _id: "all",
      name: "All",
      slug: "all",
      productsCount: pagination?.total || 0,
      isActive: true,
      isFeatured: true,
      displayOrder: 0,
      createdAt: "",
      updatedAt: "",
    },
    ...categoriesData
      .filter((cat) => cat.isActive)
      .sort((a, b) => {
        // Sort by display order, then by name
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return a.name.localeCompare(b.name);
      }),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Carousel */}
      {!isAuthenticated && bannersData.length > 0 && (
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
                  src={bannersData[currentSlide].image}
                  alt={bannersData[currentSlide].title}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 ${
                  bannersData[currentSlide].gradient ||
                  "bg-gradient-to-r from-purple-600/80 via-pink-600/70 to-rose-500/80"
                } mix-blend-multiply`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                <div className="max-w-5xl">
                  {bannersData[currentSlide].subtitle && (
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="mb-6"
                    >
                      <span className="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold tracking-widest shadow-2xl">
                        {bannersData[currentSlide].subtitle}
                      </span>
                    </motion.div>
                  )}

                  <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tight drop-shadow-2xl"
                    style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
                  >
                    {bannersData[currentSlide].title}
                  </motion.h1>

                  {bannersData[currentSlide].description && (
                    <motion.p
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                      className="text-2xl md:text-3xl text-white/95 mb-12 font-light tracking-wide drop-shadow-lg"
                    >
                      {bannersData[currentSlide].description}
                    </motion.p>
                  )}

                  {bannersData[currentSlide].buttonText && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                    >
                      <button
                        onClick={() =>
                          bannersData[currentSlide].link
                            ? navigate(bannersData[currentSlide].link!)
                            : navigate("/shop")
                        }
                        className="bg-white text-gray-900 px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-transform duration-300 flex items-center gap-3 mx-auto"
                      >
                        {bannersData[currentSlide].buttonText}
                        <ArrowRightIcon className="w-6 h-6" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Navigation Arrows */}
              {bannersData.length > 1 && (
                <>
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
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          {bannersData.length > 1 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
              {bannersData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-500 rounded-full ${
                    currentSlide === idx
                      ? "w-12 h-2 bg-white shadow-lg"
                      : "w-2 h-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Trust Badges - Floating */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: TruckIcon,
                title: "Free Shipping",
                desc: "On orders over $50",
                color: "from-blue-500 to-cyan-600",
              },
              {
                icon: ShieldCheckIcon,
                title: "Secure Checkout",
                desc: "100% protected payment",
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: GiftIcon,
                title: "Easy Returns",
                desc: "30-day money back",
                color: "from-purple-500 to-pink-600",
              },
            ].map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <badge.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {badge.title}
                </h3>
                <p className="text-sm text-gray-500">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <section
          className={`py-8 bg-gradient-to-br from-gray-50 to-white ${
            isAuthenticated ? "pt-4" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-gray-500">Handpicked items just for you</span>
              <button
                onClick={() => navigate("/shop")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gold transition-colors shadow group"
              >
                View All
                <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Error State */}
            {featuredError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-700 font-medium">
                  Failed to load featured products
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Carousel Container */}
            {!featuredError && (
              <div className="relative">
                <div
                  ref={carouselRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {featuredProducts.map((product, idx) => {
                    const discount = calculateDiscount(product);
                    const displayPrice = getDisplayPrice(product);

                    return (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="group cursor-pointer snap-start shrink-0 w-[400px]"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <div className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-[320px]">
                          {/* Background Image */}
                          <img
                            src={
                              product.primaryImage ||
                              product.images[0]?.url ||
                              "https://via.placeholder.com/500"
                            }
                            alt={product.images[0]?.alt || product.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          {/* Dark Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 group-hover:from-black/95 transition-all duration-300" />

                          {/* Content Overlay */}
                          <div className="relative h-full flex flex-col justify-between p-6">
                            {/* Top Section - Badges */}
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col gap-1.5">
                                {product.isFeatured && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-block px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-gray-900 shadow-lg"
                                  >
                                    ✨ Featured
                                  </motion.div>
                                )}
                                {product.isOnSale && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-block px-2.5 py-1 bg-red-500/90 backdrop-blur-md rounded-full text-[10px] font-bold text-white shadow-lg"
                                  >
                                    🔥 On Sale
                                  </motion.div>
                                )}
                              </div>

                              {discount > 0 && (
                                <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs shadow-xl">
                                  -{discount}%
                                </div>
                              )}
                            </div>

                            {/* Bottom Section - Product Info */}
                            <div>
                              {/* Category & Rating */}
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                                  {product.categoryNames?.[0] ||
                                    product.category ||
                                    "General"}
                                </span>
                                {product.analytics.averageRating > 0 && (
                                  <div className="flex items-center gap-0.5 bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded-full">
                                    <StarIconSolid className="w-3 h-3 text-yellow-400" />
                                    <span className="text-[10px] font-bold text-white">
                                      {product.analytics.averageRating.toFixed(
                                        1
                                      )}
                                    </span>
                                    <span className="text-[9px] text-white/80">
                                      ({product.analytics.totalReviews})
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Title */}
                              <h3 className="font-bold text-sm md:text-base text-white mb-2 drop-shadow-lg line-clamp-2">
                                {product.title}
                              </h3>

                              {/* Price & Actions */}
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xl font-extrabold text-white drop-shadow-lg">
                                    ${displayPrice.toFixed(2)}
                                  </span>
                                  {product.pricing.salePrice &&
                                    product.pricing.basePrice >
                                      product.pricing.salePrice && (
                                      <span className="text-sm text-white/60 line-through">
                                        ${product.pricing.basePrice.toFixed(2)}
                                      </span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleWishlist(product._id);
                                    }}
                                    disabled={wishlistLoading === product._id}
                                    className={`p-3 rounded-full backdrop-blur-md transition-all shadow-lg ${
                                      isInWishlist(product._id)
                                        ? "bg-red-50 hover:bg-red-100"
                                        : "bg-white/90 hover:bg-white"
                                    }`}
                                    title={isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                  >
                                    {wishlistLoading === product._id ? (
                                      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                                    ) : isInWishlist(product._id) ? (
                                      <HeartIconSolid className="w-6 h-6 text-red-500" />
                                    ) : (
                                      <HeartIcon className="w-6 h-6 text-gray-700" />
                                    )}
                                  </motion.button>

                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (product.inventory.stockQuantity > 0) {
                                        toggleCart(product._id);
                                      }
                                    }}
                                    disabled={cartLoading === product._id || product.inventory.stockQuantity === 0}
                                    className={`p-3 rounded-full transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                                      isInCart(product._id)
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : "bg-gold hover:bg-gold-dark text-white"
                                    }`}
                                    title={
                                      product.inventory.stockQuantity === 0
                                        ? "Out of Stock"
                                        : isInCart(product._id)
                                        ? "Remove from Cart"
                                        : "Add to Cart"
                                    }
                                  >
                                    {cartLoading === product._id ? (
                                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <ShoppingCartIcon className="w-6 h-6" />
                                    )}
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Carousel Indicators */}
                {featuredProducts.length > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {featuredProducts.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setFeaturedCarouselIndex(idx);
                          if (carouselRef.current) {
                            const scrollWidth = carouselRef.current.scrollWidth;
                            const itemWidth =
                              scrollWidth / featuredProducts.length;
                            carouselRef.current.scrollTo({
                              left: itemWidth * idx,
                              behavior: "smooth",
                            });
                          }
                        }}
                        className={`transition-all duration-300 rounded-full ${
                          featuredCarouselIndex === idx
                            ? "w-8 h-2 bg-gold"
                            : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Category Filter - Sticky */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-xl border-y border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-gray-500">Shop by Category</span>
            {pagination && (
              <span className="text-[10px] text-gray-400">
                · {pagination.total} items
              </span>
            )}
          </div>

          {/* Error State */}
          {categoriesError && (
            <div className="text-sm text-red-600 mb-2">
              Failed to load categories. Using default categories.
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {displayCategories.map((cat, idx) => {
              const Icon =
                cat._id === "all" ? TagIcon : getCategoryIcon(cat.name);
              const color =
                cat._id === "all"
                  ? "bg-gradient-to-br from-gray-600 to-gray-800"
                  : getCategoryColor(cat.name);

              const isSelected = selectedCategory === cat._id;

              return (
                <motion.button
                  key={cat._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleCategoryChange(cat._id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap 
                    transition-all duration-300 shadow-sm hover:shadow-md
                    ${
                      isSelected
                        ? `${color} text-white scale-105 shadow-lg`
                        : "bg-white border border-gray-200 text-gray-700 hover:border-gold hover:text-gold"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                  {cat.productsCount > 0 && (
                    <span className="ml-1 opacity-75">
                      ({cat.productsCount})
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error State */}
        {productsError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center mb-8">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700 mb-2">
              Failed to Load Products
            </h3>
            <p className="text-red-600 mb-4">
              There was an error loading the products. Please try again.
            </p>
            <button
              onClick={() => refetchProducts()}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State - Show shimmer when loading OR switching category OR fetching OR waiting for data to populate */}
        {(productsLoading ||
          isSwitchingCategory ||
          productsFetching ||
          (allProducts.length === 0 && !productsError && (productsResponse === undefined || productsResponse?.data?.length > 0))) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 animate-pulse"
              >
                <div className="aspect-[3/4] bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!productsLoading &&
          !isSwitchingCategory &&
          !productsFetching &&
          !productsError &&
          allProducts.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allProducts.map((product, idx) => {
                  const discount = calculateDiscount(product);
                  const displayPrice = getDisplayPrice(product);
                  const isImageLoaded = loadedImages.has(product._id);

                  return (
                    <div
                      key={product._id}
                      onMouseEnter={() => setHoveredProduct(product._id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gold hover:shadow-xl hover:-translate-y-2"
                      style={{
                        animation:
                          idx >= allProducts.length - 12
                            ? `fadeInUp 0.4s ease-out ${
                                (idx % 12) * 0.03
                              }s both`
                            : "none",
                      }}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        {/* Shimmer effect while image loads */}
                        {!isImageLoaded && (
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%]" />
                        )}

                        <img
                          src={
                            product.primaryImage ||
                            product.images[0]?.url ||
                            "https://via.placeholder.com/400"
                          }
                          alt={product.images[0]?.alt || product.title}
                          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                            isImageLoaded ? "opacity-100" : "opacity-0"
                          }`}
                          onLoad={() => {
                            setLoadedImages((prev) =>
                              new Set(prev).add(product._id)
                            );
                          }}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/400?text=No+Image";
                            setLoadedImages((prev) =>
                              new Set(prev).add(product._id)
                            );
                          }}
                          loading="lazy"
                        />

                        {/* Badges Overlay - Top Right */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          {/* Discount Badge */}
                          {discount > 0 && (
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md"
                            >
                              -{discount}%
                            </motion.div>
                          )}

                          {/* Featured Star */}
                          {product.isFeatured && (
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              className="bg-gold text-white p-1.5 rounded-full shadow-md"
                            >
                              <StarIconSolid className="w-4 h-4" />
                            </motion.div>
                          )}
                        </div>

                        {/* Stock Warning */}
                        {product.inventory.stockQuantity === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <div className="flex items-center gap-1.5 text-white">
                              <span className="text-xs font-medium">
                                Out of Stock
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Low Stock Warning */}
                        {product.inventory.stockQuantity > 0 &&
                          product.inventory.stockQuantity <=
                            (product.inventory.lowStockThreshold || 10) && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-500/70 to-transparent p-3">
                              <div className="flex items-center gap-1.5 text-white">
                                <span className="text-xs font-medium">
                                  Only {product.inventory.stockQuantity} left!
                                </span>
                              </div>
                            </div>
                          )}

                        {/* Quick Actions - Appear on Hover */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: hoveredProduct === product._id ? 1 : 0,
                            y: hoveredProduct === product._id ? 0 : 20,
                          }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-2"
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
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
                            title={isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                          >
                            {wishlistLoading === product._id ? (
                              <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                            ) : isInWishlist(product._id) ? (
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
                              if (product.inventory.stockQuantity > 0) {
                                toggleCart(product._id);
                              }
                            }}
                            disabled={cartLoading === product._id || product.inventory.stockQuantity === 0}
                            className={`p-2.5 rounded-full backdrop-blur-sm shadow-md transition-colors ${
                              product.inventory.stockQuantity === 0
                                ? "bg-gray-300/90 cursor-not-allowed text-gray-500"
                                : isInCart(product._id)
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-white/90 hover:bg-gold hover:text-white text-gold"
                            }`}
                            title={
                              product.inventory.stockQuantity === 0
                                ? "Out of Stock"
                                : isInCart(product._id)
                                ? "Remove from Cart"
                                : "Add to Cart"
                            }
                          >
                            {cartLoading === product._id ? (
                              <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <ShoppingCartIcon className="w-5 h-5" />
                            )}
                          </motion.button>
                        </motion.div>
                      </div>

                      {/* Product Information - Show shimmer if image not loaded */}
                      <div
                        className={`p-4 space-y-2 transition-opacity duration-300 ${
                          isImageLoaded ? "opacity-100" : "opacity-50"
                        }`}
                      >
                        {/* Category & Condition */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-600 uppercase font-medium">
                            {product.categoryNames?.[0] ||
                              product.category ||
                              "General"}
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
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarIconSolid
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i <
                                    Math.floor(
                                      product.analytics.averageRating
                                    )
                                      ? "text-gold"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">
                              ({product.analytics.totalReviews})
                            </span>
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                          {product.title}
                        </h3>

                        {/* Seller Info */}
                        {product.sellerId &&
                          typeof product.sellerId === "object" && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>
                                by{" "}
                                {product.sellerId.businessInfo?.businessName ||
                                  "Seller"}
                              </span>
                              {product.sellerId.verification?.status ===
                                "verified" && (
                                <span
                                  className="text-blue-500"
                                  title="Verified Seller"
                                >
                                  ✓
                                </span>
                              )}
                            </div>
                          )}

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg text-gray-900 font-bold">
                            ${displayPrice.toFixed(2)}
                          </span>
                          {product.pricing.salePrice &&
                            product.pricing.basePrice >
                              product.pricing.salePrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.pricing.basePrice.toFixed(2)}
                              </span>
                            )}
                        </div>

                        {/* Trending Badge */}
                        {product.analytics.totalSold > 50 && (
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                              <FireIcon className="w-3 h-3" />
                              <span>Trending</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {product.analytics.totalSold} sold
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Infinite Scroll Trigger - Invisible element to trigger loading */}
              {pagination && currentPage < pagination.totalPages && (
                <div ref={sentinelRef} className="h-1" />
              )}

              {/* Shimmer Loader - Shows while fetching next batch */}
              {(isLoadingMore || productsFetching) &&
                pagination &&
                currentPage < pagination.totalPages && (
                  <div className="mt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {[...Array(12)].map((_, idx) => (
                        <div
                          key={`shimmer-${idx}`}
                          className="bg-white rounded-lg overflow-hidden border border-gray-200"
                        >
                          {/* Image Shimmer */}
                          <div className="aspect-[3/4] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%]"></div>

                          {/* Content Shimmer */}
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

              {/* End of Results */}
              {pagination &&
                currentPage >= pagination.totalPages &&
                allProducts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-12 py-8"
                  >
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-full text-gray-600">
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <span className="font-medium">
                        You've reached the end! Showing all {allProducts.length}{" "}
                        products
                      </span>
                    </div>
                  </motion.div>
                )}
            </>
          )}

        {/* Empty State - Only show when NOT loading/fetching/switching AND truly no results */}
        {!productsLoading &&
          !isSwitchingCategory &&
          !productsFetching &&
          !productsError &&
          allProducts.length === 0 && (
            <div className="text-center py-20">
              <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-500 mb-6">
                Try selecting a different category or search term
              </p>
              <button
                onClick={() => handleCategoryChange("all")}
                className="px-8 py-3 bg-gold text-white font-bold rounded-xl hover:bg-gold-dark transition-colors"
              >
                View All Products
              </button>
            </div>
          )}
      </section>
    </div>
  );
};

export default HomePage;

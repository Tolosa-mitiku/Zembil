import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/connectivity_service.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/widgets/offline_notification.dart';
import 'package:zembil/features/home/domain/entity/product.dart';
import 'package:zembil/features/home/presentation/widgets/filter_bottom_sheet.dart';
import 'package:zembil/features/home/presentation/widgets/search_results.dart';
import 'package:zembil/features/home/presentation/widgets/search_shimmer.dart';
import 'package:zembil/injector.dart';
import 'package:zembil/features/home/presentation/bloc/featured_product_bloc/featured_product_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/featured_product_bloc/featured_product_event.dart';
import 'package:zembil/features/home/presentation/bloc/featured_product_bloc/featured_product_state.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_event.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_state.dart';
import 'package:zembil/features/home/presentation/widgets/category.dart';
import 'package:zembil/features/home/presentation/widgets/category_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/feature.dart';
import 'package:zembil/features/home/presentation/widgets/feature_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/product_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/search.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final List<String> categories = [
    "All",
    "Sports and Outdoors",
    "Electronics",
    "Home and Kitchen",
    "Fashion",
    "Furniture",
    "Musical Instruments"
  ];

  String selectedCategory = "All";
  bool _isSearching = false;
  String _searchQuery = '';
  Timer? _debounce;
  Map<String, dynamic> _currentFilters = {};

  @override
  void initState() {
    super.initState();
    // BLoCs are initialized in build method with initial events
    // No need to call _loadData() here
  }

  void _loadData() {
    // Reload data for pull-to-refresh
    context.read<FeaturedProductBloc>().add(GetFeaturedProductsEvent());
    context
        .read<ProductsByCategoryBloc>()
        .add(GetProductsByCategoriesEvent(selectedCategory));
  }

  Future<void> _onRefresh() async {
    _loadData();
    // Wait for the bloc to finish loading
    await Future.delayed(const Duration(milliseconds: 500));
  }

  @override
  void dispose() {
    _debounce?.cancel();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      setState(() {
        _searchQuery = query;
      });
      if (query.isNotEmpty) {
        context.read<ProductsByCategoryBloc>().add(SearchProductsEvent(query));
      } else {
        // Reset to category view when search is cleared
        context
            .read<ProductsByCategoryBloc>()
            .add(GetProductsByCategoriesEvent(selectedCategory));
      }
    });
  }

  void _onSearchFocus(bool hasFocus) {
    setState(() {
      _isSearching = hasFocus || _searchQuery.isNotEmpty;
    });
  }

  void _showFilterBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => FilterBottomSheet(
        currentFilters: _currentFilters,
        onApply: (filters) {
          setState(() {
            _currentFilters = filters;
            _isSearching = true; // Switch to search view to show results
          });
          context.read<ProductsByCategoryBloc>().add(FilterProductsEvent(filters));
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => locator<FeaturedProductBloc>()..add(GetFeaturedProductsEvent())),
        BlocProvider(create: (context) => locator<ProductsByCategoryBloc>()..add(GetProductsByCategoriesEvent(selectedCategory))),
      ],
      child: PopScope(
      canPop: !_isSearching,
      onPopInvoked: (didPop) {
        if (didPop) return;
        setState(() {
          _isSearching = false;
          _searchQuery = '';
        });
        FocusScope.of(context).unfocus();
        // Reload original category
        context
            .read<ProductsByCategoryBloc>()
            .add(GetProductsByCategoriesEvent(selectedCategory));
      },
      child: Scaffold(
        backgroundColor: theme.scaffoldBackgroundColor,
        body: SafeArea(
        child: Column(
          children: [
            // Offline Notification
            OfflineNotification(
              connectivityService: locator<ConnectivityService>(),
            ),
            // Main Content
            Expanded(
              child: RefreshIndicator(
                onRefresh: _onRefresh,
                color: theme.colorScheme.primary,
                child: CustomScrollView(
                  physics: _isSearching ? const NeverScrollableScrollPhysics() : const AlwaysScrollableScrollPhysics(),
                  slivers: [
                  // Discover Header (Scrolls away)
                  if (!_isSearching)
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Flexible(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    'Discover',
                                    style:
                                        theme.textTheme.headlineSmall?.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Find your perfect product',
                                    style: theme.textTheme.bodySmall,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: theme.cardTheme.color,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: theme.colorScheme.primary
                                      .withOpacity(0.3),
                                ),
                              ),
                              child: Icon(
                                Icons.notifications_outlined,
                                color: theme.iconTheme.color,
                                size: 24,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                  // Sticky Search Bar (Always on top)
                  SliverPersistentHeader(
                    pinned: true,
                    delegate: _StickyHeaderDelegate(
                      minHeight: 64, // Slimmer
                      maxHeight: 64,
                      child: Container(
                        color: AppColors.getBackground(isDark),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 8,
                        ),
                        child: Search(
                          onChanged: _onSearchChanged,
                          onFocusChange: _onSearchFocus,
                          onFilterTap: _showFilterBottomSheet,
                        ),
                      ),
                    ),
                  ),

                  // Search Results Overlay
                  if (_isSearching)
                    SliverFillRemaining(
                      child: BlocBuilder<ProductsByCategoryBloc,
                          ProductsByCategoryState>(
                        builder: (context, state) {
                          if (state is ProductsByCategoryLoading) {
                            return const SearchShimmer();
                          } else if (state is ProductsByCategoryLoaded) {
                            return SearchResults(
                              products: state.products,
                              query: _searchQuery,
                            );
                          } else if (state is ProductsByCategoryError) {
                            return Center(
                              child: Text(state.message),
                            );
                          }
                          return const SizedBox.shrink();
                        },
                      ),
                    )
                  else ...[
                    // Featured Section (scrolls normally)
                    SliverToBoxAdapter(
                      child: Container(
                        color: AppColors.getBackground(isDark),
                        padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
                        child: BlocBuilder<FeaturedProductBloc,
                            FeaturedProductState>(
                          builder: (context, state) {
                            if (state is FeaturedProductLoaded) {
                              return Features(state.featuredProducts);
                            } else {
                              return const FeaturesShimmer();
                            }
                          },
                        ),
                      ),
                    ),

                    // Categories Section (Magnetic - sticks below search)
                    SliverPersistentHeader(
                      pinned: true,
                      delegate: _StickyHeaderDelegate(
                        minHeight: 70,
                        maxHeight: 70,
                        child: Container(
                          color: AppColors.getBackground(isDark),
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: BlocBuilder<ProductsByCategoryBloc,
                              ProductsByCategoryState>(
                            builder: (context, state) {
                              if (state is ProductsByCategoryLoading) {
                                return const CategoryShimmer();
                              } else {
                                return Category(
                                  categories: categories,
                                  selectedCategory: selectedCategory,
                                  onCategorySelected: (category) {
                                    setState(() {
                                      selectedCategory = category;
                                    });
                                    context
                                        .read<ProductsByCategoryBloc>()
                                        .add(GetProductsByCategoriesEvent(
                                            category));
                                  },
                                );
                              }
                            },
                          ),
                        ),
                      ),
                    ),

                    // Products Grid (Scrollable content)
                    SliverPadding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      sliver: BlocBuilder<ProductsByCategoryBloc,
                          ProductsByCategoryState>(
                        builder: (context, state) {
                          if (state is ProductsByCategoryLoading) {
                            return const SliverToBoxAdapter(
                              child: ProductsShimmer(),
                            );
                          } else if (state is ProductsByCategoryLoaded) {
                            return SliverGrid(
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                crossAxisSpacing: 16,
                                mainAxisSpacing: 16,
                                childAspectRatio: 0.65,
                              ),
                              delegate: SliverChildBuilderDelegate(
                                (context, index) {
                                  return _ProductCard(
                                    product: state.products[index],
                                    index: index,
                                  );
                                },
                                childCount: state.products.length,
                              ),
                            );
                          } else if (state is ProductsByCategoryError) {
                            return SliverToBoxAdapter(
                              child: SizedBox(
                                height: 200,
                                child: Center(
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.error_outline,
                                        size: 48,
                                        color: theme.colorScheme.error,
                                      ),
                                      const SizedBox(height: 16),
                                      Text(
                                        'Error: ${state.message}',
                                        style: theme.textTheme.bodyMedium,
                                        textAlign: TextAlign.center,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          } else {
                            return SliverToBoxAdapter(
                              child: SizedBox(
                                height: 200,
                                child: Center(
                                  child: Text(
                                    'Select a category to view products',
                                    style: theme.textTheme.bodyMedium,
                                    textAlign: TextAlign.center,
                                  ),
                                ),
                              ),
                            );
                          }
                        },
                      ),
                    ),

                    // Bottom spacing
                    const SliverToBoxAdapter(
                      child: SizedBox(height: 40),
                    ),
                  ],
                ],
              ),
            ),
          ),
          ],
        ),
      ),
    ),
    ),
    );
  }
}

// Product Card Widget
class _ProductCard extends StatefulWidget {
  final ProductEntity product;
  final int index;

  const _ProductCard({
    required this.product,
    required this.index,
  });

  @override
  State<_ProductCard> createState() => _ProductCardState();
}

class _ProductCardState extends State<_ProductCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  bool _isFavorite = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOutBack,
      ),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeIn,
      ),
    );

    // Staggered animation for grid items
    Future.delayed(Duration(milliseconds: 50 * widget.index), () {
      if (mounted) {
        _controller.forward();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final product = widget.product;

    return FadeTransition(
      opacity: _fadeAnimation,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: GestureDetector(
          onTap: () {
            context.push("/index/products/${product.id}");
          },
          child: Container(
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isDark
                    ? AppColors.gold.withOpacity(0.2)
                    : AppColors.grey200,
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.getShadow(isDark),
                  blurRadius: 8,
                  spreadRadius: 0,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Product Image with Favorite Button
                Expanded(
                  flex: 3,
                  child: Stack(
                    children: [
                      // Image Container
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(8),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.network(
                            product.images.isNotEmpty ? product.images[0] : '',
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                color: isDark
                                    ? AppColors.darkGreyLight
                                    : AppColors.grey100,
                                child: Icon(
                                  Icons.image_not_supported_outlined,
                                  size: 40,
                                  color:
                                      theme.iconTheme.color?.withOpacity(0.3),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                      // Favorite Button
                      Positioned(
                        top: 12,
                        right: 12,
                        child: GestureDetector(
                          onTap: () {
                            setState(() {
                              _isFavorite = !_isFavorite;
                            });
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.9),
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 4,
                                ),
                              ],
                            ),
                            child: Icon(
                              _isFavorite
                                  ? Icons.favorite
                                  : Icons.favorite_border,
                              color: _isFavorite
                                  ? AppColors.favorite
                                  : AppColors.grey600,
                              size: 18,
                            ),
                          ),
                        ),
                      ),
                      // Discount Badge
                      if (product.discount != null &&
                          product.discount!.percentage > 0)
                        Positioned(
                          top: 12,
                          left: 12,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.error,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '-${product.discount!.percentage}%',
                              style: TextStyle(
                                fontSize: 11,
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                // Product Info
                Expanded(
                  flex: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Title
                        Text(
                          product.title,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: theme.textTheme.titleSmall,
                        ),
                        const SizedBox(height: 4),
                        // Category
                        Text(
                          product.category,
                          style: theme.textTheme.bodySmall,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const Spacer(),
                        // Price Row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            // Price
                            Flexible(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    '\$${product.price.toStringAsFixed(2)}',
                                    style:
                                        theme.textTheme.titleMedium?.copyWith(
                                      color: theme.colorScheme.primary,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  if (product.discount != null &&
                                      product.discount!.percentage > 0)
                                    Text(
                                      '\$${(product.price / (1 - product.discount!.percentage / 100)).toStringAsFixed(2)}',
                                      style:
                                          theme.textTheme.bodySmall?.copyWith(
                                        decoration: TextDecoration.lineThrough,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                ],
                              ),
                            ),
                            // Add to Cart Button
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: theme.colorScheme.primary,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Icon(
                                Icons.add_shopping_cart,
                                size: 18,
                                color: isDark
                                    ? AppColors.darkGreyDark
                                    : Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// Sticky Header Delegate
class _StickyHeaderDelegate extends SliverPersistentHeaderDelegate {
  final double minHeight;
  final double maxHeight;
  final Widget child;

  _StickyHeaderDelegate({
    required this.minHeight,
    required this.maxHeight,
    required this.child,
  });

  @override
  double get minExtent => minHeight;

  @override
  double get maxExtent => maxHeight;

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return SizedBox.expand(child: child);
  }

  @override
  bool shouldRebuild(_StickyHeaderDelegate oldDelegate) {
    return maxHeight != oldDelegate.maxHeight ||
        minHeight != oldDelegate.minHeight ||
        child != oldDelegate.child;
  }
}

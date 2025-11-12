import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/app_text_styles.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';
import 'package:zembil/features/home/domain/entity/product.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_event.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_state.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/product_description_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/product_images_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/product_info_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/product_sizes_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/related_products.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/related_products_shimmer.dart';

class ProductDetailPage extends StatefulWidget {
  final String productId;

  const ProductDetailPage(this.productId, {super.key});

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage>
    with TickerProviderStateMixin {
  late AnimationController _fabController;
  // late Animation<double> _fabScale;
  final ScrollController _scrollController = ScrollController();
  bool _isFavorite = false;
  int _quantity = 1;
  int _currentImageIndex = 0;
  String _selectedSize = 'M';
  bool _isDescriptionExpanded = false;

  @override
  void initState() {
    super.initState();
    context.read<ProductDetailBloc>().add(FetchProductDetail(widget.productId));

    _fabController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );
    // _fabScale = Tween<double>(begin: 0.0, end: 1.0).animate(
    //   CurvedAnimation(parent: _fabController, curve: Curves.easeOutBack),
    // );

    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) _fabController.forward();
    });
  }

  @override
  void dispose() {
    _fabController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: BlocConsumer<ProductDetailBloc, ProductDetailState>(
        listener: (context, state) {
          if (state is CartSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Row(
                  children: [
                    const Icon(Icons.check_circle, color: Colors.white),
                    const SizedBox(width: 12),
                    const Text('Added to cart successfully!'),
                  ],
                ),
                backgroundColor: AppColors.success,
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                action: SnackBarAction(
                  label: 'VIEW CART',
                  textColor: Colors.white,
                  onPressed: () => context.push("/cart"),
                ),
              ),
            );
          }
        },
        builder: (context, state) {
          if (state is ProductDetailLoading) {
            return _buildLoadingState(theme);
          } else if (state is ProductDetailLoaded) {
            return _buildLoadedState(context, theme, isDark, state, r);
          } else if (state is ProductDetailError) {
            return _buildErrorState(theme, state.message);
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildLoadingState(ThemeData theme) {
    return CustomScrollView(
      slivers: [
        const SliverAppBar(
          expandedHeight: 400,
          backgroundColor: Colors.transparent,
          elevation: 0,
          flexibleSpace: FlexibleSpaceBar(
            background: ProductImagesShimmer(),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                ProductInfoShimmer(),
                SizedBox(height: 32),
                ProductSizesShimmer(),
                SizedBox(height: 32),
                ProductDescriptionShimmer(),
                SizedBox(height: 32),
                RelatedProductsShimmer(),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLoadedState(
    BuildContext context,
    ThemeData theme,
    bool isDark,
    ProductDetailLoaded state,
    Responsive r,
  ) {
    final product = state.product;
    final relatedProducts = state.relatedProducts;

    return Stack(
      children: [
        CustomScrollView(
          controller: _scrollController,
          slivers: [
            // 1. Full-screen Image Gallery
            _buildSliverAppBar(context, theme, isDark, product, r),

            // 2. Product Details Content
            SliverToBoxAdapter(
              child: Container(
                decoration: BoxDecoration(
                  color: theme.scaffoldBackgroundColor,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(32),
                  ),
                ),
                transform: Matrix4.translationValues(0, -24, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Pull handle
                    Center(
                      child: Container(
                        margin: const EdgeInsets.only(top: 12, bottom: 8),
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: theme.dividerColor.withOpacity(0.5),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),

                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: r.largeSpace),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Header: Title, Price, Rating
                          _buildProductHeader(theme, isDark, product, r),

                          SizedBox(height: r.largeSpace),

                          // Variants: Size/Color
                          _buildVariantsSelector(theme, isDark, r),

                          SizedBox(height: r.largeSpace),

                          // Description
                          _buildDescription(
                              theme, product.description ?? "", r),

                          SizedBox(height: r.xLargeSpace),

                          // Related Products
                          Text(
                            'You might also like',
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: r.mediumSpace),
                          RelatedProducts(relatedProducts),

                          // Bottom padding for fixed bar
                          SizedBox(height: r.hp(15)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),

        // 3. Sticky Bottom Action Bar
        _buildBottomActionBar(context, theme, isDark, product, r),
      ],
    );
  }

  Widget _buildSliverAppBar(
    BuildContext context,
    ThemeData theme,
    bool isDark,
    ProductEntity product,
    Responsive r,
  ) {
    return SliverAppBar(
      expandedHeight: r.hp(55),
      pinned: true,
      stretch: true,
      backgroundColor: theme.scaffoldBackgroundColor,
      elevation: 0,
      systemOverlayStyle: SystemUiOverlayStyle.dark, // Always dark for image bg
      leading: IconButton(
        icon: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.2),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
        ),
        onPressed: () => context.pop(),
      ),
      actions: [
        IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(
              _isFavorite ? Icons.favorite : Icons.favorite_border,
              color: _isFavorite ? AppColors.favorite : Colors.white,
              size: 20,
            ),
          ),
          onPressed: () => setState(() => _isFavorite = !_isFavorite),
        ),
        const SizedBox(width: 16),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            // Image Carousel
            PageView.builder(
              itemCount: product.images.isNotEmpty ? product.images.length : 1,
              onPageChanged: (index) =>
                  setState(() => _currentImageIndex = index),
              itemBuilder: (context, index) {
                if (product.images.isEmpty) {
                  return Container(
                    color: isDark ? AppColors.darkGreyLight : AppColors.grey100,
                    child: Icon(Icons.image,
                        size: 64,
                        color: theme.iconTheme.color?.withOpacity(0.3)),
                  );
                }
                return Image.network(
                  product.images[index],
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    color: isDark ? AppColors.darkGreyLight : AppColors.grey100,
                    child: const Icon(Icons.error_outline),
                  ),
                );
              },
            ),
            // Gradient Overlay for text visibility
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.3),
                    ],
                  ),
                ),
              ),
            ),
            // Pagination Dots
            if (product.images.length > 1)
              Positioned(
                bottom: 40,
                left: 0,
                right: 0,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    product.images.length,
                    (index) => AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      width: _currentImageIndex == index ? 24 : 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: _currentImageIndex == index
                            ? Colors.white
                            : Colors.white.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildProductHeader(
    ThemeData theme,
    bool isDark,
    ProductEntity product,
    Responsive r,
  ) {
    final discountedPrice = product.price;
    final hasDiscount =
        product.discount != null && product.discount!.percentage > 0;
    final originalPrice = hasDiscount
        ? product.price / (1 - product.discount!.percentage / 100)
        : product.price;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Category & Rating
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                product.category.toUpperCase(),
                style: AppTextStyles.labelSmall.copyWith(
                  color: theme.colorScheme.primary,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                ),
              ),
            ),
            Row(
              children: [
                const Icon(Icons.star, color: AppColors.gold, size: 18),
                const SizedBox(width: 4),
                Text(
                  '4.8', // Placeholder or real rating
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  ' (124 reviews)',
                  style: theme.textTheme.bodySmall,
                ),
              ],
            ),
          ],
        ),
        SizedBox(height: r.mediumSpace),

        // Title
        Text(
          product.title,
          style: theme.textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
            height: 1.2,
          ),
        ),
        SizedBox(height: r.smallSpace),

        // Price & Discount
        Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '\$${discountedPrice.toStringAsFixed(2)}',
              style: theme.textTheme.headlineSmall?.copyWith(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.w900,
              ),
            ),
            if (hasDiscount) ...[
              const SizedBox(width: 12),
              Text(
                '\$${originalPrice.toStringAsFixed(2)}',
                style: theme.textTheme.titleMedium?.copyWith(
                  color: theme.textTheme.bodySmall?.color,
                  decoration: TextDecoration.lineThrough,
                ),
              ),
              const SizedBox(width: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.error,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '-${product.discount!.percentage}%',
                  style: AppTextStyles.labelSmall.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ],
        ),
      ],
    );
  }

  Widget _buildVariantsSelector(ThemeData theme, bool isDark, Responsive r) {
    final sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Select Size',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: r.smallSpace),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: sizes.map((size) {
              final isSelected = _selectedSize == size;
              return GestureDetector(
                onTap: () => setState(() => _selectedSize = size),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(right: 12),
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: isSelected
                        ? theme.colorScheme.primary
                        : theme.cardTheme.color,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isSelected
                          ? theme.colorScheme.primary
                          : theme.dividerColor,
                      width: 1.5,
                    ),
                    boxShadow: isSelected
                        ? [
                            BoxShadow(
                              color: theme.colorScheme.primary.withOpacity(0.3),
                              blurRadius: 8,
                              offset: const Offset(0, 4),
                            )
                          ]
                        : null,
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    size,
                    style: TextStyle(
                      color: isSelected
                          ? (isDark ? AppColors.darkGreyDark : Colors.white)
                          : theme.textTheme.bodyLarge?.color,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildDescription(ThemeData theme, String description, Responsive r) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Description',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: r.smallSpace),
        AnimatedCrossFade(
          firstChild: Text(
            description,
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
            style: theme.textTheme.bodyMedium?.copyWith(height: 1.6),
          ),
          secondChild: Text(
            description,
            style: theme.textTheme.bodyMedium?.copyWith(height: 1.6),
          ),
          crossFadeState: _isDescriptionExpanded
              ? CrossFadeState.showSecond
              : CrossFadeState.showFirst,
          duration: const Duration(milliseconds: 300),
        ),
        GestureDetector(
          onTap: () =>
              setState(() => _isDescriptionExpanded = !_isDescriptionExpanded),
          child: Padding(
            padding: const EdgeInsets.only(top: 8.0),
            child: Text(
              _isDescriptionExpanded ? 'Read Less' : 'Read More',
              style: TextStyle(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomActionBar(
    BuildContext context,
    ThemeData theme,
    bool isDark,
    ProductEntity product,
    Responsive r,
  ) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: SlideTransition(
        position: Tween<Offset>(begin: const Offset(0, 1), end: Offset.zero)
            .animate(_fabController),
        child: Container(
          padding: EdgeInsets.fromLTRB(
            r.largeSpace,
            r.mediumSpace,
            r.largeSpace,
            r.mediumSpace + MediaQuery.of(context).padding.bottom,
          ),
          decoration: BoxDecoration(
            color: theme.cardTheme.color,
            boxShadow: [
              BoxShadow(
                color: AppColors.getShadow(isDark),
                blurRadius: 20,
                offset: const Offset(0, -5),
              ),
            ],
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Row(
            children: [
              // Quantity Selector
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: theme.scaffoldBackgroundColor,
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(color: theme.dividerColor),
                ),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        if (_quantity > 1) setState(() => _quantity--);
                      },
                      child: Icon(Icons.remove,
                          size: 20,
                          color: _quantity > 1
                              ? theme.iconTheme.color
                              : theme.disabledColor),
                    ),
                    SizedBox(width: r.mediumSpace),
                    Text(
                      '$_quantity',
                      style: theme.textTheme.titleMedium
                          ?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    SizedBox(width: r.mediumSpace),
                    GestureDetector(
                      onTap: () => setState(() => _quantity++),
                      child: Icon(Icons.add,
                          size: 20, color: theme.iconTheme.color),
                    ),
                  ],
                ),
              ),
              SizedBox(width: r.mediumSpace),

              // Add to Cart Button
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    context.read<ProductDetailBloc>().add(
                          AddToCartEvent(
                            item: CartEntity(
                              productId: product.id,
                              title: product.title,
                              category: product.category,
                              image: product.images.isNotEmpty
                                  ? product.images[0]
                                  : '',
                              price: product.price,
                              quantity: _quantity,
                            ),
                          ),
                        );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.colorScheme.primary,
                    foregroundColor:
                        isDark ? AppColors.darkGreyDark : Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    elevation: 4,
                    shadowColor: theme.colorScheme.primary.withOpacity(0.4),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.shopping_bag_outlined),
                      SizedBox(width: 8),
                      Text(
                        'Add to Cart',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildErrorState(ThemeData theme, String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 64,
              color: theme.colorScheme.error,
            ),
            const SizedBox(height: 24),
            Text(
              'Oops! Something went wrong',
              style: theme.textTheme.titleLarge,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              message,
              style: theme.textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                context
                    .read<ProductDetailBloc>()
                    .add(FetchProductDetail(widget.productId));
              },
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }
}

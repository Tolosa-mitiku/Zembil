import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_paypal_payment/flutter_paypal_payment.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_bloc.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_event.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_state.dart';
import 'package:zembil/features/cart/presentation/widgets/select_payment.dart';
import 'package:zembil/injector.dart';

class CartPageRedesign extends StatefulWidget {
  const CartPageRedesign({super.key});

  @override
  State<CartPageRedesign> createState() => _CartPageRedesignState();
}

class _CartPageRedesignState extends State<CartPageRedesign>
    with SingleTickerProviderStateMixin {
  final TextEditingController _promoController = TextEditingController();

  @override
  void initState() {
    super.initState();
  }

  Future<void> _onRefresh() async {
    context.read<CartBloc>().add(GetCartEvent());
    await Future.delayed(const Duration(milliseconds: 500));
  }

  @override
  void dispose() {
    _promoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return BlocProvider(
      create: (context) => locator<CartBloc>()..add(GetCartEvent()),
      child: Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: BlocConsumer<CartBloc, CartState>(
        listener: (context, state) {
          if (state is PaymentSuccess) {
            // Reset cart state to loaded after payment success/cancel
            // In real app, you might want to clear cart on success
            context.read<CartBloc>().add(GetCartEvent());
            
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Row(
                  children: [
                    const Icon(Icons.check_circle, color: Colors.white),
                    const SizedBox(width: 12),
                    const Text('Payment processed successfully!'),
                  ],
                ),
                backgroundColor: AppColors.success,
                behavior: SnackBarBehavior.floating,
              ),
            );
          }
          if (state is CartError) {
            // Reset to loaded state so user can try again
            context.read<CartBloc>().add(GetCartEvent());
            
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: theme.colorScheme.error,
                behavior: SnackBarBehavior.floating,
              ),
            );
          }
        },
        builder: (context, state) {
          // Show loading overlay only during payment processing
          bool isProcessing = state is CartLoading && state is! CartLoaded;
          
          return Stack(
            children: [
              SafeArea(
                child: Column(
                  children: [
                    // Header
                    _buildHeader(context, theme, isDark, r, state),

                    // Content
                    Expanded(
                      child: _buildContent(context, theme, isDark, r, state),
                    ),
                  ],
                ),
              ),
              if (isProcessing)
                Container(
                  color: Colors.black.withOpacity(0.5),
                  child: Center(
                    child: CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(
                        theme.colorScheme.primary,
                      ),
                    ),
                  ),
                ),
            ],
          );
        },
      ),
    ),
    );
  }

  Widget _buildHeader(
    BuildContext context,
    ThemeData theme,
    bool isDark,
    Responsive r,
    CartState state,
  ) {
    int itemCount = 0;
    if (state is CartLoaded) {
      itemCount = state.items.length;
    }

    return Padding(
      padding: EdgeInsets.fromLTRB(
        r.mediumSpace,
        r.mediumSpace,
        r.mediumSpace,
        r.smallSpace,
      ),
      child: Row(
        children: [
          IconButton(
            icon: Container(
              padding: EdgeInsets.all(r.smallSpace),
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                shape: BoxShape.circle,
                border: Border.all(
                  color: isDark
                      ? AppColors.gold.withOpacity(0.2)
                      : AppColors.grey200,
                ),
              ),
              child: Icon(
                Icons.arrow_back_ios_new,
                color: theme.iconTheme.color,
                size: r.smallIcon,
              ),
            ),
            onPressed: () => context.pop(),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  'Shopping Cart',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.5,
                  ),
                ),
                Text(
                  '$itemCount ${itemCount == 1 ? 'item' : 'items'}',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.textTheme.bodySmall?.color?.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
          // Clear Cart Button
          IconButton(
            icon: Container(
              padding: EdgeInsets.all(r.smallSpace),
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                shape: BoxShape.circle,
                border: Border.all(
                  color: isDark
                      ? AppColors.gold.withOpacity(0.2)
                      : AppColors.grey200,
                ),
              ),
              child: Icon(
                Icons.delete_outline,
                color: theme.colorScheme.error,
                size: r.smallIcon,
              ),
            ),
            onPressed: itemCount > 0
                ? () => _showClearCartDialog(context, theme, isDark, r)
                : null,
          ),
        ],
      ),
    );
  }

  Widget _buildContent(
    BuildContext context,
    ThemeData theme,
    bool isDark,
    Responsive r,
    CartState state,
  ) {
    if (state is CartLoaded) {
      if (state.items.isEmpty) {
        return _buildEmptyCart(theme, isDark, r);
      }
      return Column(
        children: [
          // Cart Items List
          Expanded(
            child: RefreshIndicator(
              onRefresh: _onRefresh,
              color: theme.colorScheme.primary,
              child: ListView.builder(
                padding: EdgeInsets.symmetric(horizontal: r.mediumSpace),
                itemCount: state.items.length,
                itemBuilder: (context, index) {
                  return _buildCartItem(
                    context,
                    theme,
                    isDark,
                    r,
                    state.items[index],
                  );
                },
              ),
            ),
          ),

          // Checkout Section
          _buildCheckoutSection(context, theme, isDark, r, state),
        ],
      );
    }
    return Center(
      child: CircularProgressIndicator(
        valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
      ),
    );
  }

  Widget _buildCartItem(
    BuildContext context,
    ThemeData theme,
    bool isDark,
    Responsive r,
    CartEntity product,
  ) {
    return Dismissible(
      key: Key(product.productId),
      direction: DismissDirection.endToStart,
      background: Container(
        margin: EdgeInsets.only(bottom: r.mediumSpace),
        padding: EdgeInsets.only(right: r.largeSpace),
        decoration: BoxDecoration(
          color: theme.colorScheme.error,
          borderRadius: BorderRadius.circular(r.mediumRadius),
        ),
        alignment: Alignment.centerRight,
        child: Icon(
          Icons.delete_outline,
          color: Colors.white,
          size: r.largeIcon,
        ),
      ),
      onDismissed: (direction) {
        context.read<CartBloc>().add(
              RemoveFromCartEvent(productId: product.productId),
            );
      },
      child: Container(
        margin: EdgeInsets.only(bottom: r.mediumSpace),
        padding: EdgeInsets.all(r.smallSpace),
        decoration: BoxDecoration(
          color: theme.cardTheme.color,
          borderRadius: BorderRadius.circular(r.mediumRadius),
          border: Border.all(
            color: isDark
                ? AppColors.gold.withOpacity(0.1)
                : AppColors.grey200,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.getShadow(isDark),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            // Product Image
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(r.smallRadius),
                border: Border.all(
                  color: isDark
                      ? AppColors.gold.withOpacity(0.1)
                      : AppColors.grey200,
                ),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(r.smallRadius),
                child: Image.network(
                  product.image,
                  width: r.wp(20),
                  height: r.wp(20),
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    width: r.wp(20),
                    height: r.wp(20),
                    color: isDark ? AppColors.darkGreyLight : AppColors.grey100,
                    child: Icon(Icons.image_not_supported_outlined, size: 24),
                  ),
                ),
              ),
            ),

            SizedBox(width: r.mediumSpace),

            // Product Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: r.tinySpace),
                  Text(
                    product.category,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.textTheme.bodySmall?.color?.withOpacity(0.7),
                    ),
                  ),
                  SizedBox(height: r.smallSpace),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '\$${product.price.toStringAsFixed(2)}',
                        style: theme.textTheme.titleMedium?.copyWith(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      // Quantity Controls
                      Container(
                        padding: EdgeInsets.symmetric(
                          horizontal: r.tinySpace,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: theme.scaffoldBackgroundColor,
                          borderRadius: BorderRadius.circular(r.largeRadius),
                          border: Border.all(
                            color: theme.dividerColor,
                          ),
                        ),
                        child: Row(
                          children: [
                            _buildQtyBtn(
                              icon: Icons.remove,
                              onTap: () {
                                if (product.quantity > 1) {
                                  context.read<CartBloc>().add(
                                        UpdateCartEvent(
                                          productId: product.productId,
                                          newQuantity: product.quantity - 1,
                                        ),
                                      );
                                }
                              },
                              r: r,
                              theme: theme,
                            ),
                            SizedBox(
                              width: r.wp(8),
                              child: Text(
                                '${product.quantity}',
                                textAlign: TextAlign.center,
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                            _buildQtyBtn(
                              icon: Icons.add,
                              onTap: () {
                                context.read<CartBloc>().add(
                                      UpdateCartEvent(
                                        productId: product.productId,
                                        newQuantity: product.quantity + 1,
                                      ),
                                    );
                              },
                              r: r,
                              theme: theme,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQtyBtn({
    required IconData icon,
    required VoidCallback onTap,
    required Responsive r,
    required ThemeData theme,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(r.largeRadius),
      child: Padding(
        padding: EdgeInsets.all(r.tinySpace),
        child: Icon(icon, size: 16, color: theme.iconTheme.color),
      ),
    );
  }

  Widget _buildCheckoutSection(
    BuildContext context,
    ThemeData theme,
    bool isDark,
    Responsive r,
    CartLoaded state,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(r.largeRadius * 1.5),
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.getShadow(isDark),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      padding: EdgeInsets.all(r.largeSpace),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Promo Code Tile
          Container(
            margin: EdgeInsets.only(bottom: r.mediumSpace),
            decoration: BoxDecoration(
              color: theme.scaffoldBackgroundColor,
              borderRadius: BorderRadius.circular(r.mediumRadius),
              border: Border.all(color: theme.dividerColor),
            ),
            child: Theme(
              data: theme.copyWith(dividerColor: Colors.transparent),
              child: ExpansionTile(
                tilePadding: EdgeInsets.symmetric(horizontal: r.mediumSpace),
                title: Row(
                  children: [
                    Icon(Icons.local_offer_outlined,
                        size: 20, color: theme.colorScheme.primary),
                    SizedBox(width: r.mediumSpace),
                    Text(
                      'Have a promo code?',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                children: [
                  Padding(
                    padding: EdgeInsets.fromLTRB(
                      r.mediumSpace,
                      0,
                      r.mediumSpace,
                      r.mediumSpace,
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _promoController,
                            decoration: InputDecoration(
                              hintText: 'Enter code',
                              isDense: true,
                              contentPadding: EdgeInsets.symmetric(
                                horizontal: r.mediumSpace,
                                vertical: r.smallSpace,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(r.smallRadius),
                              ),
                            ),
                          ),
                        ),
                        SizedBox(width: r.smallSpace),
                        ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: theme.colorScheme.primary,
                            foregroundColor: Colors.white,
                            padding: EdgeInsets.symmetric(
                              horizontal: r.mediumSpace,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(r.smallRadius),
                            ),
                          ),
                          child: const Text('Apply'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Totals
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Total', style: theme.textTheme.bodyLarge),
              Text(
                '\$${state.total.toStringAsFixed(2)}',
                style: theme.textTheme.headlineSmall?.copyWith(
                  color: theme.colorScheme.primary,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ],
          ),
          SizedBox(height: r.largeSpace),

          // Checkout Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => _showPaymentOptions(context, state),
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.colorScheme.primary,
                foregroundColor: isDark ? AppColors.darkGreyDark : Colors.white,
                padding: EdgeInsets.symmetric(vertical: r.mediumSpace),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(r.largeRadius),
                ),
                elevation: 4,
                shadowColor: theme.colorScheme.primary.withOpacity(0.4),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.lock_outline, size: 20),
                  SizedBox(width: r.smallSpace),
                  Text(
                    'Proceed to Checkout',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyCart(ThemeData theme, bool isDark, Responsive r) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: EdgeInsets.all(r.xLargeSpace),
            decoration: BoxDecoration(
              color: theme.colorScheme.primary.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.shopping_cart_outlined,
              size: r.xxLargeIcon,
              color: theme.colorScheme.primary,
            ),
          ),
          SizedBox(height: r.largeSpace),
          Text(
            'Your cart is empty',
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: r.smallSpace),
          Text(
            'Add items to start a cart',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.textTheme.bodySmall?.color,
            ),
          ),
          SizedBox(height: r.xLargeSpace),
          ElevatedButton(
            onPressed: () => context.go('/index'),
            style: ElevatedButton.styleFrom(
              padding: EdgeInsets.symmetric(
                horizontal: r.xLargeSpace,
                vertical: r.mediumSpace,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(r.largeRadius),
              ),
            ),
            child: const Text('Start Shopping'),
          ),
        ],
      ),
    );
  }

  void _showClearCartDialog(
      BuildContext context, ThemeData theme, bool isDark, Responsive r) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: theme.cardTheme.color,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(r.mediumRadius),
        ),
        title: const Text('Clear Cart'),
        content: const Text('Are you sure you want to remove all items?'),
        actions: [
          TextButton(
            onPressed: () => context.pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              // Clear cart logic here (add event to bloc)
              // For now just popping
              context.pop();
            },
            child: Text(
              'Clear',
              style: TextStyle(color: theme.colorScheme.error),
            ),
          ),
        ],
      ),
    );
  }

  void _showPaymentOptions(BuildContext context, CartLoaded state) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => SelectPaymentMethod(
        onPayPal: () {
          context.pop();
          _processPayPalPayment(context, state);
        },
        onStripe: () {
          context.pop();
          context.read<CartBloc>().add(
                InitiateStripePaymentEvent(
                  total: (state.total as num).toInt(),
                ),
              );
        },
      ),
    );
  }

  void _processPayPalPayment(BuildContext context, CartLoaded state) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => PaypalCheckoutView(
          sandboxMode: true,
          clientId: dotenv.env['PAYPAL_CLIENT_ID'],
          secretKey: dotenv.env['PAYPAL_SECRET_KEY'],
          transactions: [
            {
              "amount": {
                "total": '${state.total}',
                "currency": "USD",
                "details": {
                  "subtotal": '${state.total}',
                  "shipping": '0',
                  "shipping_discount": 0
                }
              },
              "description": "Zembil purchase",
              "item_list": {
                "items": CartEntity.toPayPalList(state.items),
              }
            }
          ],
          note: "Contact us for any questions on your order.",
          onSuccess: (Map params) {
            context.pop();
            context.read<CartBloc>().add(GetCartEvent()); // Refresh
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Payment successful!'),
                backgroundColor: AppColors.success,
              ),
            );
          },
          onError: (error) {
            context.pop();
            context.read<CartBloc>().add(GetCartEvent()); // Refresh to stop loading
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Payment failed: $error'),
                backgroundColor: AppColors.error,
              ),
            );
          },
          onCancel: () {
            context.pop();
            context.read<CartBloc>().add(GetCartEvent()); // Refresh to stop loading
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Payment cancelled')),
            );
          },
        ),
      ),
    );
  }
}

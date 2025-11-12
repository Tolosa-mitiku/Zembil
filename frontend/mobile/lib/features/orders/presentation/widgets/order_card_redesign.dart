import 'package:flutter/material.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/app_text_styles.dart';
import 'package:zembil/features/orders/domain/entity/order.dart';
import 'package:zembil/features/orders/presentation/pages/order_history_detail_page.dart';
import 'package:zembil/features/orders/presentation/pages/order_tracking_page.dart';

class OrderCardRedesign extends StatefulWidget {
  final OrderEntity order;
  final bool isActive;
  final int index;

  const OrderCardRedesign({
    super.key,
    required this.order,
    required this.isActive,
    this.index = 0,
  });

  @override
  State<OrderCardRedesign> createState() => _OrderCardRedesignState();
}

class _OrderCardRedesignState extends State<OrderCardRedesign>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(begin: 0.95, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.1),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    // Staggered animation
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
    final r = context.r;

    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: ScaleTransition(
          scale: _scaleAnimation,
          child: GestureDetector(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => widget.isActive
                      ? OrderTrackingPage(order: widget.order)
                      : OrderHistoryDetailPage(order: widget.order),
                ),
              );
            },
            child: Container(
              margin: EdgeInsets.only(bottom: r.mediumSpace),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: isDark
                      ? [
                          AppColors.darkGreyCard,
                          AppColors.darkGreyCard.withOpacity(0.8),
                        ]
                      : [
                          Colors.white,
                          AppColors.grey50,
                        ],
                ),
                borderRadius: BorderRadius.circular(r.cardBorderRadius.topLeft.x),
                border: Border.all(
                  color: isDark
                      ? AppColors.gold.withOpacity(0.3)
                      : AppColors.grey200,
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.getShadow(isDark),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Modern Header with Gradient
                  Container(
                    padding: EdgeInsets.all(r.mediumSpace),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: isDark
                            ? [
                                AppColors.gold.withOpacity(0.15),
                                AppColors.gold.withOpacity(0.05),
                              ]
                            : [
                                theme.colorScheme.primary.withOpacity(0.1),
                                theme.colorScheme.primary.withOpacity(0.05),
                              ],
                      ),
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(r.cardBorderRadius.topLeft.x),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Order Date
                        Flexible(
                          child: Row(
                            children: [
                              Container(
                                padding: EdgeInsets.all(r.tinySpace),
                                decoration: BoxDecoration(
                                  color: theme.colorScheme.primary.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(r.smallRadius),
                                ),
                                child: Icon(
                                  Icons.calendar_today_rounded,
                                  size: r.mediumIcon,
                                  color: theme.colorScheme.primary,
                                ),
                              ),
                              SizedBox(width: r.smallSpace),
                              Flexible(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Ordered on',
                                      style: AppTextStyles.labelSmall.copyWith(
                                        color: theme.textTheme.bodySmall?.color,
                                      ),
                                    ),
                                    Text(
                                      _formatDate(widget.order.createdAt),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: AppTextStyles.titleSmall.copyWith(
                                        fontWeight: FontWeight.bold,
                                        color: theme.colorScheme.primary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                        SizedBox(width: r.smallSpace),
                        _buildModernStatusBadge(theme, isDark, r),
                      ],
                    ),
                  ),

                  // Product Items Preview
                  Padding(
                    padding: EdgeInsets.all(r.mediumSpace),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Items count indicator
                        Row(
                          children: [
                            Icon(
                              Icons.shopping_bag_outlined,
                              size: r.smallIcon,
                              color: theme.iconTheme.color?.withOpacity(0.6),
                            ),
                            SizedBox(width: r.tinySpace),
                            Text(
                              '${widget.order.items.length} ${widget.order.items.length == 1 ? 'Item' : 'Items'}',
                              style: AppTextStyles.labelMedium.copyWith(
                                color: theme.textTheme.bodySmall?.color,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: r.smallSpace),

                        // Show first 3 items
                        ...widget.order.items.take(3).map((item) {
                          return Container(
                            margin: EdgeInsets.only(bottom: r.smallSpace),
                            padding: EdgeInsets.all(r.smallSpace),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? AppColors.darkGreyLight.withOpacity(0.3)
                                  : AppColors.grey50,
                              borderRadius: BorderRadius.circular(r.smallRadius),
                            ),
                            child: Row(
                              children: [
                                // Product Image
                                Container(
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(r.tinyRadius),
                                    border: Border.all(
                                      color: isDark
                                          ? AppColors.gold.withOpacity(0.2)
                                          : AppColors.grey200,
                                    ),
                                  ),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(r.tinyRadius),
                                    child: Image.network(
                                      item.image ?? '',
                                      width: r.wp(15),
                                      height: r.wp(15),
                                      fit: BoxFit.cover,
                                      errorBuilder: (context, error, stackTrace) {
                                        return Container(
                                          width: r.wp(15),
                                          height: r.wp(15),
                                          color: isDark
                                              ? AppColors.darkGreyLight
                                              : AppColors.grey100,
                                          child: Icon(
                                            Icons.image_not_supported_outlined,
                                            size: r.mediumIcon,
                                            color: theme.iconTheme.color?.withOpacity(0.3),
                                          ),
                                        );
                                      },
                                    ),
                                  ),
                                ),
                                SizedBox(width: r.smallSpace),
                                // Product Info
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        item.title,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: AppTextStyles.bodyMedium.copyWith(
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      SizedBox(height: r.tinySpace / 2),
                                      Text(
                                        'Qty: ${item.quantity}',
                                        style: AppTextStyles.labelSmall.copyWith(
                                          color: theme.textTheme.bodySmall?.color,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                // Price
                                Text(
                                  '\$${item.subtotal.toStringAsFixed(2)}',
                                  style: AppTextStyles.titleSmall.copyWith(
                                    color: theme.colorScheme.primary,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          );
                        }),

                        if (widget.order.items.length > 3)
                          Container(
                            padding: EdgeInsets.all(r.smallSpace),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(r.smallRadius),
                              border: Border.all(
                                color: theme.colorScheme.primary.withOpacity(0.3),
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.more_horiz,
                                  size: r.smallIcon,
                                  color: theme.colorScheme.primary,
                                ),
                                SizedBox(width: r.tinySpace),
                                Text(
                                  '+${widget.order.items.length - 3} more items',
                                  style: AppTextStyles.labelMedium.copyWith(
                                    color: theme.colorScheme.primary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),

                  // Divider
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: r.mediumSpace),
                    child: Divider(
                      height: 1,
                      thickness: 1,
                      color: isDark
                          ? AppColors.gold.withOpacity(0.1)
                          : AppColors.grey200,
                    ),
                  ),

                  // Footer with Total & Action
                  Padding(
                    padding: EdgeInsets.all(r.mediumSpace),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Total Amount
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Total Amount',
                              style: AppTextStyles.labelMedium.copyWith(
                                color: theme.textTheme.bodySmall?.color,
                              ),
                            ),
                            SizedBox(height: r.tinySpace / 2),
                            Text(
                              '\$${widget.order.totalPrice.toStringAsFixed(2)}',
                              style: theme.textTheme.titleMedium?.copyWith(
                                color: theme.colorScheme.primary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        // Action Button
                        if (widget.isActive)
                          ElevatedButton.icon(
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (context) =>
                                      OrderTrackingPage(order: widget.order),
                                ),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: theme.colorScheme.primary,
                              foregroundColor: isDark ? AppColors.darkGreyDark : Colors.white,
                              padding: EdgeInsets.symmetric(
                                horizontal: r.mediumSpace,
                                vertical: r.smallSpace,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(r.smallRadius),
                              ),
                              elevation: 2,
                            ),
                            icon: Icon(Icons.track_changes, size: r.smallIcon),
                            label: const Text('Track'),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildModernStatusBadge(ThemeData theme, bool isDark, Responsive r) {
    Color badgeColor;
    IconData badgeIcon;
    Color textColor;

    switch (widget.order.tracking.status) {
      case 'pending':
      case 'confirmed':
        badgeColor = AppColors.warning;
        badgeIcon = Icons.schedule;
        textColor = Colors.white;
        break;
      case 'processing':
        badgeColor = AppColors.info;
        badgeIcon = Icons.auto_awesome;
        textColor = Colors.white;
        break;
      case 'shipped':
      case 'out_for_delivery':
        badgeColor = theme.colorScheme.primary;
        badgeIcon = Icons.local_shipping;
        textColor = isDark ? AppColors.darkGreyDark : Colors.white;
        break;
      case 'delivered':
        badgeColor = AppColors.success;
        badgeIcon = Icons.check_circle;
        textColor = Colors.white;
        break;
      case 'canceled':
        badgeColor = theme.colorScheme.error;
        badgeIcon = Icons.cancel;
        textColor = Colors.white;
        break;
      default:
        badgeColor = AppColors.grey500;
        badgeIcon = Icons.info;
        textColor = Colors.white;
    }

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: r.smallSpace,
        vertical: r.tinySpace,
      ),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [badgeColor, badgeColor.withOpacity(0.8)],
        ),
        borderRadius: BorderRadius.circular(r.largeRadius),
        boxShadow: [
          BoxShadow(
            color: badgeColor.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            badgeIcon,
            size: r.smallIcon,
            color: textColor,
          ),
          SizedBox(width: r.tinySpace / 2),
          Text(
            widget.order.tracking.statusDisplay,
            style: AppTextStyles.labelSmall.copyWith(
              color: textColor,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }
}


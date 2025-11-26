import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/app_text_styles.dart';
import 'package:zembil/features/orders/domain/entity/order.dart';

class OrderHistoryDetailPage extends StatelessWidget {
  final OrderEntity order;

  const OrderHistoryDetailPage({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'Order Details',
          style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: Container(
            padding: EdgeInsets.all(r.tinySpace),
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              shape: BoxShape.circle,
              border: Border.all(
                color: isDark ? AppColors.gold.withOpacity(0.2) : AppColors.grey200,
              ),
            ),
            child: Icon(Icons.arrow_back_ios_new, size: 18, color: theme.iconTheme.color),
          ),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(r.largeSpace),
        child: Column(
          children: [
            // Receipt Card
            Container(
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                borderRadius: BorderRadius.circular(r.mediumRadius),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.getShadow(isDark),
                    blurRadius: 20,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Header
                  Container(
                    padding: EdgeInsets.all(r.largeSpace),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(r.mediumRadius),
                      ),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          Icons.check_circle_outline,
                          size: r.xxLargeIcon,
                          color: theme.colorScheme.primary,
                        ),
                        SizedBox(height: r.mediumSpace),
                        Text(
                          'Order Delivered',
                          style: theme.textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                        SizedBox(height: r.smallSpace),
                        Text(
                          'On ${_formatDate(order.createdAt)}',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.textTheme.bodySmall?.color,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Items List
                  Padding(
                    padding: EdgeInsets.all(r.largeSpace),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Items Purchased',
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: r.mediumSpace),
                        ...order.items.map((item) => Padding(
                              padding: EdgeInsets.only(bottom: r.mediumSpace),
                              child: Row(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(r.smallRadius),
                                    child: Image.network(
                                      item.image ?? '',
                                      width: r.wp(15),
                                      height: r.wp(15),
                                      fit: BoxFit.cover,
                                      errorBuilder: (_, __, ___) => Container(
                                        width: r.wp(15),
                                        height: r.wp(15),
                                        color: Colors.grey[200],
                                        child: const Icon(Icons.image_not_supported),
                                      ),
                                    ),
                                  ),
                                  SizedBox(width: r.mediumSpace),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          item.title,
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: theme.textTheme.bodyLarge?.copyWith(
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                        Text(
                                          'Qty: ${item.quantity}',
                                          style: theme.textTheme.bodySmall,
                                        ),
                                      ],
                                    ),
                                  ),
                                  Text(
                                    '\$${item.subtotal.toStringAsFixed(2)}',
                                    style: theme.textTheme.titleMedium?.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            )),
                        Divider(color: theme.dividerColor),
                        SizedBox(height: r.mediumSpace),
                        
                        // Payment Summary
                        _buildSummaryRow('Subtotal', '\$${order.totalPrice.toStringAsFixed(2)}', theme),
                        SizedBox(height: r.smallSpace),
                        _buildSummaryRow('Shipping', 'Free', theme),
                        SizedBox(height: r.smallSpace),
                        _buildSummaryRow('Tax', '\$0.00', theme),
                        SizedBox(height: r.mediumSpace),
                        Divider(color: theme.dividerColor),
                        SizedBox(height: r.mediumSpace),
                        _buildSummaryRow(
                          'Total',
                          '\$${order.totalPrice.toStringAsFixed(2)}',
                          theme,
                          isBold: true,
                          isLarge: true,
                          color: theme.colorScheme.primary,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: r.largeSpace),

            // Shipping Address Card
            Container(
              padding: EdgeInsets.all(r.largeSpace),
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                borderRadius: BorderRadius.circular(r.mediumRadius),
                border: Border.all(
                  color: isDark ? AppColors.gold.withOpacity(0.2) : AppColors.grey200,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.location_on_outlined, color: theme.colorScheme.primary),
                      SizedBox(width: r.smallSpace),
                      Text(
                        'Shipping Address',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: r.mediumSpace),
                  Text(
                    order.shippingAddress.addressLine1,
                    style: theme.textTheme.bodyMedium,
                  ),
                  Text(
                    '${order.shippingAddress.city}, ${order.shippingAddress.country}',
                    style: theme.textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, ThemeData theme,
      {bool isBold = false, bool isLarge = false, Color? color}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: theme.textTheme.bodyMedium?.copyWith(
            fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
            fontSize: isLarge ? 18 : 14,
          ),
        ),
        Text(
          value,
          style: theme.textTheme.bodyMedium?.copyWith(
            fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
            fontSize: isLarge ? 18 : 14,
            color: color,
          ),
        ),
      ],
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


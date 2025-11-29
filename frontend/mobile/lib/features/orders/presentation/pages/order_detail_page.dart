import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/app_text_styles.dart';
import 'package:zembil/features/orders/domain/entity/order.dart';
import 'package:zembil/features/orders/presentation/bloc/orders_bloc.dart';
import 'package:zembil/features/orders/presentation/bloc/orders_event.dart';
import 'package:zembil/features/orders/presentation/bloc/orders_state.dart';
import 'package:zembil/features/orders/presentation/widgets/order_tracking_map.dart';

class OrderDetailPage extends StatefulWidget {
  final OrderEntity order;

  const OrderDetailPage({
    super.key,
    required this.order,
  });

  @override
  State<OrderDetailPage> createState() => _OrderDetailPageState();
}

class _OrderDetailPageState extends State<OrderDetailPage> {
  bool _showMap = true;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      extendBodyBehindAppBar: true,
      appBar: _buildAppBar(theme, isDark),
      body: BlocListener<OrdersBloc, OrdersState>(
        listener: (context, state) {
          if (state is OrderCanceled) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: const Text('Order canceled successfully'),
                backgroundColor: theme.colorScheme.error,
              ),
            );
            context.pop();
          }
        },
        child: CustomScrollView(
          slivers: [
            // Map Section
            if (_showMap && widget.order.tracking.isActive)
              SliverToBoxAdapter(
                child: OrderTrackingMap(order: widget.order),
              ),

            // Content
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Order Status Timeline
                    _buildStatusTimeline(theme, isDark),

                    const SizedBox(height: 24),

                    // Estimated Delivery
                    if (widget.order.tracking.estimatedDelivery != null)
                      _buildEstimatedDelivery(theme, isDark),

                    const SizedBox(height: 24),

                    // Order Items
                    _buildOrderItems(theme, isDark),

                    const SizedBox(height: 24),

                    // Shipping Address
                    _buildShippingAddress(theme, isDark),

                    const SizedBox(height: 24),

                    // Order Summary
                    _buildOrderSummary(theme, isDark),

                    const SizedBox(height: 24),

                    // Actions
                    if (widget.order.tracking.canCancel)
                      _buildCancelButton(theme),

                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  PreferredSizeWidget _buildAppBar(ThemeData theme, bool isDark) {
    return AppBar(
      elevation: 0,
      backgroundColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
      systemOverlayStyle: isDark
          ? SystemUiOverlayStyle.light
          : SystemUiOverlayStyle.dark,
      leading: IconButton(
        icon: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: theme.cardTheme.color,
            shape: BoxShape.circle,
            border: Border.all(
              color: isDark
                  ? AppColors.gold.withOpacity(0.3)
                  : AppColors.grey300,
            ),
          ),
          child: Icon(
            Icons.arrow_back,
            color: theme.iconTheme.color,
            size: 20,
          ),
        ),
        onPressed: () => context.pop(),
      ),
      title: Text(
        'Order Details',
        style: theme.textTheme.titleLarge?.copyWith(
          fontWeight: FontWeight.bold,
        ),
      ),
      actions: [
        if (widget.order.tracking.trackingNumber != null)
          IconButton(
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                shape: BoxShape.circle,
                border: Border.all(
                  color: isDark
                      ? AppColors.gold.withOpacity(0.3)
                      : AppColors.grey300,
                ),
              ),
              child: Icon(
                Icons.content_copy,
                color: theme.iconTheme.color,
                size: 20,
              ),
            ),
            onPressed: () {
              Clipboard.setData(
                ClipboardData(text: widget.order.tracking.trackingNumber!),
              );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text('Tracking number copied!'),
                  backgroundColor: theme.colorScheme.primary,
                ),
              );
            },
          ),
        const SizedBox(width: 8),
      ],
    );
  }

  Widget _buildStatusTimeline(ThemeData theme, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark
              ? AppColors.gold.withOpacity(0.2)
              : AppColors.grey200,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Order Status',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          ...widget.order.tracking.statusHistory.map((history) {
            final isLast = history ==
                widget.order.tracking.statusHistory.last;
            return _buildTimelineItem(
              theme,
              isDark,
              history,
              !isLast,
            );
          }),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(
    ThemeData theme,
    bool isDark,
    StatusHistory history,
    bool showLine,
  ) {
    return IntrinsicHeight(
      child: Row(
        children: [
          // Timeline indicator
          Column(
            children: [
              Container(
                width: 20,
                height: 20,
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: theme.colorScheme.primary.withOpacity(0.3),
                    width: 3,
                  ),
                ),
                child: Icon(
                  Icons.check,
                  size: 12,
                  color: isDark ? AppColors.darkGreyDark : Colors.white,
                ),
              ),
              if (showLine)
                Expanded(
                  child: Container(
                    width: 2,
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.3),
                    ),
                  ),
                ),
            ],
          ),

          const SizedBox(width: 16),

          // Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _getStatusDisplayText(history.status),
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _formatDateTime(history.timestamp),
                    style: theme.textTheme.bodySmall,
                  ),
                  if (history.location != null) ...[
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(
                          Icons.location_on_outlined,
                          size: 14,
                          color: theme.textTheme.bodySmall?.color,
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            history.location!,
                            style: theme.textTheme.bodySmall,
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getStatusDisplayText(String status) {
    switch (status) {
      case 'pending':
        return 'Order Pending';
      case 'confirmed':
        return 'Order Confirmed';
      case 'processing':
        return 'Processing Your Order';
      case 'shipped':
        return 'Shipped';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'canceled':
        return 'Order Canceled';
      default:
        return status;
    }
  }

  Widget _buildEstimatedDelivery(ThemeData theme, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: theme.colorScheme.primary.withOpacity(0.3),
        ),
      ),
      child: Row(
        children: [
          Icon(
            Icons.local_shipping_outlined,
            color: theme.colorScheme.primary,
            size: 24,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Estimated Delivery',
                  style: theme.textTheme.bodySmall,
                ),
                const SizedBox(height: 4),
                Text(
                  _formatDate(widget.order.tracking.estimatedDelivery!),
                  style: theme.textTheme.titleSmall?.copyWith(
                    color: theme.colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderItems(ThemeData theme, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark
              ? AppColors.gold.withOpacity(0.2)
              : AppColors.grey200,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Order Items',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          ...widget.order.items.map((item) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.network(
                      item.image ?? '',
                      width: 60,
                      height: 60,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          width: 60,
                          height: 60,
                          color: isDark
                              ? AppColors.darkGreyLight
                              : AppColors.grey100,
                          child: Icon(
                            Icons.image_not_supported_outlined,
                            color: theme.iconTheme.color?.withOpacity(0.3),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.title,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: theme.textTheme.titleSmall,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '\$${item.price.toStringAsFixed(2)} x ${item.quantity}',
                          style: theme.textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ),
                  Text(
                    '\$${item.subtotal.toStringAsFixed(2)}',
                    style: theme.textTheme.titleSmall?.copyWith(
                      color: theme.colorScheme.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildShippingAddress(ThemeData theme, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark
              ? AppColors.gold.withOpacity(0.2)
              : AppColors.grey200,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.location_on_outlined,
                color: theme.colorScheme.primary,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                'Shipping Address',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            widget.order.shippingAddress.fullAddress,
            style: theme.textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }

  Widget _buildOrderSummary(ThemeData theme, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark
              ? AppColors.gold.withOpacity(0.2)
              : AppColors.grey200,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Payment Summary',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          _buildSummaryRow(
            'Subtotal',
            '\$${widget.order.totalPrice.toStringAsFixed(2)}',
            theme,
            false,
          ),
          const SizedBox(height: 12),
          _buildSummaryRow(
            'Shipping',
            'Free',
            theme,
            false,
            valueColor: theme.colorScheme.primary,
          ),
          const SizedBox(height: 12),
          _buildSummaryRow(
            'Payment Method',
            widget.order.paymentMethod.toUpperCase(),
            theme,
            false,
          ),
          const SizedBox(height: 12),
          Divider(color: theme.dividerTheme.color),
          const SizedBox(height: 12),
          _buildSummaryRow(
            'Total',
            '\$${widget.order.totalPrice.toStringAsFixed(2)}',
            theme,
            true,
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(
    String label,
    String value,
    ThemeData theme,
    bool isTotal, {
    Color? valueColor,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: isTotal
              ? theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                )
              : theme.textTheme.bodyMedium,
        ),
        Text(
          value,
          style: isTotal
              ? theme.textTheme.titleLarge?.copyWith(
                  color: theme.colorScheme.primary,
                  fontWeight: FontWeight.bold,
                )
              : theme.textTheme.bodyMedium?.copyWith(
                  color: valueColor,
                  fontWeight: FontWeight.w600,
                ),
        ),
      ],
    );
  }

  Widget _buildCancelButton(ThemeData theme) {
    return BlocBuilder<OrdersBloc, OrdersState>(
      builder: (context, state) {
        if (state is OrderCanceling) {
          return SizedBox(
            height: 56,
            child: Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(
                  theme.colorScheme.error,
                ),
              ),
            ),
          );
        }

        return SizedBox(
          width: double.infinity,
          height: 56,
          child: OutlinedButton(
            onPressed: () => _showCancelDialog(context, theme),
            style: OutlinedButton.styleFrom(
              foregroundColor: theme.colorScheme.error,
              side: BorderSide(
                color: theme.colorScheme.error,
                width: 2,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: Text(
              'Cancel Order',
              style: AppTextStyles.button.copyWith(
                color: theme.colorScheme.error,
              ),
            ),
          ),
        );
      },
    );
  }

  void _showCancelDialog(BuildContext context, ThemeData theme) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: Row(
          children: [
            Icon(
              Icons.warning_amber_rounded,
              color: theme.colorScheme.error,
            ),
            const SizedBox(width: 12),
            Text(
              'Cancel Order',
              style: theme.textTheme.titleLarge,
            ),
          ],
        ),
        content: Text(
          'Are you sure you want to cancel this order? This action cannot be undone.',
          style: theme.textTheme.bodyLarge,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: Text(
              'Keep Order',
              style: TextStyle(color: theme.textTheme.bodyLarge?.color),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              context.read<OrdersBloc>().add(
                    CancelOrderEvent(widget.order.id),
                  );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: theme.colorScheme.error,
              foregroundColor: Colors.white,
            ),
            child: const Text('Cancel Order'),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return '${days[date.weekday - 1]}, ${months[date.month - 1]} ${date.day}, ${date.year}';
  }

  String _formatDateTime(DateTime date) {
    final months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    
    final hour = date.hour > 12 ? date.hour - 12 : date.hour;
    final period = date.hour >= 12 ? 'PM' : 'AM';
    final minute = date.minute.toString().padLeft(2, '0');
    
    return '${months[date.month - 1]} ${date.day}, ${date.year} - $hour:$minute $period';
  }
}


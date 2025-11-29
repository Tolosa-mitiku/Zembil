import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/features/orders/domain/entity/order.dart';

class OrderTrackingPage extends StatelessWidget {
  final OrderEntity order;

  const OrderTrackingPage({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: Stack(
        children: [
          // Map Placeholder (Full Screen)
          Container(
            height: double.infinity,
            width: double.infinity,
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF242f3e) : const Color(0xFFe5e5e5),
              image: const DecorationImage(
                image: NetworkImage('https://i.imgur.com/m6G015e.png'), // Minimal map placeholder
                fit: BoxFit.cover,
                opacity: 0.6,
              ),
            ),
            child: Center(
              child: Icon(
                Icons.location_on,
                color: theme.colorScheme.primary,
                size: 48,
              ),
            ),
          ),

          // Back Button
          Positioned(
            top: r.topSafeArea + r.mediumSpace,
            left: r.mediumSpace,
            child: IconButton(
              icon: Container(
                padding: EdgeInsets.all(r.tinySpace),
                decoration: BoxDecoration(
                  color: theme.cardTheme.color,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 8,
                    ),
                  ],
                ),
                child: Icon(Icons.arrow_back_ios_new, size: 18, color: theme.iconTheme.color),
              ),
              onPressed: () => context.pop(),
            ),
          ),

          // Bottom Sheet with Tracking Info
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: EdgeInsets.all(r.largeSpace),
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                borderRadius: BorderRadius.vertical(top: Radius.circular(r.xLargeRadius)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 20,
                    offset: const Offset(0, -5),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      margin: EdgeInsets.only(bottom: r.largeSpace),
                      decoration: BoxDecoration(
                        color: theme.dividerColor,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Estimated Delivery',
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: theme.textTheme.bodySmall?.color,
                            ),
                          ),
                          SizedBox(height: r.tinySpace),
                          Text(
                            '25 mins',
                            style: theme.textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.primary,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: EdgeInsets.all(r.mediumSpace),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.local_shipping_outlined,
                          color: theme.colorScheme.primary,
                          size: r.largeIcon,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: r.largeSpace),
                  Divider(color: theme.dividerColor),
                  SizedBox(height: r.largeSpace),
                  
                  // Timeline
                  _buildTimelineItem(
                    title: 'Order Placed',
                    time: '10:00 AM',
                    isCompleted: true,
                    isLast: false,
                    theme: theme,
                    r: r,
                  ),
                  _buildTimelineItem(
                    title: 'Preparing',
                    time: '10:15 AM',
                    isCompleted: true,
                    isLast: false,
                    theme: theme,
                    r: r,
                  ),
                  _buildTimelineItem(
                    title: 'On the way',
                    time: '10:45 AM',
                    isCompleted: true,
                    isLast: false,
                    theme: theme,
                    r: r,
                  ),
                  _buildTimelineItem(
                    title: 'Delivered',
                    time: 'Estimated 11:10 AM',
                    isCompleted: false,
                    isLast: true,
                    theme: theme,
                    r: r,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem({
    required String title,
    required String time,
    required bool isCompleted,
    required bool isLast,
    required ThemeData theme,
    required Responsive r,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 16,
              height: 16,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isCompleted ? theme.colorScheme.primary : theme.disabledColor,
                border: Border.all(
                  color: Colors.white,
                  width: 2,
                ),
                boxShadow: [
                  BoxShadow(
                    color: (isCompleted ? theme.colorScheme.primary : theme.disabledColor)
                        .withOpacity(0.3),
                    blurRadius: 4,
                  ),
                ],
              ),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 30,
                color: isCompleted
                    ? theme.colorScheme.primary.withOpacity(0.5)
                    : theme.dividerColor,
              ),
          ],
        ),
        SizedBox(width: r.mediumSpace),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: theme.textTheme.titleSmall?.copyWith(
                  fontWeight: isCompleted ? FontWeight.bold : FontWeight.normal,
                  color: isCompleted
                      ? theme.textTheme.titleSmall?.color
                      : theme.disabledColor,
                ),
              ),
              if (!isLast) SizedBox(height: r.mediumSpace),
            ],
          ),
        ),
        Text(
          time,
          style: theme.textTheme.bodySmall?.copyWith(
            color: theme.disabledColor,
          ),
        ),
      ],
    );
  }
}


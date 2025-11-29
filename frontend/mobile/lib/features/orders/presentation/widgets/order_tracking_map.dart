import 'package:flutter/material.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/app_text_styles.dart';
import 'package:zembil/features/orders/domain/entity/order.dart';

/// Order Tracking Map Widget
/// TODO: Replace with Google Maps integration
/// Add google_maps_flutter package and implement real map
class OrderTrackingMap extends StatelessWidget {
  final OrderEntity order;

  const OrderTrackingMap({
    super.key,
    required this.order,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final location = order.tracking.currentLocation;

    return Container(
      height: 300,
      margin: const EdgeInsets.only(top: 100), // Space for transparent app bar
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            theme.colorScheme.primary.withOpacity(0.1),
            theme.colorScheme.primary.withOpacity(0.05),
          ],
        ),
      ),
      child: Stack(
        children: [
          // Map Placeholder (Replace with Google Maps)
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: theme.cardTheme.color,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: theme.colorScheme.primary.withOpacity(0.3),
                      width: 3,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: theme.colorScheme.primary.withOpacity(0.2),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.location_on,
                    size: 48,
                    color: theme.colorScheme.primary,
                  ),
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  decoration: BoxDecoration(
                    color: theme.cardTheme.color,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: theme.colorScheme.primary.withOpacity(0.3),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.getShadow(isDark),
                        blurRadius: 12,
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.my_location,
                        size: 16,
                        color: theme.colorScheme.primary,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        location?.address ?? 'Tracking in progress...',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Real-time tracking',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.primary,
                  ),
                ),
              ],
            ),
          ),

          // TODO: Implement Google Maps here
          // Example implementation:
          // GoogleMap(
          //   initialCameraPosition: CameraPosition(
          //     target: LatLng(
          //       location?.latitude ?? 0,
          //       location?.longitude ?? 0,
          //     ),
          //     zoom: 14,
          //   ),
          //   markers: {
          //     Marker(
          //       markerId: MarkerId('current_location'),
          //       position: LatLng(
          //         location?.latitude ?? 0,
          //         location?.longitude ?? 0,
          //       ),
          //     ),
          //   },
          // ),

          // Instructions overlay (remove when map is implemented)
          Positioned(
            bottom: 16,
            left: 20,
            right: 20,
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withOpacity(0.9),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.info_outline,
                    size: 16,
                    color: isDark ? AppColors.darkGreyDark : Colors.white,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Live map tracking coming soon',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: isDark ? AppColors.darkGreyDark : Colors.white,
                      ),
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
}


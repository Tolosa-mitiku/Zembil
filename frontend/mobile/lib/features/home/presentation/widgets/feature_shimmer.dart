import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';

class FeaturesShimmer extends StatelessWidget {
  const FeaturesShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header skeleton
        Padding(
          padding: EdgeInsets.symmetric(horizontal: r.smallSpace),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Shimmer.fromColors(
                baseColor: isDark ? AppColors.grey800 : AppColors.grey200,
                highlightColor: isDark ? AppColors.grey700 : AppColors.grey100,
                child: Container(
                  width: r.wp(35),
                  height: r.hp(2.4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(r.tinyRadius),
                  ),
                ),
              ),
              Shimmer.fromColors(
                baseColor: isDark ? AppColors.grey800 : AppColors.grey200,
                highlightColor: isDark ? AppColors.grey700 : AppColors.grey100,
                child: Container(
                  width: r.wp(16),
                  height: r.hp(3.6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(r.tinyRadius),
                  ),
                ),
              ),
            ],
          ),
        ),
        SizedBox(height: r.smallSpace),
        // Single wide card skeleton (simpler than carousel)
        Padding(
          padding: EdgeInsets.symmetric(horizontal: r.smallSpace),
          child: Shimmer.fromColors(
            baseColor: isDark ? AppColors.grey800 : AppColors.grey200,
            highlightColor: isDark ? AppColors.grey700 : AppColors.grey100,
            child: Container(
              height: r.hp(22),
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                borderRadius: BorderRadius.circular(r.largeRadius),
                border: Border.all(
                  color: isDark ? AppColors.grey800 : AppColors.grey200,
                ),
              ),
            ),
          ),
        ),
        SizedBox(height: r.tinySpace),
        // Page dots skeleton
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            3,
            (index) => Container(
              margin: EdgeInsets.symmetric(horizontal: r.tinySpace),
              width: index == 0 ? r.wp(6) : r.wp(2.5),
              height: r.hp(0.9),
              decoration: BoxDecoration(
                color: isDark
                    ? AppColors.gold.withOpacity(index == 0 ? 0.9 : 0.35)
                    : AppColors.gold.withOpacity(index == 0 ? 0.9 : 0.35),
                borderRadius: BorderRadius.circular(999),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

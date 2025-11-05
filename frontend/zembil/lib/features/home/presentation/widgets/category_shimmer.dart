import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';

class CategoryShimmer extends StatelessWidget {
  const CategoryShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return SizedBox(
      height: r.hp(5.5),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: 7,
        itemBuilder: (context, index) {
          return Shimmer.fromColors(
            baseColor: isDark ? AppColors.grey800 : AppColors.grey200,
            highlightColor: isDark ? AppColors.grey700 : AppColors.grey100,
            child: Container(
              margin: EdgeInsets.only(right: index < 6 ? r.smallSpace : 0),
              padding: EdgeInsets.symmetric(
                horizontal: r.mediumSpace,
                vertical: r.tinySpace + 4,
              ),
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                borderRadius: BorderRadius.circular(30),
                border: Border.all(
                  color: isDark ? AppColors.grey800 : AppColors.grey200,
                ),
              ),
              child: Center(
                child: Container(
                  width: r.wp(18),
                  height: r.hp(1.5),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(r.tinyRadius),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

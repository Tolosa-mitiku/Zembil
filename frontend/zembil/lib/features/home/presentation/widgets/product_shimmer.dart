import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';

class ProductsShimmer extends StatelessWidget {
  const ProductsShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return GridView.builder(
      padding: EdgeInsets.only(bottom: r.mediumSpace),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.65,
      ),
      itemCount: 6,
      itemBuilder: (context, index) {
        return Shimmer.fromColors(
          baseColor: isDark ? AppColors.grey800 : AppColors.grey200,
          highlightColor: isDark ? AppColors.grey700 : AppColors.grey100,
          child: Container(
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              borderRadius: BorderRadius.circular(r.mediumRadius),
              border: Border.all(
                color: isDark ? AppColors.grey800 : AppColors.grey200,
              ),
            ),
            child: Padding(
              padding: EdgeInsets.all(r.smallSpace),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Image skeleton
                  ClipRRect(
                    borderRadius: BorderRadius.circular(r.smallRadius),
                    child: Container(
                      height: r.hp(14),
                      width: double.infinity,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: r.smallSpace),
                  // Title lines
                  Container(
                    width: double.infinity,
                    height: r.hp(1.5),
                    color: Colors.white,
                  ),
                  SizedBox(height: r.tinySpace),
                  Container(
                    width: r.wp(40),
                    height: r.hp(1.5),
                    color: Colors.white,
                  ),
                  SizedBox(height: r.smallSpace),
                  // Price row
                  Row(
                    children: [
                      Container(
                        width: r.wp(20),
                        height: r.hp(2),
                        color: Colors.white,
                      ),
                      SizedBox(width: r.smallSpace),
                      Container(
                        width: r.wp(12),
                        height: r.hp(1.4),
                        color: Colors.white,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

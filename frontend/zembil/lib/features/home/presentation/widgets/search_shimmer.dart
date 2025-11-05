import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';

class SearchShimmer extends StatelessWidget {
  const SearchShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return ListView.separated(
      padding: EdgeInsets.all(r.mediumSpace),
      itemCount: 8,
      separatorBuilder: (_, __) => SizedBox(height: r.smallSpace),
      itemBuilder: (context, index) {
        return Shimmer.fromColors(
          baseColor: isDark ? AppColors.grey800 : AppColors.grey200,
          highlightColor: isDark ? AppColors.grey700 : AppColors.grey100,
          child: Container(
            padding: EdgeInsets.all(r.smallSpace),
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              borderRadius: BorderRadius.circular(r.mediumRadius),
              border: Border.all(
                color: isDark ? AppColors.grey800 : AppColors.grey200,
              ),
            ),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(r.smallRadius),
                  child: Container(
                    width: r.wp(15),
                    height: r.wp(15),
                    color: Colors.white,
                  ),
                ),
                SizedBox(width: r.mediumSpace),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: double.infinity,
                        height: r.hp(1.6),
                        color: Colors.white,
                      ),
                      SizedBox(height: r.tinySpace),
                      Container(
                        width: r.wp(30),
                        height: r.hp(1.4),
                        color: Colors.white,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}


import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';

class OrdersShimmer extends StatelessWidget {
  const OrdersShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return ListView.builder(
      padding: EdgeInsets.all(r.mediumSpace),
      itemCount: 5,
      itemBuilder: (context, index) {
        return Container(
          margin: EdgeInsets.only(bottom: r.mediumSpace),
          decoration: BoxDecoration(
            color: theme.cardTheme.color,
            borderRadius: BorderRadius.circular(r.cardBorderRadius.topLeft.x),
            border: Border.all(
              color: isDark ? AppColors.grey800 : AppColors.grey200,
            ),
          ),
          child: Shimmer.fromColors(
            baseColor: isDark ? AppColors.grey800 : AppColors.grey200,
            highlightColor: isDark ? AppColors.grey700 : AppColors.grey100,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Container(
                  padding: EdgeInsets.all(r.mediumSpace),
                  decoration: BoxDecoration(
                    color: Colors.white, // Placeholder for gradient
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(r.cardBorderRadius.topLeft.x),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        width: r.wp(30),
                        height: r.hp(2),
                        color: Colors.white,
                      ),
                      Container(
                        width: r.wp(20),
                        height: r.hp(3),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(r.largeRadius),
                        ),
                      ),
                    ],
                  ),
                ),
                // Content
                Padding(
                  padding: EdgeInsets.all(r.mediumSpace),
                  child: Column(
                    children: List.generate(2, (index) => Padding(
                      padding: EdgeInsets.only(bottom: r.smallSpace),
                      child: Row(
                        children: [
                          Container(
                            width: r.wp(15),
                            height: r.wp(15),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(r.tinyRadius),
                            ),
                          ),
                          SizedBox(width: r.smallSpace),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  width: double.infinity,
                                  height: r.hp(1.5),
                                  color: Colors.white,
                                ),
                                SizedBox(height: r.tinySpace),
                                Container(
                                  width: r.wp(20),
                                  height: r.hp(1.5),
                                  color: Colors.white,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    )),
                  ),
                ),
                // Footer
                Padding(
                  padding: EdgeInsets.all(r.mediumSpace),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: r.wp(20),
                            height: r.hp(1.5),
                            color: Colors.white,
                          ),
                          SizedBox(height: r.tinySpace),
                          Container(
                            width: r.wp(25),
                            height: r.hp(2.5),
                            color: Colors.white,
                          ),
                        ],
                      ),
                      Container(
                        width: r.wp(25),
                        height: r.hp(4),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(r.smallRadius),
                        ),
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


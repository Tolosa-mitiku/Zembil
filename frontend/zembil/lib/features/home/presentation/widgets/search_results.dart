import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/app_text_styles.dart';
import 'package:zembil/features/home/domain/entity/product.dart';

class SearchResults extends StatelessWidget {
  final List<ProductEntity> products;
  final String query;

  const SearchResults({
    super.key,
    required this.products,
    required this.query,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    if (products.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_off_rounded,
              size: r.xxLargeIcon,
              color: theme.disabledColor,
            ),
            SizedBox(height: r.mediumSpace),
            Text(
              'No results found for "$query"',
              style: theme.textTheme.titleMedium?.copyWith(
                color: theme.disabledColor,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: EdgeInsets.all(r.mediumSpace),
      itemCount: products.length,
      itemBuilder: (context, index) {
        final product = products[index];
        return GestureDetector(
          onTap: () => context.push("/index/products/${product.id}"),
          child: Container(
            margin: EdgeInsets.only(bottom: r.mediumSpace),
            padding: EdgeInsets.all(r.smallSpace),
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              borderRadius: BorderRadius.circular(r.mediumRadius),
              border: Border.all(
                color: isDark ? AppColors.gold.withOpacity(0.1) : AppColors.grey200,
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.getShadow(isDark),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(r.smallRadius),
                  child: Image.network(
                    product.images.isNotEmpty ? product.images[0] : '',
                    width: r.wp(20),
                    height: r.wp(20),
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      width: r.wp(20),
                      height: r.wp(20),
                      color: isDark ? AppColors.darkGreyLight : AppColors.grey100,
                      child: Icon(Icons.image_not_supported_outlined, size: 24),
                    ),
                  ),
                ),
                SizedBox(width: r.mediumSpace),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        product.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: r.tinySpace),
                      Text(
                        product.category,
                        style: theme.textTheme.bodySmall,
                      ),
                      SizedBox(height: r.smallSpace),
                      Text(
                        '\$${product.price.toStringAsFixed(2)}',
                        style: theme.textTheme.titleMedium?.copyWith(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.chevron_right_rounded,
                  color: theme.iconTheme.color?.withOpacity(0.5),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}


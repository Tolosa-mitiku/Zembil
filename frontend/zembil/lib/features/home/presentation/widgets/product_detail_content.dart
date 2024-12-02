import 'package:flutter/material.dart';
import 'package:zembil/features/home/domain/entity/product.dart';
import 'package:zembil/features/home/presentation/widgets/product_description.dart';
import 'package:zembil/features/home/presentation/widgets/product_images.dart';
import 'package:zembil/features/home/presentation/widgets/product_sizes.dart';
import 'package:zembil/features/home/presentation/widgets/related_products.dart';

class ProductDetailContent extends StatelessWidget {
  final ProductEntity product;
  final List<ProductEntity> relatedProducts;

  const ProductDetailContent({
    super.key,
    required this.product,
    required this.relatedProducts,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.only(top: 50),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: () => Navigator.of(context).pop(),
                ),
                IconButton(
                  icon: const Icon(Icons.favorite_border),
                  onPressed: () {},
                ),
              ],
            ),
            // Product Images
            ProductImages(images: product.images),

            // Product Info
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(product.category,
                      style: Theme.of(context).textTheme.bodyLarge),
                  const SizedBox(height: 5),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        product.title,
                        style: Theme.of(context).textTheme.headlineLarge,
                      ),
                      Text(
                        '\$${product.price}',
                        style: Theme.of(context).textTheme.headlineLarge,
                      ),
                    ],
                  ),
                  SizedBox(height: 20),

                  // Sizes
                  ProductSizes(
                      sizes: ["1", "2", "3", "4", "5"],
                      selectedCategory: "1",
                      onSizeSelected: (size) {}),
                  SizedBox(height: 20),
                  // Description
                  ProductDescription(description: product.description ?? ""),
                  SizedBox(height: 20),
                  // Related Products
                  RelatedProducts(relatedProducts: relatedProducts),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:zembil/features/home/domain/entity/product.dart';

class ProductInfo extends StatelessWidget {
  final ProductEntity product;
  const ProductInfo(this.product, {super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(product.category, style: Theme.of(context).textTheme.bodyLarge),
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
      ],
    );
  }
}

import 'package:flutter/material.dart';
import 'package:zembil/features/home/domain/entity/product.dart';

class RelatedProducts extends StatelessWidget {
  final List<ProductEntity> relatedProducts;

  const RelatedProducts(this.relatedProducts, {super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('You might also like',
            style: Theme.of(context).textTheme.headlineLarge),
        const SizedBox(height: 15),
        SizedBox(
          height: 100,
          child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: relatedProducts.length,
              itemBuilder: (context, index) {
                final relatedProduct = relatedProducts[index];

                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 5),
                  child: GestureDetector(
                    // onTap: () => onSizeSelected(size),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(relatedProduct.images[0],
                          height: 100, width: 100, fit: BoxFit.cover),
                    ),
                  ),
                );
              }),
        ),
      ],
    );
  }
}

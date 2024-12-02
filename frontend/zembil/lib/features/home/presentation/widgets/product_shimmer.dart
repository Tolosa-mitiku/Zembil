import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class ProductsShimmer extends StatelessWidget {
  const ProductsShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2, // Two items per row
          crossAxisSpacing: 20,
          mainAxisSpacing: 20,
          childAspectRatio:
              2 / 3, // Ensures the top section occupies 2/3 height
        ),
        itemCount: 6, // Simulate 6 loading placeholders
        itemBuilder: (context, index) {
          return Shimmer.fromColors(
            baseColor: Colors.black54,
            highlightColor: Colors.black45,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.black54,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Placeholder for Product Image
                  Expanded(
                    flex: 2,
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Shimmer.fromColors(
                          baseColor: Colors.black54,
                          highlightColor: Colors.black45,
                          child: Container(
                            decoration: BoxDecoration(
                              color: Colors.black54,
                              borderRadius: BorderRadius.circular(15),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  // Placeholder for Product Name and Price
                  Expanded(
                    flex: 1,
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Simulated Product Title
                          Shimmer.fromColors(
                            baseColor: Colors.black54,
                            highlightColor: Colors.black45,
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.black54,
                                borderRadius: BorderRadius.circular(15),
                              ),
                              height: 16,
                              width: double.infinity,
                            ),
                          ),
                          const SizedBox(height: 8),
                          // Simulated Product Price
                          Shimmer.fromColors(
                            baseColor: Colors.black54,
                            highlightColor: Colors.black45,
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.black54,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              height: 14,
                              width: 80,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

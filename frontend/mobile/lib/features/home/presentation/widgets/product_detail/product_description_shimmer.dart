import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class ProductDescriptionShimmer extends StatelessWidget {
  const ProductDescriptionShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Shimmer.fromColors(
          baseColor: Colors.black54,
          highlightColor: Colors.black45,
          child: Container(
            decoration: BoxDecoration(
              color: Colors.black54,
              borderRadius: BorderRadius.circular(8),
            ),
            height: 16,
            width: 100,
          ),
        ),
        const SizedBox(height: 20),
        Shimmer.fromColors(
          baseColor: Colors.black54,
          highlightColor: Colors.black45,
          child: Container(
            decoration: BoxDecoration(
              color: Colors.black54,
              borderRadius: BorderRadius.circular(8),
            ),
            height: 8,
            width: double.infinity,
          ),
        ),
        const SizedBox(height: 20),
        Shimmer.fromColors(
          baseColor: Colors.black54,
          highlightColor: Colors.black45,
          child: Container(
            decoration: BoxDecoration(
              color: Colors.black54,
              borderRadius: BorderRadius.circular(8),
            ),
            height: 8,
            width: 150,
          ),
        ),
      ],
    );
  }
}

import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class ProductInfoShimmer extends StatelessWidget {
  const ProductInfoShimmer({super.key});

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
            height: 8,
            width: 50,
          ),
        ),
        const SizedBox(height: 5),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                width: 120,
              ),
            ),
            Shimmer.fromColors(
              baseColor: Colors.black54,
              highlightColor: Colors.black45,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.black54,
                  borderRadius: BorderRadius.circular(8),
                ),
                height: 16,
                width: 80,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

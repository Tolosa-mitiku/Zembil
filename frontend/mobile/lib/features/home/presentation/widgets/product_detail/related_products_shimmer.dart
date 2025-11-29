import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class RelatedProductsShimmer extends StatelessWidget {
  const RelatedProductsShimmer({super.key});

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
        const SizedBox(height: 15),
        SizedBox(
          height: 100,
          child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 3,
              itemBuilder: (context, index) {
                return Shimmer.fromColors(
                  baseColor: Colors.black54,
                  highlightColor: Colors.black45,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 5),
                    child: Container(
                      height: 100,
                      width: 100,
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),
                  ),
                );
              }),
        ),
      ],
    );
  }
}

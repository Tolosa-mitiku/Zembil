import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class ProductSizesShimmer extends StatelessWidget {
  const ProductSizesShimmer({super.key});

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
            width: 120,
          ),
        ),
        const SizedBox(height: 20),
        SizedBox(
          height: 37,
          child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 5,
              itemBuilder: (context, index) {
                return Shimmer.fromColors(
                  baseColor: Colors.black54,
                  highlightColor: Colors.black45,
                  child: Container(
                    height: 37,
                    width: 37,
                    margin: EdgeInsets.only(right: 10),
                    padding: EdgeInsets.symmetric(vertical: 8, horizontal: 15),
                    decoration: BoxDecoration(
                      color: Colors.black54,
                      borderRadius: BorderRadius.circular(18),
                    ),
                  ),
                );
              }),
        ),
      ],
    );
  }
}

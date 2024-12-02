import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class CategoryShimmer extends StatelessWidget {
  const CategoryShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 37,
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
      ),
      child: ListView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: 8,
          itemBuilder: (context, index) {
            return Shimmer.fromColors(
              baseColor: Colors.black54,
              highlightColor: Colors.black38,
              child: Container(
                width: 100,
                margin: EdgeInsets.only(right: 10),
                decoration: BoxDecoration(
                  color: Colors.black54,
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            );
          }),
    );
  }
}

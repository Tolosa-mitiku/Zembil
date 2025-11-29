import 'package:flutter/material.dart';
import 'package:zembil/features/home/presentation/widgets/feature_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/search.dart';

class GridScrollEffect extends StatelessWidget {
  const GridScrollEffect({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        // Sliver that starts in the middle of the screen
        SliverPersistentHeader(
          pinned: true, // Keeps the grid header in view when scrolled
          delegate: _GridHeaderDelegate(),
        ),

        // Scrollable grid
        SliverGrid(
          delegate: SliverChildBuilderDelegate(
            (context, index) {
              return Container(
                color: Colors.teal[(index % 9 + 1) * 100],
                child: Center(
                  child: Text(
                    "Item $index",
                    style: TextStyle(color: Colors.white, fontSize: 20),
                  ),
                ),
              );
            },
            childCount: 50, // Number of items in the grid
          ),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2, // Number of columns
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 1,
          ),
        ),
      ],
    );
  }
}

class _GridHeaderDelegate extends SliverPersistentHeaderDelegate {
  @override
  double get minExtent => 200; // Minimum height when collapsed
  @override
  double get maxExtent => 400; // Maximum height when expanded

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    // Calculate the vertical alignment of the grid
    double progress = shrinkOffset / (maxExtent - minExtent);
    progress = progress.clamp(0.0, 1.0); // Ensure progress is between 0 and 1

    return Stack(
      fit: StackFit.expand,
      children: [
        // Background color or image
        Container(
          padding: EdgeInsets.only(left: 8, right: 8, top: 45),
          color: Colors.green,
          child: Column(
            children: [
              Search(),
            ],
          ),
        ),
        // Align(
        //   alignment: Alignment.topCenter,
        //   child: Container(
        //     // margin: EdgeInsets.only(top: 50, bottom: 10, left: 8, right: 8),
        //     color: Colors.blue,
        //     child: Search(),
        //   ),
        // ),

        // Grid preview in the center
        Align(
          alignment: Alignment(0, 1 - progress), // Dynamic alignment
          child: Opacity(
            opacity: 1 - progress, // Fade out as it expands
            child: Container(
              color: Colors.red,
              height: 200, // Fixed height for the middle grid preview
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // SizedBox(height: 30),
                  FeaturesShimmer(),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  @override
  bool shouldRebuild(covariant SliverPersistentHeaderDelegate oldDelegate) {
    return true;
  }
}

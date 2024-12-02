import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class FeaturesShimmer extends StatelessWidget {
  const FeaturesShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: SizedBox(
        height: 150,
        child: PageView.builder(
          itemCount: 6, // Number of discount items
          controller: PageController(viewportFraction: 0.9),
          itemBuilder: (context, index) {
            return Shimmer.fromColors(
              baseColor: Colors.black54,
              highlightColor: Colors.black45,
              child: Container(
                margin: EdgeInsets.symmetric(horizontal: 5),
                padding: EdgeInsets.only(left: 10),
                decoration: BoxDecoration(
                  color: Colors.black54,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Container(
                        padding: EdgeInsets.all(13),
                        decoration: BoxDecoration(
                          color: Colors.black54,
                          borderRadius: BorderRadius.circular(15),
                        ),
                        width: 130,
                        height: 130,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            Shimmer.fromColors(
                              baseColor: Colors.black54,
                              highlightColor: Colors.black45,
                              child: Container(
                                decoration: BoxDecoration(
                                  color: Colors.black54,
                                  borderRadius: BorderRadius.circular(15),
                                ),
                                height: 16,
                              ),
                            ),
                            Shimmer.fromColors(
                              baseColor: Colors.black54,
                              highlightColor: Colors.black45,
                              child: Container(
                                decoration: BoxDecoration(
                                  color: Colors.black54,
                                  borderRadius: BorderRadius.circular(15),
                                ),
                                height: 16,
                              ),
                            ),
                            Shimmer.fromColors(
                              baseColor: Colors.black54,
                              highlightColor: Colors.black45,
                              child: Container(
                                decoration: BoxDecoration(
                                  color: Colors.black54,
                                  borderRadius: BorderRadius.circular(15),
                                ),
                                height: 35,
                                width: 100,
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
      ),
    );
  }
}

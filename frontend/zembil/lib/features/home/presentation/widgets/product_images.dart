import 'package:flutter/material.dart';

class ProductImages extends StatelessWidget {
  final List<String> images;

  const ProductImages({super.key, required this.images});

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.bottomCenter,
      children: [
        Image.network(images[0],
            height: 300, width: double.infinity, fit: BoxFit.cover),
        Padding(
          padding: const EdgeInsets.only(bottom: 15),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: images
                .take(3)
                .map((image) => Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4.0),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(image,
                            height: 80, width: 80, fit: BoxFit.cover),
                      ),
                    ))
                .toList(),
          ),
        ),
      ],
    );
  }
}

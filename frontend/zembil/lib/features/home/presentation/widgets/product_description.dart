import 'package:flutter/material.dart';

class ProductDescription extends StatelessWidget {
  final String description;

  const ProductDescription({super.key, required this.description});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Description',
          style: Theme.of(context).textTheme.headlineLarge,
        ),
        const SizedBox(height: 20),
        Text(description, style: Theme.of(context).textTheme.bodyLarge),
      ],
    );
  }
}

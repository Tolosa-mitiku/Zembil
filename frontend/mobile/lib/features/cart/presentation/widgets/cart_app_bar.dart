import 'package:flutter/material.dart';

class CartAppBar extends StatelessWidget {
  const CartAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            print(Navigator.of(context));
            Navigator.of(context).pop();
          },
        ),
        Text(
          "Cart",
          style: Theme.of(context).textTheme.headlineLarge,
        ),
        IconButton(
          icon: const Icon(Icons.favorite_border),
          onPressed: () {},
        ),
      ],
    );
  }
}

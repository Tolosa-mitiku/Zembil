import 'package:flutter/material.dart';

class ProductSizes extends StatelessWidget {
  final List<String> sizes;
  final String selectedCategory;
  final Function(String) onSizeSelected;

  const ProductSizes(
      {super.key,
      required this.sizes,
      required this.selectedCategory,
      required this.onSizeSelected});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Available Sizes',
          style: Theme.of(context).textTheme.headlineLarge,
        ),
        const SizedBox(height: 20),
        SizedBox(
          height: 37,
          child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: sizes.length,
              itemBuilder: (context, index) {
                final size = sizes[index];
                final isSelected = size == selectedCategory;
                return GestureDetector(
                  onTap: () => onSizeSelected(size),
                  child: Container(
                    margin: EdgeInsets.only(right: 10),
                    padding: EdgeInsets.symmetric(vertical: 8, horizontal: 15),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? Colors.black
                          : Theme.of(context).primaryColor,
                      border: Border.all(color: Colors.black),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Text(
                      size,
                      style: TextStyle(
                        color: isSelected
                            ? Theme.of(context).primaryColor
                            : Colors.black,
                        fontSize: 16,
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

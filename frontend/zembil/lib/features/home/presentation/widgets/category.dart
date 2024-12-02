import 'package:flutter/material.dart';

class Category extends StatelessWidget {
  final List<String> categories;
  final String selectedCategory;
  final Function(String) onCategorySelected;
  const Category(
      {super.key,
      required this.categories,
      required this.selectedCategory,
      required this.onCategorySelected});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 37,
      child: ListView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: categories.length,
          itemBuilder: (context, index) {
            final category = categories[index];
            final isSelected = category == selectedCategory;
            return GestureDetector(
              onTap: () => onCategorySelected(category),
              child: Container(
                margin: EdgeInsets.only(right: 10),
                padding: EdgeInsets.symmetric(vertical: 8, horizontal: 15),
                decoration: BoxDecoration(
                  color: isSelected
                      ? Colors.black
                      : Theme.of(context).primaryColor,
                  border: Border.all(color: Colors.black),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  category,
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
    );
  }
}

import 'package:flutter/material.dart';

class Category extends StatefulWidget {
  const Category({super.key});

  @override
  State<Category> createState() => _CategoryState();
}

class _CategoryState extends State<Category> {
  int _currentTabIndex = 0;

  final List<String> tabs = ["All", "Popular", "Recent", "Recommendations"];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: tabs.asMap().entries.map((entry) {
          int index = entry.key;
          String tab = entry.value;
          return GestureDetector(
            onTap: () {
              setState(() {
                _currentTabIndex = index;
              });
            },
            child: Container(
              margin: EdgeInsets.only(right: 10),
              padding: EdgeInsets.symmetric(vertical: 8, horizontal: 15),
              decoration: BoxDecoration(
                color: _currentTabIndex == index
                    ? Colors.black
                    : Theme.of(context).primaryColor,
                border: Border.all(color: Colors.black),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                tab,
                style: TextStyle(
                  color: _currentTabIndex == index
                      ? Theme.of(context).primaryColor
                      : Colors.black,
                  fontSize: 16,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

import 'package:flutter/material.dart';

class Features extends StatelessWidget {
  final List<Map<String, String>> featuredProducts = [
    {
      'image': 'https://via.placeholder.com/400',
      'name': 'Product 1',
      'price': '\$100',
      'discount': '10% OFF'
    },
    {
      'image': 'https://via.placeholder.com/450',
      'name': 'Product 2',
      'price': '\$150',
      'discount': '20% OFF'
    },
    {
      'image': 'https://via.placeholder.com/500',
      'name': 'Product 3',
      'price': '\$200',
      'discount': '15% OFF'
    },
  ];

  Features({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: SizedBox(
        height: 150,
        child: PageView.builder(
          itemCount: 3, // Number of discount items
          controller: PageController(viewportFraction: 0.9),
          itemBuilder: (context, index) {
            return Container(
              margin: EdgeInsets.symmetric(horizontal: 5),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.black),
                borderRadius: BorderRadius.circular(8),
                image: DecorationImage(
                  image: NetworkImage(
                    '${featuredProducts[index]['image']}',
                  ), // Example product images
                  fit: BoxFit.cover,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(5),
                child: Row(
                  children: [
                    Expanded(
                      flex: 1,
                      child: Align(
                        alignment: Alignment.centerLeft,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            Text(
                              '${featuredProducts[index]['name']}',
                              style: TextStyle(
                                color: Colors.black,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '${featuredProducts[index]['price']}',
                              style: TextStyle(
                                color: Colors.black,
                                fontSize: 14,
                              ),
                            ),
                            SizedBox(
                              height: 35,
                              width: 100,
                              child: ElevatedButton(
                                onPressed: () {},
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.black,
                                ),
                                child: Text('Buy Now',
                                    style: TextStyle(
                                        color: Theme.of(context).primaryColor,
                                        fontSize: 14)),
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

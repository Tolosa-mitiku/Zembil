import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_state.dart';

class Products extends StatelessWidget {
  final List<Map<String, String>> products = [
    {
      'image': 'https://via.placeholder.com/150x200',
      'name': 'Product 1',
      'price': '\$100'
    },
    {
      'image': 'https://via.placeholder.com/150x200',
      'name': 'Product 2',
      'price': '\$200'
    },
    {
      'image': 'https://via.placeholder.com/150x200',
      'name': 'Product 3',
      'price': '\$150'
    },
    {
      'image': 'https://via.placeholder.com/150x200',
      'name': 'Product 4',
      'price': '\$120'
    },
    {
      'image': 'https://via.placeholder.com/150x200',
      'name': 'Product 2',
      'price': '\$200'
    },
    {
      'image': 'https://via.placeholder.com/150x200',
      'name': 'Product 3',
      'price': '\$150'
    },
    {
      'image': 'https://via.placeholder.com/150x200',
      'name': 'Product 4',
      'price': '\$120'
    },
    {
      'image': 'https://via.placeholder.com/150x200',
      'name': 'Product 2',
      'price': '\$200'
    },
    {
      'image': 'https://via.placeholder.com/150x200',
      'name': 'Product 3',
      'price': '\$150'
    },
    {
      'image': 'https://via.placeholder.com/150x200',
      'name': 'Product 4',
      'price': '\$120'
    },
  ];

  Products({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ProductBloc, ProductState>(
      builder: (context, state) {
        if (state is ProductLoaded) {
          final products = state.products;
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, // Two items per row
                crossAxisSpacing: 20,
                mainAxisSpacing: 20,
                childAspectRatio:
                    2 / 3, // Ensures the top section occupies 2/3 height
              ),
              itemCount: products.length,
              itemBuilder: (context, index) {
                final product = products[index];
                return Container(
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.black),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Product Image
                      Expanded(
                        flex: 2,
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.network(
                              product.images[0],
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      ),
                      // Product Name and Price
                      Expanded(
                        flex: 1,
                        child: Container(
                          padding: const EdgeInsets.all(8.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                product.title,
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  color: Colors.black,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                product.price.toString(),
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.black,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          );
        } else {
          return Center(
            child: Text("No Products Found!!"),
          );
        }
      },
    );
  }
}

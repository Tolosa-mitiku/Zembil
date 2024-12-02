import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/home/domain/entity/product.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_event.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_state.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail_content.dart';

class ProductDetailPage extends StatefulWidget {
  final String productId;

  const ProductDetailPage({super.key, required this.productId});

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  @override
  void initState() {
    context.read<ProductDetailBloc>().add(FetchProductDetail("1"));
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: BlocBuilder<ProductDetailBloc, ProductDetailState>(
        builder: (context, state) {
          if (state is ProductDetailLoading) {
            return ProductDetailContent(
                product: ProductEntity(
                    id: "64a7c3be9f1b2a001b0c7b93",
                    title: "Smart Watch",
                    price: 100,
                    images: [
                      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    ],
                    category: "Electronics",
                    description:
                        "Fitness tracker with heart rate monitor, GPS, and waterproof design.",
                    discount: null,
                    stockQuantity: 50,
                    weight: 0.3,
                    dimensions: null,
                    isFeatured: true),
                relatedProducts: [
                  ProductEntity(
                      id: "64a7c3be9f1b2a001b0c7b93",
                      title: "Smart Watch",
                      price: 100,
                      images: [
                        "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      ],
                      category: "Electronics",
                      description:
                          "Fitness tracker with heart rate monitor, GPS, and waterproof design.",
                      discount: null,
                      stockQuantity: 50,
                      weight: 0.3,
                      dimensions: null,
                      isFeatured: true),
                  ProductEntity(
                      id: "64a7c3be9f1b2a001b0c7b93",
                      title: "Smart Watch",
                      price: 100,
                      images: [
                        "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      ],
                      category: "Electronics",
                      description:
                          "Fitness tracker with heart rate monitor, GPS, and waterproof design.",
                      discount: null,
                      stockQuantity: 50,
                      weight: 0.3,
                      dimensions: null,
                      isFeatured: true),
                ]);
          } else if (state is ProductDetailLoaded) {
            final product = state.product;
            return ProductDetailContent(
                product: product, relatedProducts: state.relatedProducts);
          } else if (state is ProductDetailError) {
            return Center(child: Text(state.message));
          }
          return const SizedBox.shrink();
        },
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(8.0),
        child: ElevatedButton(
          onPressed: () {},
          style: ElevatedButton.styleFrom(
            minimumSize: const Size(double.infinity, 45),
          ),
          child: Text(
            'Add to Cart',
            style: Theme.of(context).textTheme.labelLarge,
          ),
        ),
      ),
    );
  }
}

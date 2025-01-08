import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_event.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_state.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/product_app_bar.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/product_description.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/product_description_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/product_images.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/product_images_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/product_info.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/product_info_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/product_sizes.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/product_sizes_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/related_products.dart';
import 'package:zembil/features/home/presentation/widgets/product_detail/related_products_shimmer.dart';

class ProductDetailPage extends StatefulWidget {
  final String productId;

  const ProductDetailPage(this.productId, {super.key});

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  @override
  void initState() {
    context.read<ProductDetailBloc>().add(FetchProductDetail(widget.productId));
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.only(top: 50),
          child: BlocConsumer<ProductDetailBloc, ProductDetailState>(
            listener: (context, state) => {
              if (state is CartSuccess) {GoRouter.of(context).push("/cart")}
            },
            builder: (context, state) {
              if (state is ProductDetailLoading) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Product App Bar
                    ProductAppBar(),

                    // Product Images
                    ProductImagesShimmer(),

                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Product Info
                          ProductInfoShimmer(),

                          SizedBox(height: 20),

                          // Sizes
                          ProductSizesShimmer(),

                          SizedBox(height: 20),

                          // Description
                          ProductDescriptionShimmer(),

                          SizedBox(height: 20),

                          // Related Products
                          RelatedProductsShimmer(),
                        ],
                      ),
                    ),
                  ],
                );
              } else if (state is ProductDetailLoaded) {
                final product = state.product;
                final relatedProducts = state.relatedProducts;
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Product App Bar
                    ProductAppBar(),

                    // Product Images
                    ProductImages(images: product.images),

                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Product Info
                          ProductInfo(product),

                          SizedBox(height: 20),

                          // Sizes
                          ProductSizes(
                              sizes: ["1", "2", "3", "4", "5"],
                              selectedCategory: "1",
                              onSizeSelected: (size) {}),

                          SizedBox(height: 20),

                          // Description
                          ProductDescription(product.description ?? ""),

                          SizedBox(height: 20),

                          // Related Products
                          RelatedProducts(relatedProducts),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: ElevatedButton(
                              onPressed: () {
                                context.read<ProductDetailBloc>().add(
                                    AddToCartEvent(
                                        item: CartEntity(
                                            productId: product.id,
                                            title: product.title,
                                            category: product.category,
                                            image: product.images[0],
                                            price: product.price,
                                            quantity: 1)));
                              },
                              style: ElevatedButton.styleFrom(
                                minimumSize: const Size(double.infinity, 45),
                              ),
                              child: Text(
                                'Add to Cart',
                                style: Theme.of(context).textTheme.labelLarge,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              } else if (state is ProductDetailError) {
                return Center(child: Text(state.message));
              }
              return const SizedBox.shrink();
            },
          ),
        ),
      ),
    );
  }
}

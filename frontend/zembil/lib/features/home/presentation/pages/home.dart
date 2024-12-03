import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/featured_product_bloc/featured_product_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/featured_product_bloc/featured_product_event.dart';
import 'package:zembil/features/home/presentation/bloc/featured_product_bloc/featured_product_state.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_event.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_state.dart';
import 'package:zembil/features/home/presentation/widgets/category.dart';
import 'package:zembil/features/home/presentation/widgets/category_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/feature.dart';
import 'package:zembil/features/home/presentation/widgets/feature_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/product_shimmer.dart';
import 'package:zembil/features/home/presentation/widgets/products.dart';
import 'package:zembil/features/home/presentation/widgets/search.dart';

// ignore: must_be_immutable
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final List<String> categories = [
    "All",
    "Sports and Outdoors",
    "Electronics",
    "Home and Kitchen",
    "Fashion",
    "Furniture",
    "Musical Instruments"
  ];

  String selectedCategory = "All";
  @override
  void initState() {
    context.read<FeaturedProductBloc>().add(GetFeaturedProductsEvent());
    context
        .read<ProductsByCategoryBloc>()
        .add(GetProductsByCategoriesEvent(selectedCategory));
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 35),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 40),
              Search(),
              SizedBox(height: 30),
              BlocBuilder<FeaturedProductBloc, FeaturedProductState>(
                builder: (context, state) {
                  if (state is FeaturedProductLoaded) {
                    return Features(state.featuredProducts);
                  } else {
                    return FeaturesShimmer();
                  }
                },
              ),
              SizedBox(height: 30),
              BlocBuilder<ProductsByCategoryBloc, ProductsByCategoryState>(
                builder: (context, state) {
                  if (state is ProductsByCategoryLoading) {
                    return CategoryShimmer();
                  } else {
                    return Category(
                        categories: categories,
                        selectedCategory: selectedCategory,
                        onCategorySelected: (category) {
                          selectedCategory = category;

                          context
                              .read<ProductsByCategoryBloc>()
                              .add(GetProductsByCategoriesEvent(category));
                        });
                  }
                },
              ),
              BlocBuilder<ProductsByCategoryBloc, ProductsByCategoryState>(
                builder: (context, state) {
                  if (state is ProductsByCategoryLoading) {
                    return ProductsShimmer();
                  } else if (state is ProductsByCategoryLoaded) {
                    return Products(products: state.products);
                  } else if (state is ProductsByCategoryError) {
                    return Center(child: Text('Error: ${state.message}'));
                  } else {
                    return Center(child: Text('Select a category'));
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

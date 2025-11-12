import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/domain/usecase/get_all_products.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_event.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_state.dart';

class ProductsByCategoryBloc
    extends Bloc<ProductsByCategoryEvent, ProductsByCategoryState> {
  final GetProductsByCategory getProductsByCategory;

  ProductsByCategoryBloc({required this.getProductsByCategory})
      : super(ProductsByCategoryInitial()) {
    on<GetProductsByCategoriesEvent>((event, emit) async {
      emit(ProductsByCategoryLoading());
      final categoryProducts = await getProductsByCategory.call(event.category);
      categoryProducts.fold(
          (failure) =>
              emit(ProductsByCategoryError(mapFailureToMessage(failure))),
          (categoryProducts) {
        emit(ProductsByCategoryLoaded(categoryProducts));
      });
    });

    on<SearchProductsEvent>((event, emit) async {
      emit(ProductsByCategoryLoading());
      // Get all products first
      final allProducts = await getProductsByCategory.call("All");
      allProducts.fold(
        (failure) =>
            emit(ProductsByCategoryError(mapFailureToMessage(failure))),
        (products) {
          // Filter products based on search query
          final query = event.query.toLowerCase().trim();
          final filteredProducts = products.where((product) {
            return product.title.toLowerCase().contains(query) ||
                product.category.toLowerCase().contains(query) ||
                (product.description?.toLowerCase().contains(query) ?? false);
          }).toList();

          if (filteredProducts.isEmpty) {
            emit(ProductsByCategoryError(
                'No products found for "${event.query}"'));
          } else {
            emit(ProductsByCategoryLoaded(filteredProducts));
          }
        },
      );
    });

    on<FilterProductsEvent>((event, emit) async {
      emit(ProductsByCategoryLoading());

      // Convert dynamic values to strings
      final stringFilters =
          event.filters.map((key, value) => MapEntry(key, value.toString()));

      final products = await getProductsByCategory.call("All",
          additionalFilters: stringFilters);

      products.fold(
        (failure) =>
            emit(ProductsByCategoryError(mapFailureToMessage(failure))),
        (products) {
          if (products.isEmpty) {
            emit(ProductsByCategoryError(
                'No products found matching your filters'));
          } else {
            emit(ProductsByCategoryLoaded(products));
          }
        },
      );
    });
  }

  String mapFailureToMessage(Failure failure) {
    switch (failure.runtimeType) {
      case ServerFailure:
        return 'A server error occurred. Please try again later.';
      case NetworkFailure:
        return 'Please check your internet connection.';
      case AuthFailure:
        return "Authentication Failed Please Try Again"; // Custom message for Firebase auth errors
      default:
        return 'An unexpected error occurred.';
    }
  }
}

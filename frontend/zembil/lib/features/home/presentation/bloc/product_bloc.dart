import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/domain/usecase/get_all_products.dart';
import 'package:zembil/features/home/domain/usecase/get_featured_products.dart';
import 'package:zembil/features/home/presentation/bloc/product_event.dart';
import 'package:zembil/features/home/presentation/bloc/product_state.dart';

class ProductBloc extends Bloc<ProductEvent, ProductState> {
  final GetAllProducts getProducts;
  final GetFeaturedProducts getFeaturedProducts;
  ProductBloc({required this.getProducts, required this.getFeaturedProducts})
      : super(ProductInitial()) {
    on<GetProductsEvent>((event, emit) async {
      final products = await getProducts.call();
      final featuredProducts = await getFeaturedProducts.call();
      products
          .fold((failure) => emit(ProductError(mapFailureToMessage(failure))),
              (products) {
        featuredProducts
            .fold((failure) => emit(ProductError(mapFailureToMessage(failure))),
                (featuredProducts) {
          emit(ProductLoaded(products, featuredProducts));
        });
      });
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

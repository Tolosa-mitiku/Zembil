import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/domain/usecase/get_all_products.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_event.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_state.dart';

class ProductsByCategoryBloc
    extends Bloc<ProductsByCategoryEvent, ProductsByCategoryState> {
  final GetAllProducts getProducts;

  ProductsByCategoryBloc({required this.getProducts})
      : super(ProductsByCategoryInitial()) {
    on<GetProductsByCategoriesEvent>((event, emit) async {
      emit(ProductsByCategoryLoading());
      await Future.delayed(Duration(seconds: 10));
      final categoryProducts = await getProducts.call(event.category);
      categoryProducts.fold(
          (failure) =>
              emit(ProductsByCategoryError(mapFailureToMessage(failure))),
          (categoryProducts) {
        emit(ProductsByCategoryLoaded(categoryProducts));
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

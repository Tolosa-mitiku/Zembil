import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/domain/usecase/get_all_products.dart';
import 'package:zembil/features/home/domain/usecase/get_product.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_event.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_state.dart';

class ProductDetailBloc extends Bloc<ProductDetailEvent, ProductDetailState> {
  final GetProduct getProduct;
  final GetProductsByCategory getRelatedProducts;

  ProductDetailBloc(
      {required this.getProduct, required this.getRelatedProducts})
      : super(ProductDetailInitial()) {
    on<FetchProductDetail>((event, emit) async {
      emit(ProductDetailLoading());
      await Future.delayed(Duration(seconds: 3));

      final product = await getProduct.call(event.productId);
      final relatedProducts = await getRelatedProducts.call("All");
      product.fold(
          (failure) => emit(ProductDetailError(mapFailureToMessage(failure))),
          (product) {
        relatedProducts.fold(
            (failure) => emit(ProductDetailError(mapFailureToMessage(failure))),
            (relatedProducts) {
          emit(ProductDetailLoaded(
              product: product, relatedProducts: relatedProducts));
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

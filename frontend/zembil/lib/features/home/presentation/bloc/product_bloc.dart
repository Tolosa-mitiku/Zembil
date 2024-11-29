import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/domain/usecase/get_products.dart';
import 'package:zembil/features/home/presentation/bloc/product_event.dart';
import 'package:zembil/features/home/presentation/bloc/product_state.dart';

class ProductBloc extends Bloc<ProductEvent, ProductState> {
  final GetProducts getProducts;
  ProductBloc({required this.getProducts}) : super(ProductInitial()) {
    on<GetProductsEvent>((event, emit) async {
      final result = await getProducts.call();
      result.fold((failure) => emit(ProductError(mapFailureToMessage(failure))),
          (products) => emit(ProductLoaded(products)));
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

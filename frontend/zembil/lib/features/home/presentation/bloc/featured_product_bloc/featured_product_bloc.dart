import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/home/domain/usecase/get_all_products.dart';
import 'package:zembil/features/home/domain/usecase/get_featured_products.dart';
import 'package:zembil/features/home/presentation/bloc/featured_product_bloc/featured_product_event.dart';
import 'package:zembil/features/home/presentation/bloc/featured_product_bloc/featured_product_state.dart';

class FeaturedProductBloc
    extends Bloc<FeaturedProductEvent, FeaturedProductState> {
  final GetAllProducts getProducts;
  final GetFeaturedProducts getFeaturedProducts;
  FeaturedProductBloc(
      {required this.getProducts, required this.getFeaturedProducts})
      : super(FeaturedProductInitial()) {
    on<GetFeaturedProductsEvent>((event, emit) async {
      emit(FeaturedProductInitial());
      await Future.delayed(Duration(seconds: 5));
      final featuredProducts = await getFeaturedProducts.call();

      featuredProducts.fold((failure) {
        emit(FeaturedProductError(mapFailureToMessage(failure)));
      }, (featuredProducts) {
        emit(FeaturedProductLoaded(featuredProducts));
      });
    });

    //     emit(ProductError(mapFailureToMessage(failure)));
    //   }, (categoryProducts) {
    //     ProductLoaded.update(
    //       categoryProducts: categoryProducts,
    //     );
    //     emit(ProductLoaded.current);
    //   });
    // });
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

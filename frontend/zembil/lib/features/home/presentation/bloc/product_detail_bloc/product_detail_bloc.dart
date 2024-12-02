import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_event.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_state.dart';

class ProductDetailBloc extends Bloc<ProductDetailEvent, ProductDetailState> {
  // final ProductRepository repository;

  ProductDetailBloc() : super(ProductDetailInitial()) {
    on<FetchProductDetail>((event, emit) async {
      emit(ProductDetailLoading());
      try {
        // final product = await repository.getProductDetail(event.productId);
        // final relatedProducts = await repository.getRelatedProducts(event.productId);
        // emit(ProductDetailLoaded(product: , relatedProducts: relatedProducts));
      } catch (e) {
        emit(ProductDetailError('Failed to load product details.'));
      }
    });
  }
}

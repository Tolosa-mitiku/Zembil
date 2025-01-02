import 'package:zembil/features/home/domain/entity/product.dart';

abstract class ProductDetailState {}

class ProductDetailInitial extends ProductDetailState {}

class ProductDetailLoading extends ProductDetailState {}

class ProductDetailLoaded extends ProductDetailState {
  final ProductEntity product;
  final List<ProductEntity> relatedProducts;

  ProductDetailLoaded({required this.product, required this.relatedProducts});
}

class CartSuccess extends ProductDetailState {}

class ProductDetailError extends ProductDetailState {
  final String message;

  ProductDetailError(this.message);
}

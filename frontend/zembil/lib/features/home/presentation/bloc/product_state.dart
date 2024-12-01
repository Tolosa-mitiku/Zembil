import 'package:equatable/equatable.dart';
import 'package:zembil/features/home/domain/entity/product.dart';

abstract class ProductState extends Equatable {
  @override
  List<Object> get props => [];
}

class ProductInitial extends ProductState {}

// All Products States
class ProductLoading extends ProductState {}

class ProductLoaded extends ProductState {
  final List<ProductEntity> products;
  final List<ProductEntity> featuredProducts;

  ProductLoaded(this.products, this.featuredProducts);

  @override
  List<Object> get props => [products, featuredProducts];
}

class ProductError extends ProductState {
  final String message;

  ProductError(this.message);

  @override
  List<Object> get props => [message];
}

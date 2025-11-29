import 'package:equatable/equatable.dart';
import 'package:zembil/features/home/domain/entity/product.dart';

abstract class ProductsByCategoryState extends Equatable {
  const ProductsByCategoryState();

  @override
  List<Object> get props => [];
}

class ProductsByCategoryInitial extends ProductsByCategoryState {}

class ProductsByCategoryLoading extends ProductsByCategoryState {}

class ProductsByCategoryLoaded extends ProductsByCategoryState {
  final List<ProductEntity> products;

  const ProductsByCategoryLoaded(this.products);
  @override
  List<Object> get props => [products];
}

class ProductsByCategoryError extends ProductsByCategoryState {
  final String message;

  const ProductsByCategoryError(this.message);

  @override
  List<Object> get props => [message];
}

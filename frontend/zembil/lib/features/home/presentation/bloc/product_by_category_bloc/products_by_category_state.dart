import 'package:equatable/equatable.dart';
import 'package:zembil/features/home/domain/entity/product.dart';

abstract class CategoryState extends Equatable {
  const CategoryState();

  @override
  List<Object> get props => [];
}

class ProductsByCategoryInitial extends CategoryState {}

class ProductsByCategoryLoading extends CategoryState {}

class ProductsByCategoryLoaded extends CategoryState {
  final List<ProductEntity> products;

  const ProductsByCategoryLoaded(this.products);
  @override
  List<Object> get props => [products];
}

class ProductsByCategoryError extends CategoryState {
  final String message;

  const ProductsByCategoryError(this.message);

  @override
  List<Object> get props => [message];
}

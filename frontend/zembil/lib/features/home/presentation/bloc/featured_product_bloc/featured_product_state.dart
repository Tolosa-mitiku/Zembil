import 'package:equatable/equatable.dart';
import 'package:zembil/features/home/domain/entity/product.dart';

abstract class FeaturedProductState extends Equatable {
  @override
  List<Object> get props => [];
}

class FeaturedProductInitial extends FeaturedProductState {}

// All Products States
class FeaturedProductLoading extends FeaturedProductState {}

class FeaturedProductLoaded extends FeaturedProductState {
  final List<ProductEntity> featuredProducts;

  FeaturedProductLoaded(this.featuredProducts);

  @override
  List<Object> get props => [featuredProducts];
}

class FeaturedProductError extends FeaturedProductState {
  final String message;

  FeaturedProductError(this.message);

  @override
  List<Object> get props => [message];
}

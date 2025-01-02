import 'package:equatable/equatable.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';

abstract class ProductDetailEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class FetchProductDetail extends ProductDetailEvent {
  final String productId;

  FetchProductDetail(this.productId);
}

class AddToCartEvent extends ProductDetailEvent {
  final CartEntity item;
  AddToCartEvent({required this.item});
  @override
  List<Object?> get props => [item];
}

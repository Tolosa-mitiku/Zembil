import 'package:equatable/equatable.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';

abstract class CartEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class AddToCartEvent extends CartEvent {
  final CartEntity item;
  AddToCartEvent({required this.item});
  @override
  List<Object?> get props => [item];
}

class RemoveFromCartEvent extends CartEvent {
  final String productId;
  RemoveFromCartEvent({required this.productId});
  @override
  List<Object?> get props => [productId];
}

class GetCartEvent extends CartEvent {}

class UpdateCartEvent extends CartEvent {
  final String productId;
  final int newQuantity;
  UpdateCartEvent({required this.productId, required this.newQuantity});
  @override
  List<Object?> get props => [productId, newQuantity];
}

class InitiateStripePaymentEvent extends CartEvent {
  final int total;
  InitiateStripePaymentEvent({required this.total});
  @override
  List<Object?> get props => [total];
}

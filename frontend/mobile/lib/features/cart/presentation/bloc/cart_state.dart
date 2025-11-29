import 'package:equatable/equatable.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';

abstract class CartState extends Equatable {
  @override
  List<Object?> get props => [];
}

class CartInitial extends CartState {}

class CartLoading extends CartState {}

class CartLoaded extends CartState {
  final List<CartEntity> items;
  final double total;
  CartLoaded(this.items, this.total);

  @override
  List<Object?> get props => [items];
}

class CartSuccess extends CartState {}

class PaymentSuccess extends CartState {}

class CartError extends CartState {
  final String message;
  CartError({required this.message});

  @override
  List<Object?> get props => [message];
}

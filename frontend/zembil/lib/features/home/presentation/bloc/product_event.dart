import 'package:equatable/equatable.dart';

abstract class ProductEvent extends Equatable {
  @override
  List<Object> get props => [];
}

// All Products Event
class GetProductsEvent extends ProductEvent {}

import 'package:equatable/equatable.dart';

abstract class FeaturedProductEvent extends Equatable {
  @override
  List<Object> get props => [];
}

// Featured Products Event
class GetFeaturedProductsEvent extends FeaturedProductEvent {}

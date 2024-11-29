import 'package:equatable/equatable.dart';

class ProductEntity extends Equatable {
  final String title;
  // final String description;
  final List<String> images;
  final double price;
  // final double discount;

  const ProductEntity({
    required this.title,
    // required this.description,
    required this.images,
    required this.price,
    // required this.discount,
  });

  @override
  List<Object?> get props => [
        title,
        // description,
        images,
        price,
        // discount,
      ];
}

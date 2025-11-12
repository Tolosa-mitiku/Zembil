import 'package:equatable/equatable.dart';
import 'package:zembil/features/home/data/model/dimension.dart';
import 'package:zembil/features/home/data/model/discount.dart';

class ProductEntity extends Equatable {
  final String id;
  final String title;
  final String? description;
  final String category;
  final double price;
  final DiscountModel? discount;
  final int stockQuantity;
  final List<String> images;
  final double? weight;
  final DimensionModel? dimensions;
  final bool isFeatured;

  const ProductEntity({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.price,
    required this.discount,
    required this.stockQuantity,
    required this.images,
    required this.weight,
    required this.dimensions,
    required this.isFeatured,
  });

  @override
  List<Object?> get props => [
        id,
        title,
        description,
        category,
        price,
        discount,
        stockQuantity,
        images,
        weight,
        dimensions,
        isFeatured,
      ];
}

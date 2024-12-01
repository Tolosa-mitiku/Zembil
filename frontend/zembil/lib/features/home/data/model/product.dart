import 'package:zembil/features/home/data/model/dimension.dart';
import 'package:zembil/features/home/data/model/discount.dart';
import 'package:zembil/features/home/domain/entity/product.dart';

class ProductModel extends ProductEntity {
  const ProductModel({
    required super.id,
    required super.title,
    required super.description,
    required super.category,
    required super.price,
    required super.discount,
    required super.stockQuantity,
    required super.images,
    required super.weight,
    required super.dimensions,
    required super.isFeatured,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['_id'] as String,
      title: json['title'] as String,
      description: json['description'] as String? ?? '',
      category: json['category'] as String, // Nullable field
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      discount: DiscountModel.fromJson(json['discount']),
      stockQuantity: json['stockQuantity'] as int? ?? 0,
      images: (json['images'] as List<dynamic>?)
              ?.map((image) => image.toString())
              .toList() ??
          [],
      weight: (json['weight'] as num?)?.toDouble() ?? 0.0,
      dimensions: json['dimensions'] != null
          ? DimensionModel.fromJson(json['dimensions'])
          : null,
      isFeatured: json['isFeatured'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'price': price,
      'discount': discount?.toJson(),
      'stockQuantity': stockQuantity,
      'images': images,
      'weight': weight,
      'dimensions': dimensions?.toJson(),
      'isFeatured': isFeatured,
    };
  }
}

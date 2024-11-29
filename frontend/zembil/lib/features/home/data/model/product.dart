import 'package:zembil/features/home/domain/entity/product.dart';

class ProductModel extends ProductEntity {
  const ProductModel({
    // required super._id,
    required super.title,
    // required super.description,
    required super.images,
    required super.price,
    // required super.discount
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      // _id: json['id'],
      title: json['title'],
      // description: json['description'],
      images:
          (json['images'] as List).map((image) => image.toString()).toList(),
      price: json['price'],
      // discount: json['discount'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      // '_id': _id,
      'title': title,
      // 'description': description,
      'images': images,
      'price': price,
      // 'discount': discount,
    };
  }
}

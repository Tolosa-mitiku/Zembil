import 'package:zembil/features/cart/domain/entity/cart.dart';

class CartModel extends CartEntity {
  const CartModel(
      {required super.productId,
      required super.title,
      required super.category,
      required super.image,
      required super.price,
      required super.quantity});

  factory CartModel.fromJson(Map<String, dynamic> json) {
    return CartModel(
        productId: json["productId"] as String,
        title: json["title"] as String,
        category: json["category"] as String,
        image: json["image"] as String,
        price: (json["price"] as num).toDouble(),
        quantity: json["quantity"] as int);
  }

  Map<String, dynamic> toJson() {
    return {
      "productId": productId,
      "title": title,
      "category": category,
      "image": image,
      "price": price,
      "quantity": quantity
    };
  }
}

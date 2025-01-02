import 'package:equatable/equatable.dart';
import 'package:hive/hive.dart';

part 'cart.g.dart';

@HiveType(typeId: 1)
class CartEntity extends Equatable {
  @HiveField(0)
  final String productId;
  @HiveField(1)
  final String title;
  @HiveField(2)
  final String category;
  @HiveField(3)
  final String image;
  @HiveField(4)
  final double price;
  @HiveField(5)
  final int quantity;

  const CartEntity({
    required this.productId,
    required this.title,
    required this.category,
    required this.image,
    required this.price,
    required this.quantity,
  });

  static Map<String, String> toPayPalMap(CartEntity item) {
    return {
      "name": item.title.toString(),
      "quantity": item.quantity.toString(),
      "price": item.price.toString(),
      "currency": 'USD',
    };
  }

  static List<Map<String, String>> toPayPalList(List<CartEntity> items) {
    return items.map((item) => toPayPalMap(item)).toList();
  }

  @override
  List<Object?> get props => [productId, title, category, price, quantity];
}

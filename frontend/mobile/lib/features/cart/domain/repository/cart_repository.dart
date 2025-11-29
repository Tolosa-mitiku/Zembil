import 'package:zembil/features/cart/domain/entity/cart.dart';

abstract class CartRepository {
  List<CartEntity> getCart();
  Future<void> addToCart(CartEntity item);
  Future<void> removeFromCart(String productId);
  Future<void> updateCart(String productId, int newQuantity);
}

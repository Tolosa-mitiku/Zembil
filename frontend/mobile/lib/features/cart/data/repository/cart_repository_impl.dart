import 'package:zembil/features/cart/data/data_sources/cart_data_source.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';
import 'package:zembil/features/cart/domain/repository/cart_repository.dart';

class CartRepositoryImpl extends CartRepository {
  final CartDataSource cartDataSource;
  CartRepositoryImpl(this.cartDataSource);
  @override
  List<CartEntity> getCart() {
    return cartDataSource.getCart();
  }

  @override
  Future<void> addToCart(CartEntity item) {
    return cartDataSource.addToCart(item);
  }

  @override
  Future<void> removeFromCart(String productId) {
    return cartDataSource.removeFromCart(productId);
  }

  @override
  Future<void> updateCart(String productId, int newQuantity) {
    return cartDataSource.updateCart(productId, newQuantity);
  }
}

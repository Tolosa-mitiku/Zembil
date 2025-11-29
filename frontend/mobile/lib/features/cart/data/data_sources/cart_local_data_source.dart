import 'package:zembil/core/hive.dart';
import 'package:zembil/features/cart/data/data_sources/cart_data_source.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';

class CartLocalDataSource extends CartDataSource {
  final HiveService hiveService;
  CartLocalDataSource(this.hiveService);
  @override
  List<CartEntity> getCart() {
    return hiveService.getCart();
  }

  @override
  Future<void> addToCart(CartEntity item) {
    return hiveService.addToCart(item);
  }

  @override
  Future<void> removeFromCart(String productId) {
    return hiveService.removeFromCart(productId);
  }

  @override
  Future<void> updateCart(String productId, int newQuantity) {
    return hiveService.updateQuantity(productId, newQuantity);
  }
}

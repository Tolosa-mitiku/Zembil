import 'package:zembil/features/cart/domain/repository/cart_repository.dart';

class RemoveFromCart {
  final CartRepository cartRepository;
  RemoveFromCart(this.cartRepository);
  Future<void> call(String productId) async =>
      await cartRepository.removeFromCart(productId);
}

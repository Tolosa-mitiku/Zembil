import 'package:zembil/features/cart/domain/entity/cart.dart';
import 'package:zembil/features/cart/domain/repository/cart_repository.dart';

class AddToCart {
  final CartRepository cartRepository;
  AddToCart(this.cartRepository);
  Future<void> call(CartEntity item) async =>
      await cartRepository.addToCart(item);
}

import 'package:zembil/features/cart/domain/repository/cart_repository.dart';

class UpdateCart {
  final CartRepository cartRepository;
  UpdateCart(this.cartRepository);
  Future<void> call(String productId, int newQuantity) async =>
      await cartRepository.updateCart(productId, newQuantity);
}

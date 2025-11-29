import 'package:zembil/features/cart/domain/entity/cart.dart';
import 'package:zembil/features/cart/domain/repository/cart_repository.dart';

class GetCart {
  final CartRepository cartRepository;
  GetCart(this.cartRepository);
  List<CartEntity> call() => cartRepository.getCart();
}

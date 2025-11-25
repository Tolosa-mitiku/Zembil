import 'package:hive/hive.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';

class HiveService {
  final Box _onboarding = Hive.box('onboarding');
  final Box _cartBox = Hive.box<CartEntity>('cart');

  // Generic data access methods
  dynamic getData(String key) {
    return _onboarding.get(key);
  }

  Future<void> saveData(String key, dynamic value) async {
    await _onboarding.put(key, value);
  }

  Future<void> deleteData(String key) async {
    await _onboarding.delete(key);
  }

  // Onboarding
  bool get hasSeenOnboarding =>
      _onboarding.get('hasSeenOnboarding', defaultValue: false);

  Future<void> markOnboardingComplete() async {
    await _onboarding.put('hasSeenOnboarding', true);
  }

  // Cart
  List<CartEntity> getCart() {
    return _cartBox.values.cast<CartEntity>().toList();
  }

  Future<void> addToCart(CartEntity item) async {
    await _cartBox.put(item.productId, item);
  }

  Future<void> removeFromCart(String productId) async {
    await _cartBox.delete(productId);
  }

  Future<void> updateQuantity(String productId, int newQuantity) async {
    final updatedItem = _cartBox.get(productId, defaultValue: null);
    if (updatedItem != null) {
      await _cartBox.put(
          productId, updatedItem.copyWith(quantity: newQuantity));
    }
  }
}

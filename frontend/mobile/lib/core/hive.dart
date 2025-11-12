import 'dart:convert';
import 'package:hive/hive.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';

class HiveService {
  final Box _onboarding = Hive.box('onboarding');
  final Box _cartBox = Hive.box<CartEntity>('cart');
  late final Box _cacheBox;

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

  // Cache methods for offline support
  Future<void> initCacheBox() async {
    _cacheBox = await Hive.openBox('cache');
  }

  // Products cache
  Future<void> cacheProducts(String key, List<Map<String, dynamic>> products) async {
    await _cacheBox.put('products_$key', jsonEncode(products));
    await _cacheBox.put('products_${key}_timestamp', DateTime.now().toIso8601String());
  }

  List<Map<String, dynamic>>? getCachedProducts(String key) {
    final cached = _cacheBox.get('products_$key');
    if (cached != null) {
      try {
        final decoded = jsonDecode(cached as String) as List;
        return decoded.cast<Map<String, dynamic>>();
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  bool isCacheValid(String key, {Duration maxAge = const Duration(hours: 24)}) {
    final timestampStr = _cacheBox.get('products_${key}_timestamp');
    if (timestampStr == null) return false;
    try {
      final timestamp = DateTime.parse(timestampStr as String);
      return DateTime.now().difference(timestamp) < maxAge;
    } catch (e) {
      return false;
    }
  }

  // Featured products cache
  Future<void> cacheFeaturedProducts(List<Map<String, dynamic>> products) async {
    await _cacheBox.put('featured_products', jsonEncode(products));
    await _cacheBox.put('featured_products_timestamp', DateTime.now().toIso8601String());
  }

  List<Map<String, dynamic>>? getCachedFeaturedProducts() {
    final cached = _cacheBox.get('featured_products');
    if (cached != null) {
      try {
        final decoded = jsonDecode(cached as String) as List;
        return decoded.cast<Map<String, dynamic>>();
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  bool isFeaturedCacheValid({Duration maxAge = const Duration(hours: 24)}) {
    final timestampStr = _cacheBox.get('featured_products_timestamp');
    if (timestampStr == null) return false;
    try {
      final timestamp = DateTime.parse(timestampStr as String);
      return DateTime.now().difference(timestamp) < maxAge;
    } catch (e) {
      return false;
    }
  }

  // Single product cache
  Future<void> cacheProduct(String productId, Map<String, dynamic> product) async {
    await _cacheBox.put('product_$productId', jsonEncode(product));
    await _cacheBox.put('product_${productId}_timestamp', DateTime.now().toIso8601String());
  }

  Map<String, dynamic>? getCachedProduct(String productId) {
    final cached = _cacheBox.get('product_$productId');
    if (cached != null) {
      try {
        return jsonDecode(cached as String) as Map<String, dynamic>;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Profile cache
  Future<void> cacheProfile(Map<String, dynamic> profile) async {
    await _cacheBox.put('profile', jsonEncode(profile));
    await _cacheBox.put('profile_timestamp', DateTime.now().toIso8601String());
  }

  Map<String, dynamic>? getCachedProfile() {
    final cached = _cacheBox.get('profile');
    if (cached != null) {
      try {
        return jsonDecode(cached as String) as Map<String, dynamic>;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Clear all cache
  Future<void> clearCache() async {
    await _cacheBox.clear();
  }
}

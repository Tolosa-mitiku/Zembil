import 'package:go_router/go_router.dart';
import 'package:zembil/features/cart/presentation/pages/cart.dart';

class CartRoutes {
  static final List<GoRoute> routes = [
    GoRoute(path: "/cart", builder: (context, state) => CartPage()),
  ];
}

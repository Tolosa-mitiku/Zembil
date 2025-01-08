import 'package:go_router/go_router.dart';
import 'package:zembil/features/cart/presentation/pages/cart.dart';
import 'package:zembil/features/home/presentation/pages/product_detail.dart';

class CartRoutes {
  static final routes = [
    StatefulShellBranch(
      routes: [
        GoRoute(
          path: '/cart',
          builder: (context, state) => CartPage(),
          routes: [
            GoRoute(
                path: '/products/:productId',
                builder: (context, state) {
                  final productId = state.pathParameters['productId'] as String;
                  return ProductDetailPage(productId);
                }),
          ],
        ),
      ],
    ),
  ];
}

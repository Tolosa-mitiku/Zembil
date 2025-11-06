import 'package:go_router/go_router.dart';
import 'package:zembil/features/cart/presentation/pages/cart_page_redesign.dart';
import 'package:zembil/features/home/presentation/pages/product_detail_redesign.dart';

class CartRoutes {
  static final routes = [
    StatefulShellBranch(
      routes: [
        GoRoute(
          path: '/cart',
          builder: (context, state) => const CartPageRedesign(),
          routes: [
            GoRoute(
              path: 'products/:productId',
              builder: (context, state) {
                final productId = state.pathParameters['productId'] as String;
                return ProductDetailRedesign(productId);
              },
            ),
          ],
        ),
      ],
    ),
  ];
}

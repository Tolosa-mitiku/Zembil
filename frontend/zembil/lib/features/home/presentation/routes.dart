import 'package:go_router/go_router.dart';
import 'package:zembil/features/home/presentation/pages/home.dart';
import 'package:zembil/features/home/presentation/pages/product_detail.dart';

class HomeRoutes {
  static final List<GoRoute> routes = [
    GoRoute(
      path: "/",
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: "/product/:productId",
      builder: (context, state) {
        final String id = (state).pathParameters['productId'] as String;
        return ProductDetailPage(id);
      },
    )
  ];
}

import 'package:go_router/go_router.dart';
import 'package:zembil/features/home/presentation/pages/home.dart';
import 'package:zembil/features/home/presentation/pages/product_detail_redesign.dart';

class HomeRoutes {
  static final routes = [
    StatefulShellBranch(
      routes: [
        GoRoute(
          path: '/index',
          builder: (context, state) => HomePage(),
          routes: [
            GoRoute(
              path: "/products/:productId",
              builder: (context, state) {
                final String id = (state).pathParameters['productId'] as String;
                return ProductDetailRedesign(id);
              },
            )
          ],
        ),
      ],
    ),
  ];
}

import 'package:go_router/go_router.dart';
import 'package:zembil/features/home/presentation/pages/product_detail.dart';
import 'package:zembil/features/profile/presentation/pages/profile_page.dart';

class ProfileRoutes {
  static final List<GoRoute> routes = [
    GoRoute(
      path: "/profile",
      builder: (context, state) => const ProfilePage(),
    ),
    GoRoute(
      path: "/products/:productId",
      builder: (context, state) {
        final String id = (state).pathParameters['productId'] as String;
        return ProductDetailPage(id);
      },
    )
  ];
}

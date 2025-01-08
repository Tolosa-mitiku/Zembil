import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/features/cart/presentation/routes.dart';
import 'package:zembil/features/home/presentation/pages/product_detail.dart';
import 'package:zembil/features/home/presentation/pages/test.dart';
import 'package:zembil/features/home/presentation/routes.dart';
import 'package:zembil/features/navigation/widgets/navigation.dart';
import 'package:zembil/features/profile/presentation/routes.dart';

class NavigationRoutes {
  static final routes = [
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return BottomNavBar(navigationShell: navigationShell);
      },
      branches: [
        ...HomeRoutes.routes,
        ...CartRoutes.routes,
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/orders',
              builder: (context, state) => GridScrollEffect(),
              routes: [],
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/settings',
              builder: (context, state) => SettingsPage(),
              routes: [
                GoRoute(
                    path: '/products/:productId',
                    builder: (context, state) {
                      final productId =
                          state.pathParameters['productId'] as String;
                      return ProductDetailPage(productId);
                    }),
              ],
            ),
          ],
        ),
        ...ProfileRoutes.routes
      ],
    ),
  ];
}

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(child: Text('Settings Page'));
  }
}

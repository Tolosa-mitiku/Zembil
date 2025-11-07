import 'package:go_router/go_router.dart';
import 'package:zembil/features/cart/presentation/routes.dart';
import 'package:zembil/features/home/presentation/routes.dart';
import 'package:zembil/features/navigation/widgets/navigation.dart';
import 'package:zembil/features/orders/presentation/pages/orders_page_redesign.dart';
import 'package:zembil/features/profile/presentation/routes.dart';
import 'package:zembil/features/settings/presentation/pages/settings_page_redesign.dart';

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
              builder: (context, state) => const OrdersPageRedesign(),
              routes: [],
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/settings',
              builder: (context, state) => const SettingsPageRedesign(),
            ),
          ],
        ),
        ...ProfileRoutes.routes
      ],
    ),
  ];
}

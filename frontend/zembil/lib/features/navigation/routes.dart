import 'package:go_router/go_router.dart';
import 'package:zembil/features/navigation/pages/home.dart';

class NavigationRoutes {
  static final List<GoRoute> routes = [
    GoRoute(
      path: "/index",
      builder: (context, state) => IndexPage(),
    ),
  ];
}

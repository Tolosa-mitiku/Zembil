import 'package:go_router/go_router.dart';
import 'package:zembil/features/profile/presentation/pages/profile_page_redesign.dart';

class ProfileRoutes {
  static final routes = [
    StatefulShellBranch(
      routes: [
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfilePageRedesign(),
          routes: [],
        ),
      ],
    ),
  ];
}

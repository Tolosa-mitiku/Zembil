import 'package:go_router/go_router.dart';
import 'package:zembil/features/authentication/presentation/routes.dart';
import 'package:zembil/features/navigation/routes.dart';
import 'package:zembil/features/onboarding/presentation/pages/splash.dart';
import 'package:zembil/features/onboarding/presentation/routes.dart';
import 'package:zembil/features/payments/presentation/routes.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    routes: [
      GoRoute(path: "/", builder: (context, state) => const Splash()),
      ...AuthenticationRoutes.routes,
      ...NavigationRoutes.routes,
      ...OnboardingRoutes.routes,
      ...PaymentRoutes.routes,
    ],
  );
}

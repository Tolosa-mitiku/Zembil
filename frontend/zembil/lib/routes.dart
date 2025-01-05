import 'package:go_router/go_router.dart';
import 'package:zembil/features/authentication/presentation/routes.dart';
import 'package:zembil/features/cart/presentation/routes.dart';
import 'package:zembil/features/home/presentation/routes.dart';
import 'package:zembil/features/navigation/routes.dart';
import 'package:zembil/features/onboarding/presentation/pages/splash.dart';
import 'package:zembil/features/onboarding/presentation/widgets/routes.dart';
import 'package:zembil/features/payments/presentation/routes.dart';
import 'package:zembil/features/profile/presentation/routes.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    routes: [
      GoRoute(path: "/", builder: (context, state) => const Splash()),
      ...AuthenticationRoutes.routes,
      ...CartRoutes.routes,
      ...HomeRoutes.routes,
      ...NavigationRoutes.routes,
      ...OnboardingRoutes.routes,
      ...PaymentRoutes.routes,
      ...ProfileRoutes.routes,
    ],
  );
}

import 'package:go_router/go_router.dart';
import 'package:zembil/features/onboarding/presentation/pages/onboarding_one.dart';
import 'package:zembil/features/onboarding/presentation/pages/onboarding_three.dart';
import 'package:zembil/features/onboarding/presentation/pages/onboarding_two.dart';

class OnboardingRoutes {
  static final List<GoRoute> routes = [
    GoRoute(
        path: "/onboarding/1", builder: (context, state) => OnboardingOne()),
    GoRoute(
        path: "/onboarding/2", builder: (context, state) => OnboardingTwo()),
    GoRoute(
        path: "/onboarding/3", builder: (context, state) => OnboardingThree()),
  ];
}

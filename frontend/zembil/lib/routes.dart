import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/features/authentication/presentation/routes.dart';
import 'package:zembil/features/navigation/routes.dart';
import 'package:zembil/features/onboarding/presentation/pages/splash.dart';
import 'package:zembil/features/onboarding/presentation/routes.dart';
import 'package:zembil/features/payments/presentation/routes.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(path: "/", builder: (context, state) => const Splash()),
      ...AuthenticationRoutes.routes,
      ...NavigationRoutes.routes,
      ...OnboardingRoutes.routes,
      ...PaymentRoutes.routes,
    ],
    // Error handling
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Text('Page not found: ${state.uri.path}'),
      ),
    ),
  );
}

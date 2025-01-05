import 'package:go_router/go_router.dart';
import 'package:zembil/features/authentication/presentation/pages/email_verification.dart';
import 'package:zembil/features/authentication/presentation/pages/forgot_password.dart';
import 'package:zembil/features/authentication/presentation/pages/login.dart';
import 'package:zembil/features/authentication/presentation/pages/signup.dart';

class AuthenticationRoutes {
  static final List<GoRoute> routes = [
    GoRoute(path: "/login", builder: (context, state) => Login()),
    GoRoute(path: "/signup", builder: (context, state) => Signup()),
    GoRoute(
        path: "/forgot_password",
        builder: (context, state) => ForgotPasswordScreen()),
    GoRoute(
        path: "/email_verificatino",
        builder: (context, state) => EmailVerificationScreen()),
  ];
}

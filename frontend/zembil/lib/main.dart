import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:zembil/core/utils.dart';
import 'package:zembil/features/authentication/presentation/bloc/auth_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/email_verification_bloc/email_verification_bloc.dart';
import 'package:zembil/features/authentication/presentation/pages/login.dart';
import 'package:zembil/features/authentication/presentation/pages/signup.dart';
import 'package:zembil/features/on_boarding/presentation/bloc/onboarding/onboarding_bloc.dart';
import 'package:zembil/features/on_boarding/presentation/bloc/splash/splash_bloc.dart';
import 'package:zembil/features/on_boarding/presentation/pages/splash.dart';
import 'package:zembil/home.dart';
import 'package:zembil/injector.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual,
  //     overlays: [SystemUiOverlay.bottom]);
  setupLocator();
  await Firebase.initializeApp();
  await Hive.initFlutter();
  await Hive.openBox('appBox');
  runApp(MultiBlocProvider(providers: [
    BlocProvider(create: (context) => locator<AuthBloc>()),
    BlocProvider(create: (context) => locator<OnboardingBloc>()),
    BlocProvider(create: (context) => locator<SplashBloc>()),
    BlocProvider(create: (context) => locator<EmailVerificationBloc>()),
  ], child: const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      onGenerateRoute: _generateRoute,
      initialRoute: "/",
      title: "Zembil",
      theme: primaryTheme,
      themeMode: ThemeMode.system,
    );
  }
}

Route? _generateRoute(RouteSettings settings) {
  switch (settings.name) {
    case "/":
      return MaterialPageRoute(builder: (_) => Splash());

    case "/login":
      return MaterialPageRoute(builder: (_) => Login());

    case "/signup":
      return MaterialPageRoute(builder: (_) => Signup());

    case "/home":
      return MaterialPageRoute(builder: (_) => const Home());

    // case "/VerifyEmail":
    // return MaterialPageRoute(builder: (_) => const VerifyEmailScreen());
    default:
      return null;
  }
}

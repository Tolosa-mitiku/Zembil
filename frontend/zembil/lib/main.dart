import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:zembil/core/utils.dart';
import 'package:zembil/features/authentication/presentation/bloc/auth_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/email_verification_bloc/email_verification_bloc.dart';
import 'package:zembil/features/authentication/presentation/pages/login.dart';
import 'package:zembil/features/authentication/presentation/pages/signup.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/featured_product_bloc/featured_product_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_bloc.dart';
import 'package:zembil/features/onboarding/presentation/bloc/onboarding/onboarding_bloc.dart';
import 'package:zembil/features/onboarding/presentation/bloc/splash/splash_bloc.dart';
import 'package:zembil/features/onboarding/presentation/pages/splash.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:zembil/injector.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual,
  //     overlays: [SystemUiOverlay.bottom]);
  setupLocator();
  await dotenv.load(fileName: '.env');
  Stripe.publishableKey = dotenv.env["STRIPE_PUBLISHABLE_KEY"] ?? "";
  await Firebase.initializeApp();
  await Hive.initFlutter();
  Hive.registerAdapter(CartEntityAdapter());
  await Hive.openBox('onboarding');
  await Hive.openBox<CartEntity>('cart');
  runApp(MultiBlocProvider(providers: [
    BlocProvider(create: (context) => locator<AuthBloc>()),
    BlocProvider(create: (context) => locator<OnboardingBloc>()),
    BlocProvider(create: (context) => locator<SplashBloc>()),
    BlocProvider(create: (context) => locator<EmailVerificationBloc>()),
    BlocProvider(create: (context) => locator<ProfileBloc>()),
    BlocProvider(create: (context) => locator<FeaturedProductBloc>()),
    BlocProvider(create: (context) => locator<ProductsByCategoryBloc>()),
    BlocProvider(create: (context) => locator<ProductDetailBloc>()),
    BlocProvider(create: (context) => locator<CartBloc>()),
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

    // case "/home":
    //   return MaterialPageRoute(builder: (_) => HomePage());

    // case "/VerifyEmail":
    // return MaterialPageRoute(builder: (_) => const VerifyEmailScreen());
    default:
      return null;
  }
}

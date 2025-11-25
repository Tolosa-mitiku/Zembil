import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:zembil/core/theme/app_theme.dart';
import 'package:zembil/core/theme/cubit/theme_cubit.dart';
import 'package:zembil/core/theme/cubit/theme_state.dart';
import 'package:zembil/features/authentication/presentation/bloc/auth_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/email_verification_bloc/email_verification_bloc.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/featured_product_bloc/featured_product_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_detail_bloc/product_detail_bloc.dart';
import 'package:zembil/features/onboarding/presentation/bloc/onboarding/onboarding_bloc.dart';
import 'package:zembil/features/onboarding/presentation/bloc/splash/splash_bloc.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:zembil/injector.dart';
import 'package:zembil/routes.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize dependencies
  setupLocator();
  
  // Load environment variables
  await dotenv.load(fileName: '.env');
  Stripe.publishableKey = dotenv.env["STRIPE_PUBLISHABLE_KEY"] ?? "";
  
  // Initialize Firebase
  await Firebase.initializeApp();
  
  // Initialize Hive
  await Hive.initFlutter();
  Hive.registerAdapter(CartEntityAdapter());
  await Hive.openBox('onboarding');
  await Hive.openBox<CartEntity>('cart');
  
  runApp(
    MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => locator<ThemeCubit>()),
        BlocProvider(create: (context) => locator<AuthBloc>()),
        BlocProvider(create: (context) => locator<OnboardingBloc>()),
        BlocProvider(create: (context) => locator<SplashBloc>()),
        BlocProvider(create: (context) => locator<EmailVerificationBloc>()),
        BlocProvider(create: (context) => locator<ProfileBloc>()),
        BlocProvider(create: (context) => locator<FeaturedProductBloc>()),
        BlocProvider(create: (context) => locator<ProductsByCategoryBloc>()),
        BlocProvider(create: (context) => locator<ProductDetailBloc>()),
        BlocProvider(create: (context) => locator<CartBloc>()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ThemeCubit, ThemeState>(
      builder: (context, themeState) {
        return MaterialApp.router(
          routerConfig: AppRouter.router,
          debugShowCheckedModeBanner: false,
          title: "Zembil",
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          themeMode: themeState.themeMode,
        );
      },
    );
  }
}


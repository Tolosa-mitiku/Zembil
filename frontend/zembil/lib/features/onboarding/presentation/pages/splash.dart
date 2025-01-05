import 'package:animated_splash_screen/animated_splash_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/features/authentication/presentation/pages/login.dart';
import 'package:zembil/features/onboarding/presentation/bloc/splash/splash_bloc.dart';
import 'package:zembil/features/onboarding/presentation/bloc/splash/splash_event.dart';
import 'package:zembil/features/onboarding/presentation/bloc/splash/splash_state.dart';

class Splash extends StatefulWidget {
  const Splash({super.key});

  @override
  State<Splash> createState() => _SplashState();
}

class _SplashState extends State<Splash> {
  @override
  void initState() {
    super.initState();
    _splashDelay();
  }

  void _splashDelay() async {
    await Future.delayed(Duration(seconds: 3));
    context.read<SplashBloc>().add(CheckOnboardingStatus());
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;
    return BlocListener<SplashBloc, SplashState>(
      listener: (context, state) {
        if (state is SplashOnboarding) {
          context.go("/onboarding/1");
          // Navigator.pushReplacement(context,
          //     MaterialPageRoute(builder: (context) => OnboardingOne()));
        } else if (state is SplashAuthenticated) {
          context.go("/index");
          // Navigator.pushReplacement(
          //     context, MaterialPageRoute(builder: (context) => IndexPage()));
        } else if (state is SplashUnAuthenticated) {
          context.go("/login");
          // Navigator.pushReplacement(
          //     context, MaterialPageRoute(builder: (context) => Login()));
        }
      },
      child: AnimatedSplashScreen(
        splash: Container(
          height: screenHeight,
          width: screenWidth,
          padding: EdgeInsets.only(bottom: 30),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.end,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Icon(Icons.shop_2_outlined, size: screenHeight * 0.15),
              Text("Zembil", style: Theme.of(context).textTheme.titleLarge),
              Text("www.zembil.com",
                  style: Theme.of(context).textTheme.titleLarge),
            ],
          ),
        ),
        backgroundColor: Theme.of(context).primaryColor,
        nextScreen: Login(),
        splashTransition: SplashTransition.slideTransition,
        duration: 4000,
        splashIconSize: 250,
      ),
    );
  }
}

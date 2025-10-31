import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/app_text_styles.dart';
import 'package:zembil/features/onboarding/presentation/bloc/splash/splash_bloc.dart';
import 'package:zembil/features/onboarding/presentation/bloc/splash/splash_event.dart';
import 'package:zembil/features/onboarding/presentation/bloc/splash/splash_state.dart';

class Splash extends StatefulWidget {
  const Splash({super.key});

  @override
  State<Splash> createState() => _SplashState();
}

class _SplashState extends State<Splash> with TickerProviderStateMixin {
  late AnimationController _logoController;
  late AnimationController _textController;
  late AnimationController _circleController;

  late Animation<double> _logoScale;
  late Animation<double> _logoRotation;
  late Animation<double> _textFade;
  late Animation<Offset> _textSlide;
  late Animation<double> _circleScale;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _startAnimations();
    _scheduleNavigationCheck();
  }

  void _initializeAnimations() {
    // Logo animations
    _logoController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _logoScale = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _logoController,
        curve: Curves.elasticOut,
      ),
    );

    _logoRotation = Tween<double>(begin: 0.0, end: 2 * math.pi).animate(
      CurvedAnimation(
        parent: _logoController,
        curve: const Interval(0.0, 0.5, curve: Curves.easeOut),
      ),
    );

    // Text animations
    _textController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _textFade = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _textController,
        curve: Curves.easeIn,
      ),
    );

    _textSlide = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _textController,
        curve: Curves.easeOut,
      ),
    );

    // Circle background animation
    _circleController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _circleScale = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _circleController,
        curve: Curves.easeInOut,
      ),
    );
  }

  void _startAnimations() {
    Future.delayed(const Duration(milliseconds: 200), () {
      _circleController.forward();
    });

    Future.delayed(const Duration(milliseconds: 400), () {
      _logoController.forward();
    });

    Future.delayed(const Duration(milliseconds: 1000), () {
      _textController.forward();
    });
  }

  void _scheduleNavigationCheck() {
    Future.delayed(const Duration(milliseconds: 2500), () {
      if (mounted) {
        context.read<SplashBloc>().add(CheckOnboardingStatus());
      }
    });
  }

  @override
  void dispose() {
    _logoController.dispose();
    _textController.dispose();
    _circleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return BlocListener<SplashBloc, SplashState>(
      listener: (context, state) {
        if (state is SplashOnboarding) {
          context.go("/onboarding/1");
        } else if (state is SplashAuthenticated) {
          context.go("/index");
        } else if (state is SplashUnAuthenticated) {
          context.go("/login");
        }
      },
      child: Scaffold(
        backgroundColor: AppColors.getBackground(isDark),
        body: Stack(
          children: [
            // Animated background circles
            _buildBackgroundCircles(size, isDark),
            
            // Main content
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Animated logo
                  _buildAnimatedLogo(size),
                  
                  const SizedBox(height: 32),
                  
                  // Animated text
                  _buildAnimatedText(isDark),
                  
                  const SizedBox(height: 8),
                  
                  // Tagline
                  _buildTagline(isDark),
                ],
              ),
            ),

            // Loading indicator at bottom
            _buildLoadingIndicator(),
          ],
        ),
      ),
    );
  }

  Widget _buildBackgroundCircles(Size size, bool isDark) {
    return AnimatedBuilder(
      animation: _circleController,
      builder: (context, child) {
        return Stack(
          children: [
            // Top-right circle
            Positioned(
              top: -size.width * 0.3,
              right: -size.width * 0.3,
              child: Transform.scale(
                scale: _circleScale.value,
                child: Container(
                  width: size.width * 0.8,
                  height: size.width * 0.8,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [
                        AppColors.primary.withOpacity(0.15),
                        AppColors.primary.withOpacity(0.0),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            // Bottom-left circle
            Positioned(
              bottom: -size.width * 0.3,
              left: -size.width * 0.3,
              child: Transform.scale(
                scale: _circleScale.value,
                child: Container(
                  width: size.width * 0.8,
                  height: size.width * 0.8,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [
                        AppColors.secondaryLight.withOpacity(0.15),
                        AppColors.secondaryLight.withOpacity(0.0),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildAnimatedLogo(Size size) {
    return AnimatedBuilder(
      animation: _logoController,
      builder: (context, child) {
        return Transform.scale(
          scale: _logoScale.value,
          child: Transform.rotate(
            angle: _logoRotation.value,
            child: Container(
              width: size.width * 0.35,
              height: size.width * 0.35,
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.3),
                    blurRadius: 30,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: const Icon(
                Icons.shopping_bag_rounded,
                size: 80,
                color: Colors.white,
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildAnimatedText(bool isDark) {
    return FadeTransition(
      opacity: _textFade,
      child: SlideTransition(
        position: _textSlide,
        child: Text(
          'Zembil',
          style: AppTextStyles.displayLarge.copyWith(
            color: AppColors.getTextPrimary(isDark),
            fontWeight: FontWeight.bold,
            letterSpacing: 2,
          ),
        ),
      ),
    );
  }

  Widget _buildTagline(bool isDark) {
    return FadeTransition(
      opacity: _textFade,
      child: SlideTransition(
        position: _textSlide,
        child: Text(
          'Shop Smart, Live Better',
          style: AppTextStyles.bodyLarge.copyWith(
            color: AppColors.getTextSecondary(isDark),
            letterSpacing: 1,
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingIndicator() {
    return Positioned(
      bottom: 60,
      left: 0,
      right: 0,
      child: Center(
        child: SizedBox(
          width: 40,
          height: 40,
          child: CircularProgressIndicator(
            strokeWidth: 3,
            valueColor: AlwaysStoppedAnimation<Color>(
              AppColors.primary.withOpacity(0.8),
            ),
          ),
        ),
      ),
    );
  }
}

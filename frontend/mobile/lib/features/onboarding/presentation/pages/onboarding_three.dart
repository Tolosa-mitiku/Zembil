import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/features/onboarding/presentation/bloc/onboarding/onboarding_bloc.dart';
import 'package:zembil/features/onboarding/presentation/bloc/onboarding/onboarding_event.dart';
import 'package:zembil/features/onboarding/presentation/bloc/onboarding/onboarding_state.dart';

class OnboardingThree extends StatelessWidget {
  const OnboardingThree({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    // final screenWidth = MediaQuery.of(context).size.width;
    return BlocListener<OnboardingBloc, OnboardingState>(
      listener: (context, state) {
        if (state is OnboardingCompleted) {
          GoRouter.of(context).go("/login");
        }
      },
      child: Scaffold(
        backgroundColor: Theme.of(context).primaryColor,
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 30.0, vertical: 50.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Align(
                alignment: Alignment.centerLeft,
                child: GestureDetector(
                  child: Icon(Icons.arrow_back),
                  onTap: () {
                    context.pop();
                  },
                ),
              ),
              SizedBox(height: screenHeight * 0.1),
              SvgPicture.asset(
                'assets/svgs/onboarding_three.svg',
                // height: screenWidth * 0.46153846153,
              ),
              Text("Find Your Favrorite Items",
                  style: Theme.of(context).textTheme.titleLarge),
              Text("Find your favorite items you need\n to buy daily on zembil",
                  style: Theme.of(context).textTheme.titleSmall),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircleAvatar(
                    radius: 5.0,
                    backgroundColor: Colors.black,
                  ),
                  const SizedBox(width: 5),
                  CircleAvatar(
                    radius: 5.0,
                    backgroundColor: Colors.black,
                  ),
                  const SizedBox(width: 5),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(5),
                    ),
                    width: 30,
                    height: 10,
                    margin: const EdgeInsets.symmetric(horizontal: 1),
                  ),
                ],
              ),
              SizedBox(height: screenHeight * 0.1),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: Theme.of(context).elevatedButtonTheme.style,
                  onPressed: () {
                    context
                        .read<OnboardingBloc>()
                        .add(CompleteOnboardingEvent());
                  },
                  child: Text(
                    'Register',
                    style: Theme.of(context).textTheme.labelLarge,
                  ),
                ),
              ),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: Theme.of(context).elevatedButtonTheme.style,
                  onPressed: () {
                    context
                        .read<OnboardingBloc>()
                        .add(CompleteOnboardingEvent());
                  },
                  child: Text(
                    'Log in',
                    style: Theme.of(context).textTheme.labelLarge,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

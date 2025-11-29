import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/features/authentication/presentation/bloc/sign_up_bloc/sign_up_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/sign_up_bloc/sign_up_event.dart';
import 'package:zembil/features/authentication/presentation/bloc/sign_up_bloc/sign_up_state.dart';
import 'package:zembil/features/authentication/presentation/widgets/auth_rich_text.dart';
import 'package:zembil/features/authentication/presentation/widgets/custom_button.dart';
import 'package:zembil/features/authentication/presentation/widgets/custom_text_field.dart';
import 'package:zembil/features/authentication/presentation/widgets/sign_in_with.dart';
import 'package:zembil/features/authentication/presentation/widgets/terms_and_privacy.dart';
import 'package:zembil/injector.dart';

class Signup extends StatelessWidget {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  Signup({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: BlocProvider(
        create: (context) => locator<SignUpBloc>(),
        child: SingleChildScrollView(
          child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 50.0, vertical: 100),
            child: BlocConsumer<SignUpBloc, SignUpState>(
                listener: (context, state) {
              if (state is FirebaseEmailVerificationRequired) {
                GoRouter.of(context).push("/email_verification");
              } else if (state is FirebaseSignUpAuthenticated) {
                context.read<SignUpBloc>().add(ZembilLogInEvent());
              } else if (state is ZembilLogInAuthenticated) {
                GoRouter.of(context).go("/index");
              } else if (state is SignUpError) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(state.message)),
                );
              }
            }, builder: (context, state) {
              String? emailError, passwordError, confirmPasswordError;
              if (state is SignUpFormValidationError) {
                emailError = state.emailError;
                passwordError = state.passwordError;
                confirmPasswordError = state.confirmPasswordError;
              }
              return Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Icon(
                    Icons.shopping_bag_rounded,
                    size: screenHeight * 0.08,
                    color: theme.colorScheme.primary,
                  ),
                  SizedBox(
                    height: screenHeight * 0.025,
                  ),
                  Text(
                    "Create Account",
                    style: theme.textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Sign up to start shopping",
                    style: theme.textTheme.bodyMedium,
                  ),
                  SizedBox(
                    height: screenHeight * 0.025,
                  ),
                  CustomTextField(
                    hintText: 'Email/Phone',
                    hintStyle: theme.textTheme.labelMedium,
                    errorText: emailError,
                    controller: _emailController,
                    onChanged: (value) {
                      context.read<SignUpBloc>().add(EmailChanged(value));
                    },
                  ),
                  SizedBox(
                    height: screenHeight * 0.035,
                  ),
                  CustomTextField(
                    hintText: 'Password',
                    hintStyle: theme.textTheme.labelMedium,
                    errorText: passwordError,
                    controller: _passwordController,
                    obscureText: true,
                    onChanged: (value) {
                      context.read<SignUpBloc>().add(PasswordChanged(value));
                    },
                  ),
                  SizedBox(
                    height: screenHeight * 0.035,
                  ),
                  CustomTextField(
                    hintText: 'Confirm password',
                    hintStyle: theme.textTheme.labelMedium,
                    errorText: confirmPasswordError,
                    controller: _confirmPasswordController,
                    obscureText: true,
                    onChanged: (value) {
                      context
                          .read<SignUpBloc>()
                          .add(ConfirmPasswordChanged(value));
                    },
                  ),
                  SizedBox(
                    height: screenHeight * 0.05,
                  ),
                  state is SignUpWithEmailAndPasswordLoading
                      ? CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(
                            theme.colorScheme.primary,
                          ),
                        )
                      : CustomButton(
                          text: 'Sign Up',
                          onPressed: () {
                            context.read<SignUpBloc>().add(
                                FirebaseSignUpWithEmailEvent(
                                    _emailController.text,
                                    _passwordController.text));
                          },
                        ),
                  SizedBox(
                    height: screenHeight * 0.025,
                  ),
                  const TermsAndPrivacy(),
                  SizedBox(
                    height: screenHeight * 0.025,
                  ),
                  state is SignUpWithGoogleLoading
                      ? CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(
                            theme.colorScheme.primary,
                          ),
                        )
                      : SignInWith(
                          image: 'assets/svgs/google.svg',
                          onPressed: () {
                            context
                                .read<SignUpBloc>()
                                .add(FirebaseSignUpWithGoogleEvent());
                          }),
                  SizedBox(
                    height: screenHeight * 0.075,
                  ),
                  AuthRichText(
                    text1: 'Already have an account? ',
                    text2: 'Log In',
                    onPressed: () {
                      context.go("/login");
                    },
                  ),
                ],
              );
            }),
          ),
        ),
      ),
    );
  }
}

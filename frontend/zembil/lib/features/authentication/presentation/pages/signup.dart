import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/sign_up_bloc/sign_up_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/sign_up_bloc/sign_up_event.dart';
import 'package:zembil/features/authentication/presentation/bloc/sign_up_bloc/sign_up_state.dart';
import 'package:zembil/features/authentication/presentation/pages/login.dart';
import 'package:zembil/features/authentication/presentation/widgets/auth_button.dart';
import 'package:zembil/features/authentication/presentation/widgets/auth_rich_text.dart';
import 'package:zembil/features/authentication/presentation/widgets/custom_text_field.dart';
import 'package:zembil/features/authentication/presentation/widgets/sign_in_with.dart';
import 'package:zembil/features/authentication/presentation/widgets/terms_and_privacy.dart';
import 'package:zembil/home.dart';
import 'package:zembil/injector.dart';

class Signup extends StatelessWidget {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  Signup({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: BlocProvider(
        create: (context) => locator<SignUpBloc>(),
        child: SingleChildScrollView(
          child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 50.0, vertical: 100),
            child: BlocConsumer<SignUpBloc, SignUpState>(
                listener: (context, state) {
              if (state is SignUpAuthenticated) {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => Home()),
                );
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
                  Icon(Icons.shop_2_outlined, size: screenHeight * 0.05),
                  SizedBox(
                    height: screenHeight * 0.025,
                  ),
                  Text("Sign up",
                      style: Theme.of(context).textTheme.titleLarge),
                  SizedBox(
                    height: screenHeight * 0.025,
                  ),
                  CustomTextField(
                    hintText: 'Email/Phone',
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
                    errorText: passwordError,
                    controller: _passwordController,
                    onChanged: (value) {
                      context.read<SignUpBloc>().add(PasswordChanged(value));
                    },
                  ),
                  SizedBox(
                    height: screenHeight * 0.035,
                  ),
                  CustomTextField(
                    hintText: 'Confirm password',
                    errorText: confirmPasswordError,
                    controller: _confirmPasswordController,
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
                      ? CircularProgressIndicator()
                      : AuthButton(
                          text: 'Sign Up',
                          emailController: _emailController,
                          passwordController: _passwordController,
                          onPressed: () {
                            context.read<SignUpBloc>().add(SignUpWithEmailEvent(
                                _emailController.text,
                                _passwordController.text));
                          },
                        ),
                  SizedBox(
                    height: screenHeight * 0.025,
                  ),
                  TermsAndPrivacy(),
                  SizedBox(
                    height: screenHeight * 0.025,
                  ),
                  state is SignUpWithGoogleLoading
                      ? CircularProgressIndicator()
                      : SignInWith(
                          image: 'assets/svgs/google.svg',
                          onPressed: () {
                            context
                                .read<SignUpBloc>()
                                .add(SignInWithGoogleEvent());
                          }),
                  SizedBox(
                    height: screenHeight * 0.075,
                  ),
                  AuthRichText(
                    text1: 'Already have an account? ',
                    text2: 'Log In',
                    onPressed: () {
                      // Navigate to the Login Page
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => Login()),
                      );
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

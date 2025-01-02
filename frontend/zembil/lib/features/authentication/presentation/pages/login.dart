import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/log_in_bloc/log_in_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/log_in_bloc/log_in_event.dart';
import 'package:zembil/features/authentication/presentation/bloc/log_in_bloc/log_in_state.dart';
import 'package:zembil/features/authentication/presentation/pages/email_verification.dart';
import 'package:zembil/features/authentication/presentation/pages/forgot_password.dart';
import 'package:zembil/features/authentication/presentation/pages/signup.dart';
import 'package:zembil/features/authentication/presentation/widgets/auth_rich_text.dart';
import 'package:zembil/features/authentication/presentation/widgets/custom_button.dart';
import 'package:zembil/features/authentication/presentation/widgets/custom_text_field.dart';
import 'package:zembil/features/authentication/presentation/widgets/sign_in_with.dart';
import 'package:zembil/features/navigation/pages/home.dart';
import 'package:zembil/injector.dart';

class Login extends StatelessWidget {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  Login({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: BlocProvider(
        create: (context) => locator<LogInBloc>(),
        child: SingleChildScrollView(
          child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 50.0, vertical: 100),
            child:
                BlocConsumer<LogInBloc, LogInState>(listener: (context, state) {
              if (state is FirebaseLogInAuthenticated) {
                context.read<LogInBloc>().add(CheckVerificationEmailEvent());
              } else if (state is FirebaseEmailVerified ||
                  state is FirebaseGoogleLogInAuthenticated) {
                context.read<LogInBloc>().add(ZembilLogInEvent());
              } else if (state is FirebaseEmailVerificationRequired) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => EmailVerificationScreen()),
                );
              } else if (state is ZembilLogInAuthenticated) {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => IndexPage()),
                );
              } else if (state is LogInError) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(state.message)),
                );
              }
            }, builder: (context, state) {
              String? emailError, passwordError;
              if (state is LogInFormValidationError) {
                emailError = state.emailError;
                passwordError = state.passwordError;
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
                    height: screenHeight * 0.1,
                  ),
                  CustomTextField(
                    hintText: 'Email/Phone',
                    hintStyle: Theme.of(context).textTheme.labelMedium,
                    errorText: emailError,
                    controller: _emailController,
                    onChanged: (value) {
                      context.read<LogInBloc>().add(LogInEmailChanged(value));
                    },
                  ),
                  SizedBox(
                    height: screenHeight * 0.035,
                  ),
                  CustomTextField(
                    hintText: 'Password',
                    hintStyle: Theme.of(context).textTheme.labelMedium,
                    errorText: passwordError,
                    controller: _passwordController,
                    onChanged: (value) {
                      context
                          .read<LogInBloc>()
                          .add(LogInPasswordChanged(value));
                    },
                  ),
                  SizedBox(
                    height: screenHeight * 0.05,
                  ),
                  state is LogInWithEmailAndPasswordLoading
                      ? CircularProgressIndicator()
                      : CustomButton(
                          text: 'Log In',
                          onPressed: () {
                            context.read<LogInBloc>().add(
                                FirebaseLogInWithEmailEvent(
                                    _emailController.text,
                                    _passwordController.text));
                          },
                        ),
                  SizedBox(
                    height: screenHeight * 0.05,
                  ),
                  state is LogInWithGoogleLoading
                      ? CircularProgressIndicator()
                      : SignInWith(
                          image: 'assets/svgs/google.svg',
                          onPressed: () {
                            context
                                .read<LogInBloc>()
                                .add(FirebaseSignInWithGoogleEvent());
                          }),
                  SizedBox(
                    height: screenHeight * 0.05,
                  ),
                  AuthRichText(
                    text1: 'Don\'t have an account? ',
                    text2: 'Register',
                    onPressed: () {
                      // Navigate to the Login Page
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => Signup()),
                      );
                    },
                  ),
                  AuthRichText(
                    text1: '',
                    text2: 'Forgot Password?',
                    onPressed: () {
                      // Navigate to the Login Page
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => ForgotPasswordScreen()),
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

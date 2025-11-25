import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/features/authentication/presentation/bloc/log_in_bloc/log_in_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/log_in_bloc/log_in_event.dart';
import 'package:zembil/features/authentication/presentation/bloc/log_in_bloc/log_in_state.dart';
import 'package:zembil/features/authentication/presentation/widgets/auth_rich_text.dart';
import 'package:zembil/features/authentication/presentation/widgets/custom_button.dart';
import 'package:zembil/features/authentication/presentation/widgets/custom_text_field.dart';
import 'package:zembil/features/authentication/presentation/widgets/sign_in_with.dart';
import 'package:zembil/injector.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  late LogInBloc _loginBloc;

  @override
  void initState() {
    super.initState();
    _loginBloc = locator<LogInBloc>();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _loginBloc.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: BlocProvider.value(
        value: _loginBloc,
        child: SingleChildScrollView(
          child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 50.0, vertical: 100),
            child:
                BlocConsumer<LogInBloc, LogInState>(listener: (context, state) {
              if (state is FirebaseLogInAuthenticated) {
                _loginBloc.add(CheckVerificationEmailEvent());
              } else if (state is FirebaseEmailVerified ||
                  state is FirebaseGoogleLogInAuthenticated) {
                _loginBloc.add(ZembilLogInEvent());
              } else if (state is FirebaseEmailVerificationRequired) {
                // Use future to ensure navigation happens after current frame
                Future.microtask(() => context.go("/email_verification"));
              } else if (state is ZembilLogInAuthenticated) {
                // Use future to ensure navigation happens after current frame
                Future.microtask(() => context.go("/index"));
              } else if (state is LogInError) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(state.message),
                    backgroundColor: Colors.red,
                  ),
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
                  Text("Log in", style: Theme.of(context).textTheme.titleLarge),
                  SizedBox(
                    height: screenHeight * 0.1,
                  ),
                  CustomTextField(
                    hintText: 'Email/Phone',
                    hintStyle: Theme.of(context).textTheme.labelMedium,
                    errorText: emailError,
                    controller: _emailController,
                    onChanged: (value) {
                      _loginBloc.add(LogInEmailChanged(value));
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
                      _loginBloc.add(LogInPasswordChanged(value));
                    },
                  ),
                  SizedBox(
                    height: screenHeight * 0.05,
                  ),
                  state is LogInWithEmailAndPasswordLoading
                      ? const CircularProgressIndicator()
                      : CustomButton(
                          text: 'Log In',
                          onPressed: () {
                            _loginBloc.add(FirebaseLogInWithEmailEvent(
                                _emailController.text,
                                _passwordController.text));
                          },
                        ),
                  SizedBox(
                    height: screenHeight * 0.05,
                  ),
                  state is LogInWithGoogleLoading
                      ? const CircularProgressIndicator()
                      : SignInWith(
                          image: 'assets/svgs/google.svg',
                          onPressed: () {
                            _loginBloc.add(FirebaseSignInWithGoogleEvent());
                          }),
                  SizedBox(
                    height: screenHeight * 0.05,
                  ),
                  AuthRichText(
                    text1: 'Don\'t have an account? ',
                    text2: 'Register',
                    onPressed: () {
                      // Use go instead of push for better navigation stack management
                      context.go("/signup");
                    },
                  ),
                  AuthRichText(
                    text1: '',
                    text2: 'Forgot Password?',
                    onPressed: () {
                      context.push("/forgot_password");
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

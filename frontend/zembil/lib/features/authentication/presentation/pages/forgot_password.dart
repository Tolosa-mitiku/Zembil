import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/features/authentication/presentation/bloc/forgot_password_bloc.dart/forgot_password_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/forgot_password_bloc.dart/forgot_password_event.dart';
import 'package:zembil/features/authentication/presentation/bloc/forgot_password_bloc.dart/forgot_password_state.dart';
import 'package:zembil/features/authentication/presentation/widgets/custom_button.dart';
import 'package:zembil/features/authentication/presentation/widgets/custom_text_field.dart';
import 'package:zembil/injector.dart';

class ForgotPasswordScreen extends StatelessWidget {
  final _emailController = TextEditingController();
  ForgotPasswordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      appBar: AppBar(
          title: Text(
        'Reset Your Password',
        style: Theme.of(context).textTheme.titleLarge,
      )),
      body: BlocProvider(
        create: (context) => locator<ForgotPasswordBloc>(),
        child: SingleChildScrollView(
          child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 50.0, vertical: 100),
            child: BlocConsumer<ForgotPasswordBloc, ForgotPasswordState>(
              listener: (context, state) async {
                if (state is ResetPasswordSentSuccess) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(state.message)),
                  );

                  await Future.delayed(Duration(seconds: 1));

                  context.go("/login");
                } else if (state is ForgotPasswordError) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(state.message)),
                  );
                }
              },
              builder: (context, state) {
                String? emailError;
                if (state is ForgotPasswordFormValidationError) {
                  emailError = state.emailError;
                }
                return Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CustomTextField(
                      hintText: 'Please provide the email to your account',
                      hintStyle: Theme.of(context).textTheme.labelMedium,
                      errorText: emailError,
                      controller: _emailController,
                      onChanged: (value) {
                        context
                            .read<ForgotPasswordBloc>()
                            .add(ForgotPasswordEmailChanged(value));
                      },
                    ),
                    SizedBox(
                      height: screenHeight * 0.035,
                    ),
                    state is ResetPasswordLoading
                        ? CircularProgressIndicator()
                        : CustomButton(
                            text: 'Reset Password',
                            onPressed: () {
                              context
                                  .read<ForgotPasswordBloc>()
                                  .add(ResetPasswordEvent(
                                    _emailController.text,
                                  ));
                            },
                          ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}

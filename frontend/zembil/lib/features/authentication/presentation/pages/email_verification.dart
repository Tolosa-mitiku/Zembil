import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/features/authentication/presentation/bloc/email_verification_bloc/email_verification_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/email_verification_bloc/email_verification_event.dart';
import 'package:zembil/features/authentication/presentation/bloc/email_verification_bloc/email_verification_state.dart';

class EmailVerificationScreen extends StatefulWidget {
  const EmailVerificationScreen({super.key});

  @override
  State<EmailVerificationScreen> createState() => _VerifyEmailScreenState();
}

class _VerifyEmailScreenState extends State<EmailVerificationScreen> {
  @override
  void initState() {
    super.initState();
    _verifyEmail();
  }

  void _verifyEmail() {
    context.read<EmailVerificationBloc>().add(SendEmailVerificationEvent());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      appBar: AppBar(
          title: Text(
        'Verify Your Email',
        style: Theme.of(context).textTheme.titleLarge,
      )),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: BlocConsumer<EmailVerificationBloc, EmailVerificationState>(
          listener: (context, state) {
            if (state is SendEmailVerificationSuccess) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("Verification email sent.")),
              );
            } else if (state is EmailVerified) {
              context.read<EmailVerificationBloc>().add(ZembilLogInEvent());
            } else if (state is ZembilLogInAuthenticated) {
              context.go("/index");
            } else if (state is EmailVerificationError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(state.message)),
              );
            }
          },
          builder: (context, state) {
            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                State is SendEmailVerificationLoading
                    ? CircularProgressIndicator()
                    : Container(),
                SizedBox(height: 50),
                Text(
                  'A verification link has been sent to your email. \nPlease check your inbox and verify your email address to proceed.',
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 50),
                ElevatedButton(
                  onPressed: () {
                    context
                        .read<EmailVerificationBloc>()
                        .add(SendEmailVerificationEvent());
                  },
                  child: state is SendEmailVerificationLoading
                      ? CircularProgressIndicator()
                      : Text(
                          'Resend Verification Email',
                          style: Theme.of(context).textTheme.labelLarge,
                        ),
                ),
                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    context
                        .read<EmailVerificationBloc>()
                        .add(CheckEmailVerificationEvent());
                  },
                  child: state is CheckEmailVerificationLoading
                      ? CircularProgressIndicator()
                      : Text(
                          'Check Verification Status',
                          style: Theme.of(context).textTheme.labelLarge,
                        ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

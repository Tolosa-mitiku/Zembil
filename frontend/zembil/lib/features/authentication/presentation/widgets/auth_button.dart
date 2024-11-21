import 'package:flutter/material.dart';

class AuthButton extends StatelessWidget {
  final String text;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final VoidCallback onPressed;
  const AuthButton(
      {super.key,
      required this.text,
      required this.emailController,
      required this.passwordController,
      required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        style: Theme.of(context).elevatedButtonTheme.style,
        onPressed: onPressed,
        child: Text(
          text,
          style: Theme.of(context).textTheme.labelLarge,
        ),
      ),
    );
  }
}

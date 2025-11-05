import 'package:flutter/material.dart';

class CustomTextField extends StatelessWidget {
  final String hintText;
  final TextStyle? hintStyle;
  final String? errorText;
  final TextEditingController? controller;
  final Function(String?) onChanged;
  final bool obscureText;

  const CustomTextField({
    super.key,
    required this.hintText,
    required this.errorText,
    required this.controller,
    required this.onChanged,
    required this.hintStyle,
    this.obscureText = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return TextField(
      obscureText: obscureText,
      controller: controller,
      onChanged: onChanged,
      style: theme.textTheme.bodyLarge,
      cursorColor: theme.colorScheme.primary,
      decoration: InputDecoration(
        hintText: hintText,
        errorText: errorText,
        hintStyle: hintStyle,
        // Use theme's input decoration with custom underline style
        enabledBorder: UnderlineInputBorder(
          borderSide: BorderSide(
            color: isDark
                ? theme.colorScheme.primary.withOpacity(0.3)
                : theme.colorScheme.outline,
            width: 1.5,
          ),
        ),
        focusedBorder: UnderlineInputBorder(
          borderSide: BorderSide(
            color: theme.colorScheme.primary,
            width: 2.5,
          ),
        ),
        errorBorder: UnderlineInputBorder(
          borderSide: BorderSide(
            color: theme.colorScheme.error,
            width: 1.5,
          ),
        ),
        focusedErrorBorder: UnderlineInputBorder(
          borderSide: BorderSide(
            color: theme.colorScheme.error,
            width: 2.5,
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';

class CustomTextField extends StatelessWidget {
  final String hintText;
  final TextStyle? hintStyle;
  final String? errorText;
  final TextEditingController? controller;
  final Function(String?) onChanged;

  const CustomTextField({
    super.key,
    required this.hintText,
    required this.errorText,
    required this.controller,
    required this.onChanged,
    required this.hintStyle,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      decoration: InputDecoration(
        hintText: hintText,
        errorText: errorText,
        hintStyle: hintStyle,
        enabledBorder: const UnderlineInputBorder(
          borderSide: BorderSide(
            color: Colors.black, // Bottom border color when not focused
          ),
        ),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(
            color: Colors.black, // Bottom border color when focused
            width: 2.0, // Thickness of the focused border
          ),
        ),
      ),
      cursorColor: Colors.black, // Color of the cursor
      controller: controller,
      onChanged: onChanged,
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class SignInWith extends StatelessWidget {
  final String image;
  final VoidCallback onPressed;
  const SignInWith({super.key, required this.image, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: Theme.of(context)
            .scaffoldBackgroundColor, // Button background color
        elevation: 5.0, // Elevation value to make it look elevated
        shape: const CircleBorder(), // Circular shape
      ),
      onPressed: onPressed,
      child: SizedBox(
        width: 60, // Button width (adjust as needed)
        height: 60, // Button height (adjust as needed)
        child: Padding(
          padding: const EdgeInsets.all(8.0), // Padding inside the button
          child: SvgPicture.asset(
            image,
            height: screenWidth * 0.46153846153,
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class SignInWith extends StatelessWidget {
  final String image;
  final VoidCallback onPressed;
  const SignInWith({super.key, required this.image, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(
          color: theme.colorScheme.primary.withOpacity(0.5),
          width: 2,
        ),
      ),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: theme.cardTheme.color,
          foregroundColor: theme.colorScheme.primary,
          elevation: isDark ? 4 : 2,
          shadowColor: theme.colorScheme.primary.withOpacity(0.2),
          shape: const CircleBorder(),
          padding: const EdgeInsets.all(16),
        ),
        onPressed: onPressed,
        child: SvgPicture.asset(
          image,
          width: 28,
          height: 28,
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';

class TermsAndPrivacy extends StatelessWidget {
  const TermsAndPrivacy({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;

    return Column(children: [
      Text(
        'By signing up, you agree to our',
        style: Theme.of(context).textTheme.bodySmall,
      ),
      Text(
        'Terms and Privacy Policy',
        style: Theme.of(context).textTheme.bodySmall,
      ),
      SizedBox(
        height: screenHeight * 0.025,
      ),
      Text(
        'or',
        style: Theme.of(context).textTheme.bodySmall,
      ),
    ]);
  }
}

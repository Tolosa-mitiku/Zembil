import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:zembil/features/authentication/presentation/pages/login.dart';
import 'package:zembil/features/authentication/presentation/widgets/custom_text_field.dart';

class Signup extends StatelessWidget {
  const Signup({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 50.0, vertical: 100),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Icon(Icons.shop_2_outlined, size: screenHeight * 0.05),
              SizedBox(
                height: screenHeight * 0.025,
              ),
              Text("Sign up", style: Theme.of(context).textTheme.titleLarge),
              SizedBox(
                height: screenHeight * 0.025,
              ),
              const CustomTextField(
                hintText: 'Email/Phone',
              ),
              SizedBox(
                height: screenHeight * 0.035,
              ),
              const CustomTextField(
                hintText: 'Password',
              ),
              SizedBox(
                height: screenHeight * 0.035,
              ),
              const CustomTextField(
                hintText: 'Confirm Password',
              ),
              SizedBox(
                height: screenHeight * 0.05,
              ),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: Theme.of(context).elevatedButtonTheme.style,
                  onPressed: () {
                    // Action when button is pressed
                  },
                  child: Text(
                    'Sign Up',
                    style: Theme.of(context).textTheme.labelLarge,
                  ),
                ),
              ),
              SizedBox(
                height: screenHeight * 0.025,
              ),
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
              SizedBox(
                height: screenHeight * 0.025,
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context)
                      .scaffoldBackgroundColor, // Button background color
                  elevation: 5.0, // Elevation value to make it look elevated
                  shape: const CircleBorder(), // Circular shape
                ),
                onPressed: () {},
                child: SizedBox(
                  width: 60, // Button width (adjust as needed)
                  height: 60, // Button height (adjust as needed)
                  child: Padding(
                    padding:
                        const EdgeInsets.all(8.0), // Padding inside the button
                    child: SvgPicture.asset(
                      'assets/svgs/google.svg',
                      height: screenWidth * 0.46153846153,
                    ),
                  ),
                ),
              ),
              SizedBox(
                height: screenHeight * 0.075,
              ),
              RichText(
                text: TextSpan(
                  text: 'Already have an account? ',
                  style:
                      Theme.of(context).textTheme.labelMedium, // Default style
                  children: <TextSpan>[
                    TextSpan(
                      text: 'Log In',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                      recognizer: TapGestureRecognizer()
                        ..onTap = () {
                          // Navigate to the Login Page
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const Login()),
                          );
                        },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

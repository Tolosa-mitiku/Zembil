import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:zembil/features/onboarding/presentation/pages/onboarding_three.dart';
import 'package:zembil/features/onboarding/presentation/pages/onboarding_two.dart';

class OnboardingOne extends StatelessWidget {
  const OnboardingOne({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    // final screenWidth = MediaQuery.of(context).size.width;
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 30.0, vertical: 50.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Align(
              alignment: Alignment.centerLeft,
              child: GestureDetector(
                child: Icon(Icons.arrow_back),
                onTap: () {
                  Navigator.pop(context);
                },
              ),
            ),
            SizedBox(height: screenHeight * 0.1),
            SvgPicture.asset(
              'assets/svgs/onboarding_one.svg',
              // height: screenWidth * 0.46153846153,
            ),
            Text("Find Your Favrorite Items",
                style: Theme.of(context).textTheme.titleLarge),
            Text("Find your favorite items you need\n to buy daily on zembil",
                style: Theme.of(context).textTheme.titleSmall),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(5),
                  ),
                  width: 30,
                  height: 10,
                  margin: const EdgeInsets.symmetric(horizontal: 1),
                ),
                const SizedBox(width: 5),
                CircleAvatar(
                  radius: 5.0,
                  backgroundColor: Colors.black,
                ),
                const SizedBox(width: 5),
                CircleAvatar(
                  radius: 5.0,
                  backgroundColor: Colors.black,
                ),
              ],
            ),
            SizedBox(height: screenHeight * 0.1),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                  child: Text(
                    "Skip",
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                  onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => OnboardingThree())),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context)
                        .scaffoldBackgroundColor, // Button background color
                    elevation: 3.0, // Elevation value to make it look elevated
                    shape: const CircleBorder(), // Circular shape
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => OnboardingTwo()),
                    );
                  },
                  child: Padding(
                    padding: EdgeInsets.all(15),
                    child: Icon(Icons.arrow_forward),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}

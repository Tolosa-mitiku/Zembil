import 'package:flutter/material.dart';

class SelectPaymentMethod extends StatelessWidget {
  final VoidCallback onPayPal;
  final VoidCallback onStripe;

  const SelectPaymentMethod({
    super.key,
    required this.onPayPal,
    required this.onStripe,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20.0), // Rounded corners
      ),
      child: Container(
        padding: const EdgeInsets.all(20.0),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20.0),

          color: Theme.of(context).primaryColor, // Background color
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min, // Wrap content
          children: [
            // Icon at the top

            // Message
            Text(
              "Select Payment Method",
              style: TextStyle(
                fontSize: 16.0,
                color: Colors.black87,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 20),
            // Buttons
            Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                // No Button
                ElevatedButton(
                  onPressed: onPayPal,
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 45),
                  ),
                  child: Text(
                    'Paypal',
                    style: Theme.of(context).textTheme.labelLarge,
                  ),
                ),
                // Yes Button
                ElevatedButton(
                  onPressed: onStripe,
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 45),
                  ),
                  child: Text(
                    'Stripe',
                    style: Theme.of(context).textTheme.labelLarge,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

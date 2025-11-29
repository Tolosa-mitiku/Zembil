import 'dart:convert';

import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:zembil/core/http_Client.dart';
import 'package:zembil/injector.dart';

class StripeServices {
  final HttpClient client = locator<HttpClient>();
  StripeServices._();

  static final StripeServices instance = StripeServices._();

  Future<void> makePayment(int total) async {
    try {
      String? paymentIntentClientSecret = await _createPaymentIntent(
        total,
        'usd',
      );
      if (paymentIntentClientSecret == null) return;
      await Stripe.instance.initPaymentSheet(
        paymentSheetParameters: SetupPaymentSheetParameters(
          paymentIntentClientSecret: paymentIntentClientSecret,
          merchantDisplayName: "Tolosa Mitiku",
        ),
      );
      await _processPayment();
    } catch (e) {
      print(e.toString());
    }
  }

  Future<String?> _createPaymentIntent(int amount, String currency) async {
    try {
      final url = 'https://api.stripe.com/v1/payment_intents';
      final calculatedAmount = 100 * amount;
      Map<String, dynamic> body = {
        "amount": calculatedAmount.toString(),
        "currency": currency
      };

      final response = await client.postStripe(url, body);
      return jsonDecode(response.body)["client_secret"];
    } catch (e) {}
    return null;
  }

  Future<void> _processPayment() async {
    try {
      await Stripe.instance.presentPaymentSheet();
      await Stripe.instance.confirmPaymentSheetPayment();
    } catch (e) {
      print(e.toString());
    }
  }
}

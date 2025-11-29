import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/core/stripe.dart';
import 'package:zembil/features/payments/data/data_sources/payment_data_sources.dart';

class RemotePaymentDataSources extends PaymentDatasources {
  @override
  Either<Failure, void> initiatePayPalPayment() {
    // TODO: implement initiatePayPalPayment
    throw UnimplementedError();
  }

  @override
  Either<Failure, void> initiateStripePayment(int total) {
    try {
      StripeServices.instance.makePayment(total);
      return Right(null);
    } catch (e) {
      return Left(NetworkFailure("Network failed: ${e.toString()}"));
    }
  }
}

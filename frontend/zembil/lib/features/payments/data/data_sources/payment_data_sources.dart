import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';

abstract class PaymentDatasources {
  Either<Failure, void> initiatePayPalPayment();

  Either<Failure, void> initiateStripePayment(int total);
}
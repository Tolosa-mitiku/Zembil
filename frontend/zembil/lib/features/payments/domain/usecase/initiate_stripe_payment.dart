import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/payments/domain/repository/payment_repository.dart';

class InitiateStripePayment {
  final PaymentRepository stripePaymentRepository;

  InitiateStripePayment(this.stripePaymentRepository);
  Either<Failure, void> call(int total) =>
      stripePaymentRepository.initiateStripePayment(total);
}

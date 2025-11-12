import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/payments/domain/repository/payment_repository.dart';

class InitiatePaypalPayment {
  final PaymentRepository paypalPaymentRepository;

  InitiatePaypalPayment(this.paypalPaymentRepository);

  Either<Failure, void> call() =>
      paypalPaymentRepository.initiatePayPalPayment();
}

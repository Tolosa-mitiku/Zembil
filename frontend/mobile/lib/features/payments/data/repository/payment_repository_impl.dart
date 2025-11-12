import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/payments/data/data_sources/payment_data_sources.dart';
import 'package:zembil/features/payments/domain/repository/payment_repository.dart';

class PaymentRepositoryImpl extends PaymentRepository {
  final PaymentDatasources paymentDataSource;

  PaymentRepositoryImpl(this.paymentDataSource);

  @override
  Either<Failure, void> initiatePayPalPayment() =>
      paymentDataSource.initiatePayPalPayment();

  @override
  Either<Failure, void> initiateStripePayment(int total) =>
      paymentDataSource.initiateStripePayment(total);
}

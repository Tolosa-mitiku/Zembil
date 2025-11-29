import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/orders/domain/entity/order.dart';
import 'package:zembil/features/orders/domain/repository/order_repository.dart';

class CancelOrder {
  final OrderRepository repository;

  CancelOrder(this.repository);

  Future<Either<Failure, OrderEntity>> call(String orderId) async {
    return await repository.cancelOrder(orderId);
  }
}


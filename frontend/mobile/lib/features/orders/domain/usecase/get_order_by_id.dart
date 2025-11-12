import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/orders/domain/entity/order.dart';
import 'package:zembil/features/orders/domain/repository/order_repository.dart';

class GetOrderById {
  final OrderRepository repository;

  GetOrderById(this.repository);

  Future<Either<Failure, OrderEntity>> call(String orderId) async {
    return await repository.getOrderById(orderId);
  }
}


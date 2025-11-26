import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/orders/domain/entity/order.dart';

abstract class OrderRepository {
  Future<Either<Failure, List<OrderEntity>>> getUserOrders({
    String? status,
    DateTime? startDate,
    DateTime? endDate,
  });
  Future<Either<Failure, OrderEntity>> getOrderById(String orderId);
  Future<Either<Failure, OrderEntity>> createOrder(OrderEntity order);
  Future<Either<Failure, OrderEntity>> cancelOrder(String orderId);
}


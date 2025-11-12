import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/orders/domain/entity/order.dart';
import 'package:zembil/features/orders/domain/repository/order_repository.dart';

class GetUserOrders {
  final OrderRepository repository;

  GetUserOrders(this.repository);

  Future<Either<Failure, List<OrderEntity>>> call({
    String? status,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    return await repository.getUserOrders(
      status: status,
      startDate: startDate,
      endDate: endDate,
    );
  }
}


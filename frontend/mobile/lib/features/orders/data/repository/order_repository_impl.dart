import 'package:dartz/dartz.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/orders/data/data_sources/order_remote_data_source.dart';
import 'package:zembil/features/orders/data/models/order_model.dart';
import 'package:zembil/features/orders/domain/entity/order.dart';
import 'package:zembil/features/orders/domain/repository/order_repository.dart';

class OrderRepositoryImpl implements OrderRepository {
  final OrderDataSource orderDataSource;

  OrderRepositoryImpl(this.orderDataSource);

  @override
  Future<Either<Failure, List<OrderEntity>>> getUserOrders({
    String? status,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    return await orderDataSource.getUserOrders(
      status: status,
      startDate: startDate,
      endDate: endDate,
    );
  }

  @override
  Future<Either<Failure, OrderEntity>> getOrderById(String orderId) async {
    return await orderDataSource.getOrderById(orderId);
  }

  @override
  Future<Either<Failure, OrderEntity>> createOrder(OrderEntity order) async {
    // Convert to model for data layer
    final orderModel = OrderModel(
      id: order.id,
      items: order.items,
      totalPrice: order.totalPrice,
      shippingAddress: order.shippingAddress,
      tracking: order.tracking,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      paymentId: order.paymentId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    );
    return await orderDataSource.createOrder(orderModel);
  }

  @override
  Future<Either<Failure, OrderEntity>> cancelOrder(String orderId) async {
    return await orderDataSource.cancelOrder(orderId);
  }
}


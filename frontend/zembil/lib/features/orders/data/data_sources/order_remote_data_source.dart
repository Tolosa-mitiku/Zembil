import 'dart:convert';
import 'package:dartz/dartz.dart';
import 'package:zembil/core/constants.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/core/http_Client.dart';
import 'package:zembil/features/orders/data/models/order_model.dart';

abstract class OrderDataSource {
  Future<Either<Failure, List<OrderModel>>> getUserOrders({
    String? status,
    DateTime? startDate,
    DateTime? endDate,
  });
  Future<Either<Failure, OrderModel>> getOrderById(String orderId);
  Future<Either<Failure, OrderModel>> createOrder(OrderModel order);
  Future<Either<Failure, OrderModel>> cancelOrder(String orderId);
}

class OrderRemoteDataSource implements OrderDataSource {
  final HttpClient httpClient;

  OrderRemoteDataSource(this.httpClient);

  @override
  Future<Either<Failure, List<OrderModel>>> getUserOrders({
    String? status,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    try {
      final filters = {
        if (status != null) 'status': status,
        if (startDate != null) 'startDate': startDate.toIso8601String(),
        if (endDate != null) 'endDate': endDate.toIso8601String(),
      };
      final response = await httpClient.get(Urls.orders, filters: filters);
      final decodedResponse = jsonDecode(response.body);

      // Handle response format
      List<dynamic> ordersData;
      if (decodedResponse is Map && decodedResponse.containsKey('data')) {
        ordersData = decodedResponse['data'] as List<dynamic>;
      } else if (decodedResponse is List) {
        ordersData = decodedResponse;
      } else {
        return Left(ServerFailure("Invalid response format"));
      }

      final orders =
          ordersData.map((e) => OrderModel.fromJson(e)).toList();
      return Right(orders);
    } on NetworkFailure catch (e) {
      return Left(e);
    } on ServerFailure catch (e) {
      return Left(e);
    } on AuthFailure catch (e) {
      return Left(e);
    } catch (e) {
      print('❌ Get orders error: $e');
      return Left(ServerFailure("Failed to fetch orders: ${e.toString()}"));
    }
  }

  @override
  Future<Either<Failure, OrderModel>> getOrderById(String orderId) async {
    try {
      final response = await httpClient.get("${Urls.orders}/$orderId");
      final decodedResponse = jsonDecode(response.body);

      // Handle response format
      Map<String, dynamic> orderData;
      if (decodedResponse is Map && decodedResponse.containsKey('data')) {
        orderData = Map<String, dynamic>.from(decodedResponse['data'] as Map);
      } else if (decodedResponse is Map) {
        orderData = Map<String, dynamic>.from(decodedResponse);
      } else {
        return Left(ServerFailure("Invalid response format"));
      }

      final order = OrderModel.fromJson(orderData);
      return Right(order);
    } on NetworkFailure catch (e) {
      return Left(e);
    } on ServerFailure catch (e) {
      return Left(e);
    } on AuthFailure catch (e) {
      return Left(e);
    } catch (e) {
      print('❌ Get order by ID error: $e');
      return Left(ServerFailure("Failed to fetch order: ${e.toString()}"));
    }
  }

  @override
  Future<Either<Failure, OrderModel>> createOrder(OrderModel order) async {
    try {
      final response = await httpClient.post(Urls.orders, order.toJson());
      final decodedResponse = jsonDecode(response.body);

      // Handle response format
      Map<String, dynamic> orderData;
      if (decodedResponse is Map && decodedResponse.containsKey('data')) {
        orderData = Map<String, dynamic>.from(decodedResponse['data'] as Map);
      } else if (decodedResponse is Map) {
        orderData = Map<String, dynamic>.from(decodedResponse);
      } else {
        return Left(ServerFailure("Invalid response format"));
      }

      final createdOrder = OrderModel.fromJson(orderData);
      return Right(createdOrder);
    } on NetworkFailure catch (e) {
      return Left(e);
    } on ServerFailure catch (e) {
      return Left(e);
    } on AuthFailure catch (e) {
      return Left(e);
    } catch (e) {
      print('❌ Create order error: $e');
      return Left(ServerFailure("Failed to create order: ${e.toString()}"));
    }
  }

  @override
  Future<Either<Failure, OrderModel>> cancelOrder(String orderId) async {
    try {
      final response =
          await httpClient.put("${Urls.orders}/$orderId/cancel", {});
      final decodedResponse = jsonDecode(response.body);

      // Handle response format
      Map<String, dynamic> orderData;
      if (decodedResponse is Map && decodedResponse.containsKey('data')) {
        orderData = Map<String, dynamic>.from(decodedResponse['data'] as Map);
      } else if (decodedResponse is Map) {
        orderData = Map<String, dynamic>.from(decodedResponse);
      } else {
        return Left(ServerFailure("Invalid response format"));
      }

      final canceledOrder = OrderModel.fromJson(orderData);
      return Right(canceledOrder);
    } on NetworkFailure catch (e) {
      return Left(e);
    } on ServerFailure catch (e) {
      return Left(e);
    } on AuthFailure catch (e) {
      return Left(e);
    } catch (e) {
      print('❌ Cancel order error: $e');
      return Left(ServerFailure("Failed to cancel order: ${e.toString()}"));
    }
  }
}


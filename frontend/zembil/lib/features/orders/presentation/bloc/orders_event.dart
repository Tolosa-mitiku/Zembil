import 'package:equatable/equatable.dart';

abstract class OrdersEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class GetUserOrdersEvent extends OrdersEvent {
  final String? status;
  final DateTime? startDate;
  final DateTime? endDate;

  GetUserOrdersEvent({this.status, this.startDate, this.endDate});

  @override
  List<Object?> get props => [status, startDate, endDate];
}

class GetOrderByIdEvent extends OrdersEvent {
  final String orderId;

  GetOrderByIdEvent(this.orderId);

  @override
  List<Object?> get props => [orderId];
}

class CancelOrderEvent extends OrdersEvent {
  final String orderId;

  CancelOrderEvent(this.orderId);

  @override
  List<Object?> get props => [orderId];
}

class FilterOrdersByStatusEvent extends OrdersEvent {
  final String? status;

  FilterOrdersByStatusEvent(this.status);

  @override
  List<Object?> get props => [status];
}

class LoadMoreOrdersEvent extends OrdersEvent {
  final int page;
  final String? status;
  final DateTime? startDate;
  final DateTime? endDate;

  LoadMoreOrdersEvent({
    required this.page,
    this.status,
    this.startDate,
    this.endDate,
  });

  @override
  List<Object?> get props => [page, status, startDate, endDate];
}

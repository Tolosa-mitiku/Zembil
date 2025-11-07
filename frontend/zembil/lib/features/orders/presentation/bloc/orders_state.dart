import 'package:equatable/equatable.dart';
import 'package:zembil/features/orders/domain/entity/order.dart';

abstract class OrdersState extends Equatable {
  @override
  List<Object?> get props => [];
}

class OrdersInitial extends OrdersState {}

class OrdersLoading extends OrdersState {}

class OrdersLoaded extends OrdersState {
  final List<OrderEntity> orders;
  final String? currentFilter;
  final int currentPage;
  final bool hasMore;
  final bool isLoadingMore;

  OrdersLoaded(
    this.orders, {
    this.currentFilter,
    this.currentPage = 1,
    this.hasMore = false,
    this.isLoadingMore = false,
  });

  @override
  List<Object?> get props => [orders, currentFilter, currentPage, hasMore, isLoadingMore];

  List<OrderEntity> get activeOrders =>
      orders.where((order) => order.tracking.isActive).toList();

  List<OrderEntity> get completedOrders =>
      orders.where((order) => !order.tracking.isActive).toList();

  OrdersLoaded copyWith({
    List<OrderEntity>? orders,
    String? currentFilter,
    int? currentPage,
    bool? hasMore,
    bool? isLoadingMore,
  }) {
    return OrdersLoaded(
      orders ?? this.orders,
      currentFilter: currentFilter ?? this.currentFilter,
      currentPage: currentPage ?? this.currentPage,
      hasMore: hasMore ?? this.hasMore,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
    );
  }
}

class OrdersError extends OrdersState {
  final String message;

  OrdersError(this.message);

  @override
  List<Object?> get props => [message];
}

class OrderDetailLoading extends OrdersState {}

class OrderDetailLoaded extends OrdersState {
  final OrderEntity order;

  OrderDetailLoaded(this.order);

  @override
  List<Object?> get props => [order];
}

class OrderCanceling extends OrdersState {}

class OrderCanceled extends OrdersState {
  final OrderEntity order;

  OrderCanceled(this.order);

  @override
  List<Object?> get props => [order];
}


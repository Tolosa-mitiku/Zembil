import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/orders/domain/usecase/cancel_order.dart';
import 'package:zembil/features/orders/domain/usecase/get_order_by_id.dart';
import 'package:zembil/features/orders/domain/usecase/get_user_orders.dart';
import 'package:zembil/features/orders/presentation/bloc/orders_event.dart';
import 'package:zembil/features/orders/presentation/bloc/orders_state.dart';

class OrdersBloc extends Bloc<OrdersEvent, OrdersState> {
  final GetUserOrders getUserOrders;
  final GetOrderById getOrderById;
  final CancelOrder cancelOrder;

  OrdersBloc({
    required this.getUserOrders,
    required this.getOrderById,
    required this.cancelOrder,
  }) : super(OrdersInitial()) {
    on<GetUserOrdersEvent>(_onGetUserOrders);
    on<GetOrderByIdEvent>(_onGetOrderById);
    on<CancelOrderEvent>(_onCancelOrder);
    on<FilterOrdersByStatusEvent>(_onFilterOrders);
  }

  Future<void> _onGetUserOrders(
    GetUserOrdersEvent event,
    Emitter<OrdersState> emit,
  ) async {
    emit(OrdersLoading());

    final result = await getUserOrders(
      status: event.status,
      startDate: event.startDate,
      endDate: event.endDate,
    );

    result.fold(
      (failure) => emit(OrdersError(_mapFailureToMessage(failure))),
      (orders) => emit(OrdersLoaded(orders, currentFilter: event.status)),
    );
  }

  Future<void> _onGetOrderById(
    GetOrderByIdEvent event,
    Emitter<OrdersState> emit,
  ) async {
    emit(OrderDetailLoading());

    final result = await getOrderById(event.orderId);

    result.fold(
      (failure) => emit(OrdersError(_mapFailureToMessage(failure))),
      (order) => emit(OrderDetailLoaded(order)),
    );
  }

  Future<void> _onCancelOrder(
    CancelOrderEvent event,
    Emitter<OrdersState> emit,
  ) async {
    emit(OrderCanceling());

    final result = await cancelOrder(event.orderId);

    result.fold(
      (failure) => emit(OrdersError(_mapFailureToMessage(failure))),
      (order) {
        emit(OrderCanceled(order));
        // Refresh orders list
        add(GetUserOrdersEvent());
      },
    );
  }

  Future<void> _onFilterOrders(
    FilterOrdersByStatusEvent event,
    Emitter<OrdersState> emit,
  ) async {
    emit(OrdersLoading());

    final result = await getUserOrders(status: event.status);

    result.fold(
      (failure) => emit(OrdersError(_mapFailureToMessage(failure))),
      (orders) => emit(OrdersLoaded(orders, currentFilter: event.status)),
    );
  }

  String _mapFailureToMessage(Failure failure) {
    switch (failure.runtimeType) {
      case ServerFailure:
        return 'A server error occurred. Please try again later.';
      case NetworkFailure:
        return 'Please check your internet connection.';
      default:
        return 'An unexpected error occurred.';
    }
  }
}


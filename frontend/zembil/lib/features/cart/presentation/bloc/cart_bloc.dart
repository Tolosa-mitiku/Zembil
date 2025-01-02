import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/cart/domain/usecase/add_to_cart.dart';
import 'package:zembil/features/cart/domain/usecase/get_cart.dart';
import 'package:zembil/features/cart/domain/usecase/remove_from_cart.dart';
import 'package:zembil/features/cart/domain/usecase/update_cart.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_event.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_state.dart';
import 'package:zembil/features/payments/domain/usecase/initiate_stripe_payment.dart';

class CartBloc extends Bloc<CartEvent, CartState> {
  final GetCart getCart;
  final AddToCart addToCart;
  final RemoveFromCart removeFromCart;
  final UpdateCart updateCart;
  final InitiateStripePayment initiateStripePayment;

  double total = 0;

  CartBloc(
      {required this.getCart,
      required this.addToCart,
      required this.removeFromCart,
      required this.updateCart,
      required this.initiateStripePayment})
      : super(CartInitial()) {
    on<GetCartEvent>((event, emit) {
      final carts = getCart.call();
      total = 0;
      for (var cart in carts) {
        total += cart.price * cart.quantity;
      }
      emit(CartLoaded(carts, total));
    });

    on<AddToCartEvent>((event, emit) async {
      await addToCart.call(event.item);
      final carts = getCart.call();
      total = 0;
      for (var cart in carts) {
        total += cart.price * cart.quantity;
      }
      emit(CartLoaded(carts, total));
    });
    on<RemoveFromCartEvent>((event, emit) async {
      await removeFromCart.call(event.productId);
      final carts = getCart.call();
      total = 0;
      for (var cart in carts) {
        total += cart.price * cart.quantity;
      }
      emit(CartLoaded(carts, total));
    });
    on<UpdateCartEvent>((event, emit) async {
      await updateCart.call(event.productId, event.newQuantity);
      final carts = getCart.call();
      total = 0;
      for (var cart in carts) {
        total += cart.price * cart.quantity;
      }
      emit(CartLoaded(carts, total));
    });
    on<InitiateStripePaymentEvent>((event, emit) async {
      final result = initiateStripePayment.call(event.total);
      result.fold((failure) => emit(CartError(message: failure.message)),
          (_) => emit(PaymentSuccess()));
    });
  }
}

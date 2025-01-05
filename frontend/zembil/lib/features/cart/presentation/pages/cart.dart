import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_paypal_payment/flutter_paypal_payment.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/features/authentication/presentation/widgets/custom_text_field.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_bloc.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_event.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_state.dart';
import 'package:zembil/features/cart/presentation/widgets/cart_app_bar.dart';
import 'package:zembil/features/cart/presentation/widgets/cart_products.dart';
import 'package:zembil/features/cart/presentation/widgets/select_payment.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  @override
  void initState() {
    context.read<CartBloc>().add(GetCartEvent());
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: Padding(
        padding: const EdgeInsets.only(top: 50),
        child: BlocBuilder<CartBloc, CartState>(builder: (context, state) {
          if (state is CartLoaded) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Product App Bar
                CartAppBar(),

                Expanded(child: CartProducts(state.items)),

                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(20),
                      // right: Radius.circular(20),
                    ),
                    color: Colors.grey,
                  ),
                  height: 200,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        height: 5,
                        width: 75,
                        decoration: BoxDecoration(
                          color: Colors.black,
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      CustomTextField(
                          hintText: "Promo Code",
                          hintStyle: Theme.of(context).textTheme.bodyLarge,
                          errorText: null,
                          controller: null,
                          onChanged: (value) {}),
                      Padding(
                        padding: const EdgeInsets.only(top: 10.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              "${state.items.length} Items",
                              style:
                                  TextStyle(color: Colors.black, fontSize: 20),
                            ),
                            Text(
                              "\$ ${state.total.toStringAsFixed(2)}",
                              style:
                                  TextStyle(color: Colors.black, fontSize: 20),
                            ),
                          ],
                        ),
                      ),
                      // Divider(
                      //   color: Colors.black,
                      // ),
                      ElevatedButton(
                        onPressed: () {
                          print(CartEntity.toPayPalList(state.items));
                          print({
                            "total": '${state.total}',
                          });
                          showDialog(
                              context: context,
                              builder: (context) {
                                return SelectPaymentMethod(
                                  onPayPal: () {
                                    Navigator.of(context)
                                        .push(MaterialPageRoute(
                                      builder: (BuildContext context) =>
                                          PaypalCheckoutView(
                                        sandboxMode: true,
                                        clientId:
                                            dotenv.env['PAYPAL_CLIENT_ID'],
                                        secretKey:
                                            dotenv.env['PAYPAL_SECRET_KEY'],
                                        transactions: [
                                          {
                                            "amount": {
                                              // "total": '10',
                                              "total": '${state.total}',
                                              "currency": "USD",
                                              "details": {
                                                // "subtotal": '10',
                                                "subtotal": '${state.total}',
                                                "shipping": '0',
                                                "shipping_discount": 0
                                              }
                                            },
                                            "description":
                                                "The payment transaction description.",
                                            "item_list": {
                                              "items": CartEntity.toPayPalList(
                                                  state.items),
                                              // "items": [
                                              //   {
                                              //     "name": "Apple",
                                              //     "quantity": 1,
                                              //     "price": '5',
                                              //     "currency": "USD"
                                              //   },
                                              //   {
                                              //     "name": "Pineapple",
                                              //     "quantity": 1,
                                              //     "price": '5',
                                              //     "currency": "USD"
                                              //   }
                                              // ],
                                            }
                                          }
                                        ],
                                        note:
                                            "Contact us for any questions on your order.",
                                        onSuccess: (Map params) async {
                                          print("onSuccess: $params");
                                          context.pop();
                                          ScaffoldMessenger.of(context)
                                              .showSnackBar(
                                            const SnackBar(
                                                content:
                                                    Text('Payment Success')),
                                          );
                                        },
                                        onError: (error) {
                                          print("onError: $error");
                                          context.pop();
                                          ScaffoldMessenger.of(context)
                                              .showSnackBar(
                                            const SnackBar(
                                                content:
                                                    Text('Payment Failed')),
                                          );
                                        },
                                        onCancel: () {
                                          print('cancelled:');
                                          context.pop();
                                          ScaffoldMessenger.of(context)
                                              .showSnackBar(
                                            const SnackBar(
                                                content:
                                                    Text('Payment Cancelled')),
                                          );
                                        },
                                      ),
                                    ));
                                  },
                                  onStripe: () {
                                    context.read<CartBloc>().add(
                                        InitiateStripePaymentEvent(
                                            total:
                                                (state.total as num).toInt()));
                                  },
                                );
                              });
                        },
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size(double.infinity, 45),
                        ),
                        child: Text(
                          'Check Out',
                          style: Theme.of(context).textTheme.labelLarge,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            );
          } else {
            return Center(child: Text("Something went wrong"));
          }
        }),
      ),
    );
  }
}

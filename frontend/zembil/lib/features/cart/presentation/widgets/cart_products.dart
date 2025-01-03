import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_bloc.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_event.dart';
import 'package:zembil/features/cart/presentation/widgets/cart_product.dart';
import 'package:zembil/features/cart/presentation/widgets/remove_item_from_cart.dart';
import 'package:zembil/features/home/presentation/pages/product_detail.dart';

class CartProducts extends StatelessWidget {
  final List<CartEntity> cart;
  const CartProducts(this.cart, {super.key});

  @override
  Widget build(BuildContext context) {
    print(cart.length);
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 8),
      child: Expanded(
        child: ListView.builder(
          shrinkWrap: true,
          itemCount: cart.length,
          // physics:
          //     NeverScrollableScrollPhysics(), // Disables ListView scrolling
          itemBuilder: (context, index) {
            final product = cart[index];
            return GestureDetector(
              onLongPress: () {
                showDialog(
                    context: context,
                    builder: (context) {
                      return RemoveItemFromCart(
                        onConfirm: () {
                          // Perform the removal action
                          context.read<CartBloc>().add(RemoveFromCartEvent(
                              productId: product.productId));
                          Navigator.of(context).pop(); // Close the dialog
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text("Item removed from cart!")),
                          );
                        },
                        onCancel: () {
                          Navigator.of(context).pop(); // Close the dialog
                        },
                      );
                    });
              },
              onTap: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) =>
                            ProductDetailPage(product.productId)));
              },
              child: CartProduct(product),
            );
          },
        ),
      ),
    );
  }
}

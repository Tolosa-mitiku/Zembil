import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_bloc.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_event.dart';
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
              onTap: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) =>
                            ProductDetailPage(product.productId)));
              },
              child: Container(
                margin: EdgeInsets.only(bottom: 40),
                height: 100,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor,
                  borderRadius: BorderRadius.circular(12),
                  // border: Border.all(color: Colors.black),
                ),
                child: Row(
                  children: [
                    SizedBox(
                      height: 100,
                      width: 100,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(
                          product.image,
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    Container(
                      width: 230,
                      padding:
                          EdgeInsets.symmetric(vertical: 5, horizontal: 15),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(product.title,
                              overflow: TextOverflow.ellipsis,
                              maxLines: 1,
                              style: Theme.of(context).textTheme.titleLarge),
                          Row(
                            children: [
                              Container(
                                constraints: BoxConstraints(maxWidth: 90),
                                child: Text(product.category,
                                    overflow: TextOverflow.ellipsis,
                                    maxLines: 1,
                                    style:
                                        Theme.of(context).textTheme.titleSmall),
                              ),
                              SizedBox(
                                width: 10,
                              ),
                              Container(
                                height: 12,
                                width: 2,
                                decoration: BoxDecoration(
                                    color: Colors.black,
                                    borderRadius: BorderRadius.circular(15)),
                                child: VerticalDivider(
                                  color: Colors.blueGrey,
                                  thickness: 2,
                                  width: 2,
                                ),
                              ),
                              SizedBox(
                                width: 10,
                              ),
                              Container(
                                constraints: BoxConstraints(maxWidth: 85),
                                child: Text('US 12',
                                    overflow: TextOverflow.ellipsis,
                                    maxLines: 1,
                                    style:
                                        Theme.of(context).textTheme.titleSmall),
                              ),
                            ],
                          ),
                          SizedBox(
                            width: 10,
                          ),
                          Row(
                            children: [
                              Text('\$ ${product.price.toString()}',
                                  overflow: TextOverflow.ellipsis,
                                  maxLines: 1,
                                  style:
                                      Theme.of(context).textTheme.titleMedium),
                              SizedBox(
                                width: 15,
                              ),
                              Container(
                                height: 15,
                                width: 2,
                                decoration: BoxDecoration(
                                    color: Colors.black,
                                    borderRadius: BorderRadius.circular(15)),
                                child: VerticalDivider(
                                  color: Colors.blueGrey,
                                  thickness: 2,
                                  width: 2,
                                ),
                              ),
                              SizedBox(
                                width: 15,
                              ),
                              Text('US 12',
                                  overflow: TextOverflow.ellipsis,
                                  maxLines: 1,
                                  style:
                                      Theme.of(context).textTheme.titleMedium),
                            ],
                          )
                        ],
                      ),
                    ),
                    IconButton(
                        icon: Icon(Icons.remove_circle),
                        onPressed: () {
                          showDialog(
                              context: context,
                              builder: (context) {
                                return RemoveItemFromCart(
                                  onConfirm: () {
                                    // Perform the removal action
                                    context.read<CartBloc>().add(
                                        RemoveFromCartEvent(
                                            productId: product.productId));
                                    Navigator.of(context)
                                        .pop(); // Close the dialog
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                          content:
                                              Text("Item removed from cart!")),
                                    );
                                  },
                                  onCancel: () {
                                    Navigator.of(context)
                                        .pop(); // Close the dialog
                                  },
                                );
                              });
                          // showDialog(
                          //   context: context,
                          //   builder: (BuildContext context) {
                          //     return AlertDialog(
                          //       content: Center(
                          //         child: Container(
                          //             height: 300,
                          //             width: 300,
                          //             padding: EdgeInsets.all(10),
                          //             color: Colors.black,
                          //             child: Column(
                          //               children: [
                          //                 Text(
                          //                   'Remove Item?',
                          //                   style: Theme.of(context)
                          //                       .textTheme
                          //                       .bodyMedium,
                          //                 ),
                          //                 SizedBox(
                          //                   height: 5,
                          //                 ),
                          //                 Text(
                          //                     'Are you sure you want to remove this item?'),
                          //                 Row(
                          //                   children: <Widget>[
                          //                     TextButton(
                          //                       onPressed: () {
                          //                         // Navigator.of(context).pop();
                          //                       },
                          //                       child: Container(
                          //                         padding: EdgeInsets.symmetric(
                          //                             vertical: 5,
                          //                             horizontal: 15),
                          //                         decoration: BoxDecoration(
                          //                             borderRadius:
                          //                                 BorderRadius.circular(
                          //                                     5),
                          //                             border: Border.all(
                          //                                 color: Theme.of(
                          //                                         context)
                          //                                     .primaryColor)),
                          //                         child: Text(
                          //                           'No',
                          //                           style: Theme.of(context)
                          //                               .textTheme
                          //                               .bodyMedium,
                          //                         ),
                          //                       ),
                          //                     ),
                          //                     TextButton(
                          //                       onPressed: () {
                          //                         context.read<CartBloc>().add(
                          //                             RemoveFromCartEvent(
                          //                                 productId: product
                          //                                     .productId));
                          //                         // Navigator.of(context).pop();
                          //                       },
                          //                       child: Container(
                          //                         padding: EdgeInsets.symmetric(
                          //                             vertical: 5,
                          //                             horizontal: 15),
                          //                         decoration: BoxDecoration(
                          //                             borderRadius:
                          //                                 BorderRadius.circular(
                          //                                     5),
                          //                             border: Border.all(
                          //                                 color: Theme.of(
                          //                                         context)
                          //                                     .primaryColor)),
                          //                         child: Text(
                          //                           'Yes',
                          //                           style: Theme.of(context)
                          //                               .textTheme
                          //                               .bodyMedium,
                          //                         ),
                          //                       ),
                          //                     ),
                          //                   ],
                          //                 ),
                          //               ],
                          //             )),
                          //       ),
                          //     );
                          //   },
                          // );
                        }),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

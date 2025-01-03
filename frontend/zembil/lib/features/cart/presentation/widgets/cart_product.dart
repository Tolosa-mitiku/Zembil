import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/cart/domain/entity/cart.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_bloc.dart';
import 'package:zembil/features/cart/presentation/bloc/cart_event.dart';

class CartProduct extends StatelessWidget {
  final CartEntity product;

  const CartProduct(this.product, {super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 20),
      padding: EdgeInsets.symmetric(vertical: 10, horizontal: 12),
      height: 125,
      width: double.infinity,
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColor,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.black),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
            width: 220,
            padding: EdgeInsets.symmetric(vertical: 5, horizontal: 15),
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
                          style: Theme.of(context).textTheme.titleSmall),
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
                          style: Theme.of(context).textTheme.titleSmall),
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
                        style: Theme.of(context).textTheme.titleMedium),
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
                        style: Theme.of(context).textTheme.titleMedium),
                  ],
                )
              ],
            ),
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              GestureDetector(
                child: Container(
                  padding: EdgeInsets.all(3),
                  decoration: BoxDecoration(
                      color: Colors.black,
                      border: Border.all(color: Colors.black),
                      borderRadius: BorderRadius.circular(8)),
                  child: Icon(
                    Icons.add,
                    color: Theme.of(context).primaryColor,
                  ),
                ),
                onTap: () {
                  context.read<CartBloc>().add(UpdateCartEvent(
                      productId: product.productId,
                      newQuantity: product.quantity + 1));
                },
              ),
              Container(
                child: Text(
                  product.quantity.toString(),
                  style: TextStyle(
                    fontSize: 20,
                    color: Colors.black,
                  ),
                ),
              ),
              GestureDetector(
                child: Container(
                  padding: EdgeInsets.all(3),
                  decoration: BoxDecoration(
                      color: Theme.of(context).primaryColor,
                      border: Border.all(color: Colors.black),
                      borderRadius: BorderRadius.circular(8)),
                  child: Icon(Icons.remove),
                ),
                onTap: () {
                  context.read<CartBloc>().add(UpdateCartEvent(
                      productId: product.productId,
                      newQuantity:
                          product.quantity - 1 < 1 ? 1 : product.quantity - 1));
                },
              ),
            ],
          )
        ],
      ),
    );
  }
}

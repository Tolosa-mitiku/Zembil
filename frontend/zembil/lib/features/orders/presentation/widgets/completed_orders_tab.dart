import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/features/orders/presentation/bloc/orders_bloc.dart';
import 'package:zembil/features/orders/presentation/bloc/orders_state.dart';
import 'package:zembil/features/orders/presentation/widgets/order_card_redesign.dart';

class CompletedOrdersTab extends StatelessWidget {
  const CompletedOrdersTab({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final r = context.r;

    return BlocBuilder<OrdersBloc, OrdersState>(
      builder: (context, state) {
        if (state is OrdersLoading) {
          return Center(
            child: CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(
                theme.colorScheme.primary,
              ),
            ),
          );
        }

        if (state is OrdersError) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.error_outline,
                  size: r.xLargeIcon,
                  color: theme.colorScheme.error,
                ),
                SizedBox(height: r.mediumSpace),
                Text(
                  state.message,
                  style: theme.textTheme.bodyMedium,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          );
        }

        if (state is OrdersLoaded) {
          final completedOrders = state.completedOrders;

          if (completedOrders.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: EdgeInsets.all(r.xLargeSpace),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.history,
                      size: r.xLargeIcon * 1.5,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  SizedBox(height: r.largeSpace),
                  Text(
                    'No completed orders',
                    style: theme.textTheme.titleLarge,
                  ),
                  SizedBox(height: r.smallSpace),
                  Text(
                    'Your order history will appear here',
                    style: theme.textTheme.bodyMedium,
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: EdgeInsets.all(r.mediumSpace),
            itemCount: completedOrders.length,
            itemBuilder: (context, index) {
              return OrderCardRedesign(
                order: completedOrders[index],
                isActive: false,
                index: index,
              );
            },
          );
        }

        return const SizedBox.shrink();
      },
    );
  }
}


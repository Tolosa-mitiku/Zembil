import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/features/orders/presentation/bloc/orders_bloc.dart';
import 'package:zembil/features/orders/presentation/bloc/orders_event.dart';
import 'package:zembil/features/orders/presentation/bloc/orders_state.dart';
import 'package:zembil/features/orders/presentation/widgets/order_card_redesign.dart';

import 'package:zembil/features/orders/presentation/widgets/orders_shimmer.dart';

class ActiveOrdersTabRedesign extends StatefulWidget {
  const ActiveOrdersTabRedesign({super.key});

  @override
  State<ActiveOrdersTabRedesign> createState() => _ActiveOrdersTabRedesignState();
}

class _ActiveOrdersTabRedesignState extends State<ActiveOrdersTabRedesign> {
  final ScrollController _scrollController = ScrollController();
  int _currentPage = 1;
  bool _isLoadingMore = false;
  bool _hasMore = true;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      if (!_isLoadingMore && _hasMore) {
        _loadMore();
      }
    }
  }

  void _loadMore() {
    setState(() {
      _isLoadingMore = true;
      _currentPage++;
    });

    // Load next page of orders
    context.read<OrdersBloc>().add(
          LoadMoreOrdersEvent(page: _currentPage),
        );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return BlocBuilder<OrdersBloc, OrdersState>(
      builder: (context, state) {
        if (state is OrdersLoading && _currentPage == 1) {
          return const OrdersShimmer();
        }

        if (state is OrdersError && _currentPage == 1) {
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
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: r.largeSpace),
                  child: Text(
                    state.message,
                    style: theme.textTheme.bodyMedium,
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          );
        }

        if (state is OrdersLoaded) {
          final activeOrders = state.activeOrders;

          // Update pagination state
          if (state is OrdersLoaded) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (mounted) {
                setState(() {
                  _isLoadingMore = false;
                  // You would get hasMore from backend response
                  // _hasMore = state.hasMore;
                });
              }
            });
          }

          if (activeOrders.isEmpty) {
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
                      Icons.local_shipping_outlined,
                      size: r.xLargeIcon * 1.5,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  SizedBox(height: r.largeSpace),
                  Text(
                    'No active orders',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: r.smallSpace),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: r.xLargeSpace),
                    child: Text(
                      'Your current orders will appear here',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.textTheme.bodySmall?.color,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              setState(() {
                _currentPage = 1;
                _hasMore = true;
              });
              context.read<OrdersBloc>().add(GetUserOrdersEvent());
            },
            child: ListView.builder(
              controller: _scrollController,
              padding: EdgeInsets.all(r.mediumSpace),
              itemCount: activeOrders.length + (_hasMore ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == activeOrders.length) {
                  // Loading indicator at bottom
                  return Container(
                    padding: EdgeInsets.all(r.mediumSpace),
                    alignment: Alignment.center,
                    child: CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(
                        theme.colorScheme.primary,
                      ),
                    ),
                  );
                }

                return OrderCardRedesign(
                  order: activeOrders[index],
                  isActive: true,
                  index: index,
                );
              },
            ),
          );
        }

        return const SizedBox.shrink();
      },
    );
  }
}


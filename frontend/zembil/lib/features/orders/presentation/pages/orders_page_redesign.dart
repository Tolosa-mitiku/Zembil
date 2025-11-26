import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/app_text_styles.dart';
import 'package:zembil/features/orders/presentation/bloc/orders_bloc.dart';
import 'package:zembil/features/orders/presentation/bloc/orders_event.dart';
import 'package:zembil/features/orders/presentation/widgets/active_orders_tab_redesign.dart';
import 'package:zembil/features/orders/presentation/widgets/date_range_filter.dart';

import 'package:zembil/features/orders/presentation/widgets/completed_orders_tab.dart';
import 'package:zembil/injector.dart';

class OrdersPageRedesign extends StatefulWidget {
  const OrdersPageRedesign({super.key});

  @override
  State<OrdersPageRedesign> createState() => _OrdersPageRedesignState();
}

class _OrdersPageRedesignState extends State<OrdersPageRedesign>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  late OrdersBloc _ordersBloc;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _ordersBloc = locator<OrdersBloc>();
    _ordersBloc.add(GetUserOrdersEvent());
  }

  @override
  void dispose() {
    _tabController.dispose();
    _ordersBloc.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return BlocProvider.value(
      value: _ordersBloc,
      child: Scaffold(
        backgroundColor: theme.scaffoldBackgroundColor,
        body: SafeArea(
          child: Column(
            children: [
              // Header
              _buildHeader(context, theme, isDark, r),

              // Tab Bar
              _buildTabBar(theme, isDark, r),

              // Tab Content
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    const ActiveOrdersTabRedesign(),
                    const CompletedOrdersTab(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(
      BuildContext context, ThemeData theme, bool isDark, Responsive r) {
    return Padding(
      padding: EdgeInsets.fromLTRB(
          r.largeSpace, r.mediumSpace, r.largeSpace, r.mediumSpace),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'My Orders',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                ),
              ),
              SizedBox(height: r.tinySpace),
              Text(
                'Track and manage your orders',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.textTheme.bodySmall?.color?.withOpacity(0.7),
                ),
              ),
            ],
          ),
          GestureDetector(
            onTap: () => _showDateRangeFilter(context),
            child: Container(
              padding: EdgeInsets.all(r.smallSpace),
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                borderRadius: BorderRadius.circular(r.mediumRadius),
                border: Border.all(
                  color: isDark
                      ? AppColors.gold.withOpacity(0.2)
                      : AppColors.grey200,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.getShadow(isDark),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Icon(
                Icons.calendar_month_outlined,
                color: theme.iconTheme.color,
                size: r.mediumIcon,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showDateRangeFilter(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DateRangeFilter(
        onApply: (startDate, endDate) {
          _ordersBloc.add(GetUserOrdersEvent(
            startDate: startDate,
            endDate: endDate,
          ));
        },
      ),
    );
  }

  Widget _buildTabBar(ThemeData theme, bool isDark, Responsive r) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: r.largeSpace, vertical: r.smallSpace),
      padding: EdgeInsets.all(r.tinySpace),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkGreyCard : AppColors.grey100,
        borderRadius: BorderRadius.circular(r.largeRadius),
        border: Border.all(
          color: isDark
              ? AppColors.gold.withOpacity(0.1)
              : AppColors.grey200,
        ),
      ),
      child: TabBar(
        controller: _tabController,
        indicator: BoxDecoration(
          color: theme.colorScheme.primary,
          borderRadius: BorderRadius.circular(r.mediumRadius),
          boxShadow: [
            BoxShadow(
              color: theme.colorScheme.primary.withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        indicatorSize: TabBarIndicatorSize.tab,
        dividerColor: Colors.transparent,
        labelColor: isDark ? AppColors.darkGreyDark : Colors.white,
        unselectedLabelColor: theme.textTheme.bodyLarge?.color?.withOpacity(0.7),
        labelStyle: AppTextStyles.labelMedium.copyWith(
          fontWeight: FontWeight.w700,
        ),
        unselectedLabelStyle: AppTextStyles.labelMedium.copyWith(
          fontWeight: FontWeight.w500,
        ),
        tabs: const [
          Tab(text: 'Active Orders'),
          Tab(text: 'Order History'),
        ],
      ),
    );
  }
}


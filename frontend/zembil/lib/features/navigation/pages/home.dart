import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/home/presentation/pages/home.dart';
import 'package:zembil/features/home/presentation/pages/product_detail.dart';
import 'package:zembil/features/navigation/bloc/navigation_bloc.dart';
import 'package:zembil/features/navigation/bloc/navigation_state.dart';
import 'package:zembil/features/navigation/widgets/navigation.dart';
import 'package:zembil/features/profile/presentation/pages/profile_page.dart';

class IndexPage extends StatelessWidget {
  final List<Widget> screens = [
    HomePage(),
    ProductDetailPage("1"),
    OrdersPage(),
    SettingsPage(),
    ProfilePage(),
  ];

  IndexPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => BottomNavBloc(),
      child: Scaffold(
        body: BlocBuilder<BottomNavBloc, BottomNavState>(
          builder: (context, state) {
            return screens[state.selectedIndex];
          },
        ),
        bottomNavigationBar: BottomNavBar(),
      ),
    );
  }
}

// class HomePage extends StatelessWidget {
//   const HomePage({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Center(
//         child: Text(
//       'Home Page',
//       style: TextStyle(color: Colors.red),
//     ));
//   }
// }

class CartPage extends StatelessWidget {
  const CartPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
        child: Text(
      'Cart Page',
      style: TextStyle(color: Colors.red),
    ));
  }
}

class OrdersPage extends StatelessWidget {
  const OrdersPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(child: Text('Orders Page'));
  }
}

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(child: Text('Settings Page'));
  }
}

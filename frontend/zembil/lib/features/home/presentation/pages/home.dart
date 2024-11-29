import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_event.dart';
import 'package:zembil/features/home/presentation/widgets/category.dart';
import 'package:zembil/features/home/presentation/widgets/feature.dart';
import 'package:zembil/features/home/presentation/widgets/product.dart';
import 'package:zembil/features/home/presentation/widgets/search.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  void initState() {
    context.read<ProductBloc>().add(GetProductsEvent());
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 35),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 40),
              Search(),

              SizedBox(height: 30),
              Features(),
              SizedBox(height: 30),

              Category(),

              // Products Section
              Products(),
            ],
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';

import 'package:zembil/features/settings/presentation/pages/add_address_page.dart';

class ShippingAddressesPage extends StatefulWidget {
  const ShippingAddressesPage({super.key});

  @override
  State<ShippingAddressesPage> createState() => _ShippingAddressesPageState();
}

class _ShippingAddressesPageState extends State<ShippingAddressesPage> {
  final List<Map<String, dynamic>> _addresses = [
    {
      'id': '1',
      'name': 'Home',
      'address': '123 Main Street, Apt 4B',
      'city': 'Addis Ababa',
      'phone': '+251 911 234 567',
      'isDefault': true,
      'icon': Icons.home_rounded,
      'color': Colors.blue,
    },
    {
      'id': '2',
      'name': 'Office',
      'address': 'Bole Road, Building A',
      'city': 'Addis Ababa',
      'phone': '+251 922 345 678',
      'isDefault': false,
      'icon': Icons.work_rounded,
      'color': Colors.orange,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'Shipping Addresses',
          style:
              theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: Container(
            padding: EdgeInsets.all(r.tinySpace),
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              shape: BoxShape.circle,
              border: Border.all(
                color: isDark
                    ? AppColors.gold.withOpacity(0.2)
                    : AppColors.grey200,
              ),
            ),
            child: Icon(Icons.arrow_back_ios_new,
                size: 18, color: theme.iconTheme.color),
          ),
          onPressed: () => context.pop(),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final newAddress = await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddAddressPage()),
          );

          if (newAddress != null) {
            setState(() {
              if (newAddress['isDefault'] == true) {
                for (var a in _addresses) {
                  a['isDefault'] = false;
                }
              }
              _addresses.add(newAddress);
            });
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: const Text('Address added successfully'),
                backgroundColor: AppColors.success,
                behavior: SnackBarBehavior.floating,
              ),
            );
          }
        },
        backgroundColor: theme.colorScheme.primary,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Add New Address',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: ListView.builder(
        padding: EdgeInsets.all(r.largeSpace),
        itemCount: _addresses.length,
        itemBuilder: (context, index) {
          final address = _addresses[index];
          return Dismissible(
            key: Key(address['id']),
            background: Container(
              margin: EdgeInsets.only(bottom: r.mediumSpace),
              decoration: BoxDecoration(
                color: theme.colorScheme.error,
                borderRadius: BorderRadius.circular(r.mediumRadius),
              ),
              alignment: Alignment.centerRight,
              padding: EdgeInsets.only(right: r.largeSpace),
              child: const Icon(Icons.delete_outline,
                  color: Colors.white, size: 32),
            ),
            direction: DismissDirection.endToStart,
            onDismissed: (direction) {
              setState(() {
                _addresses.removeAt(index);
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('${address['name']} removed')),
              );
            },
            child: Container(
              margin: EdgeInsets.only(bottom: r.mediumSpace),
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                borderRadius: BorderRadius.circular(r.mediumRadius),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.getShadow(isDark),
                    blurRadius: 15,
                    offset: const Offset(0, 5),
                  ),
                ],
                border: address['isDefault']
                    ? Border.all(color: theme.colorScheme.primary, width: 1.5)
                    : null,
              ),
              child: ListTile(
                contentPadding: EdgeInsets.all(r.mediumSpace),
                leading: Container(
                  padding: EdgeInsets.all(r.smallSpace),
                  decoration: BoxDecoration(
                    color: (address['color'] as Color).withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    address['icon'],
                    color: address['color'],
                    size: r.largeIcon,
                  ),
                ),
                title: Row(
                  children: [
                    Text(
                      address['name'],
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (address['isDefault']) ...[
                      SizedBox(width: r.smallSpace),
                      Container(
                        padding: EdgeInsets.symmetric(
                          horizontal: r.smallSpace,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(r.smallRadius),
                        ),
                        child: Text(
                          'Default',
                          style: TextStyle(
                            fontSize: 10,
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(height: r.tinySpace),
                    Text(
                      address['address'],
                      style: theme.textTheme.bodyMedium,
                    ),
                    Text(
                      address['city'],
                      style: theme.textTheme.bodySmall,
                    ),
                  ],
                ),
                trailing: Radio<bool>(
                  value: true,
                  groupValue: address['isDefault'],
                  onChanged: (value) {
                    setState(() {
                      for (var a in _addresses) {
                        a['isDefault'] = false;
                      }
                      address['isDefault'] = true;
                    });
                  },
                  activeColor: theme.colorScheme.primary,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

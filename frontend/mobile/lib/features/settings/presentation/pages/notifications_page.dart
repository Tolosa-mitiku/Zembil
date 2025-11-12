import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  bool _pushEnabled = true;
  bool _emailEnabled = true;
  bool _orderUpdates = true;
  bool _promos = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'Notifications',
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
      body: ListView(
        padding: EdgeInsets.all(r.largeSpace),
        children: [
          _buildSectionHeader('General', theme, r),
          _buildSwitchTile(
            'Push Notifications',
            'Receive push notifications on your device',
            _pushEnabled,
            (val) => setState(() => _pushEnabled = val),
            theme,
            r,
          ),
          _buildSwitchTile(
            'Email Notifications',
            'Receive email updates about your account',
            _emailEnabled,
            (val) => setState(() => _emailEnabled = val),
            theme,
            r,
          ),
          SizedBox(height: r.largeSpace),
          _buildSectionHeader('Orders & Activity', theme, r),
          _buildSwitchTile(
            'Order Updates',
            'Get notified about order status changes',
            _orderUpdates,
            (val) => setState(() => _orderUpdates = val),
            theme,
            r,
          ),
          _buildSwitchTile(
            'Promotions & Deals',
            'Receive special offers and discounts',
            _promos,
            (val) => setState(() => _promos = val),
            theme,
            r,
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, ThemeData theme, Responsive r) {
    return Padding(
      padding: EdgeInsets.only(bottom: r.mediumSpace, top: r.smallSpace),
      child: Text(
        title,
        style: theme.textTheme.titleMedium?.copyWith(
          fontWeight: FontWeight.bold,
          color: theme.colorScheme.primary,
        ),
      ),
    );
  }

  Widget _buildSwitchTile(
    String title,
    String subtitle,
    bool value,
    ValueChanged<bool> onChanged,
    ThemeData theme,
    Responsive r,
  ) {
    return Container(
      margin: EdgeInsets.only(bottom: r.mediumSpace),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(r.mediumRadius),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: SwitchListTile(
        value: value,
        onChanged: onChanged,
        activeColor: theme.colorScheme.primary,
        title: Text(
          title,
          style:
              theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600),
        ),
        subtitle: Text(
          subtitle,
          style: theme.textTheme.bodySmall,
        ),
        contentPadding: EdgeInsets.symmetric(
          horizontal: r.mediumSpace,
          vertical: r.smallSpace,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(r.mediumRadius),
        ),
      ),
    );
  }
}

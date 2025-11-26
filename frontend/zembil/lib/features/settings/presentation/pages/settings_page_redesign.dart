import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/features/authentication/presentation/bloc/auth_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/auth_event.dart';
import 'package:zembil/features/settings/presentation/pages/about_page.dart';
import 'package:zembil/features/settings/presentation/pages/appearance_page.dart';
import 'package:zembil/features/settings/presentation/pages/help_support_page.dart';
import 'package:zembil/features/settings/presentation/pages/notifications_page.dart';
import 'package:zembil/features/settings/presentation/pages/privacy_security_page.dart';

class SettingsPageRedesign extends StatefulWidget {
  const SettingsPageRedesign({super.key});

  @override
  State<SettingsPageRedesign> createState() => _SettingsPageRedesignState();
}

class _SettingsPageRedesignState extends State<SettingsPageRedesign> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: CustomScrollView(
        slivers: [
          _buildHeader(theme, isDark, r),
          SliverPadding(
            padding: EdgeInsets.all(r.largeSpace),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildMenuGrid(context, theme, isDark, r),
                SizedBox(height: r.largeSpace),
                _buildLogoutButton(context, theme, r),
                SizedBox(height: r.xLargeSpace),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(ThemeData theme, bool isDark, Responsive r) {
    return SliverAppBar(
      expandedHeight: r.hp(25),
      pinned: true,
      stretch: true,
      backgroundColor: theme.scaffoldBackgroundColor,
      elevation: 0,
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    theme.colorScheme.primary,
                    theme.colorScheme.secondary,
                  ],
                ),
                borderRadius: BorderRadius.vertical(
                  bottom: Radius.circular(r.xLargeRadius),
                ),
              ),
            ),
            // Decorative Circles
            Positioned(
              top: -r.wp(20),
              right: -r.wp(20),
              child: Container(
                width: r.wp(50),
                height: r.wp(50),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(0.1),
                ),
              ),
            ),
            Positioned(
              bottom: r.wp(5),
              left: r.wp(5),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: EdgeInsets.all(r.smallSpace),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(r.mediumRadius),
                    ),
                    child: Icon(
                      Icons.settings_rounded,
                      color: Colors.white,
                      size: r.largeIcon,
                    ),
                  ),
                  SizedBox(height: r.mediumSpace),
                  Text(
                    'Settings',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: r.displaySize,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'Customize your experience',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: r.bodySize,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuGrid(
    BuildContext context,
    ThemeData theme,
    bool isDark,
    Responsive r,
  ) {
    final menuItems = [
      _MenuItem(
        title: 'Appearance',
        icon: Icons.palette_rounded,
        color: Colors.purple,
        page: const AppearancePage(),
      ),
      _MenuItem(
        title: 'Notifications',
        icon: Icons.notifications_active_rounded,
        color: Colors.orange,
        page: const NotificationsPage(),
      ),
      _MenuItem(
        title: 'Privacy & Security',
        icon: Icons.security_rounded,
        color: Colors.green,
        page: const PrivacySecurityPage(),
      ),
      _MenuItem(
        title: 'Help & Support',
        icon: Icons.help_center_rounded,
        color: Colors.blue,
        page: const HelpSupportPage(),
      ),
      _MenuItem(
        title: 'About',
        icon: Icons.info_rounded,
        color: Colors.teal,
        page: const AboutPage(),
      ),
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: r.mediumSpace,
        mainAxisSpacing: r.mediumSpace,
        childAspectRatio: 1.1,
      ),
      itemCount: menuItems.length,
      itemBuilder: (context, index) {
        final item = menuItems[index];
        return GestureDetector(
          onTap: () => Navigator.of(context).push(
            MaterialPageRoute(builder: (context) => item.page),
          ),
          child: Container(
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              borderRadius: BorderRadius.circular(r.largeRadius),
              boxShadow: [
                BoxShadow(
                  color: item.color.withOpacity(0.1),
                  blurRadius: 15,
                  offset: const Offset(0, 5),
                ),
              ],
              border: Border.all(
                color:
                    isDark ? item.color.withOpacity(0.2) : Colors.transparent,
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: EdgeInsets.all(r.mediumSpace),
                  decoration: BoxDecoration(
                    color: item.color.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    item.icon,
                    color: item.color,
                    size: r.xLargeIcon,
                  ),
                ),
                SizedBox(height: r.mediumSpace),
                Text(
                  item.title,
                  textAlign: TextAlign.center,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildLogoutButton(
      BuildContext context, ThemeData theme, Responsive r) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () => _showLogoutDialog(context, theme, r),
        style: ElevatedButton.styleFrom(
          backgroundColor: theme.colorScheme.error.withOpacity(0.1),
          foregroundColor: theme.colorScheme.error,
          elevation: 0,
          padding: EdgeInsets.symmetric(vertical: r.mediumSpace),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(r.largeRadius),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.logout_rounded, size: r.mediumIcon),
            SizedBox(width: r.smallSpace),
            Text(
              'Log Out',
              style: TextStyle(
                fontSize: r.bodySize,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showLogoutDialog(BuildContext context, ThemeData theme, Responsive r) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(r.largeRadius),
        ),
        title: Row(
          children: [
            Icon(Icons.logout_rounded, color: theme.colorScheme.error),
            SizedBox(width: r.smallSpace),
            const Text('Log Out'),
          ],
        ),
        content: const Text('Are you sure you want to log out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              context.read<AuthBloc>().add(SignOutEvent());
              context.go('/login');
            },
            child: Text(
              'Log Out',
              style: TextStyle(color: theme.colorScheme.error),
            ),
          ),
        ],
      ),
    );
  }
}

class _MenuItem {
  final String title;
  final IconData icon;
  final Color color;
  final Widget page;

  _MenuItem({
    required this.title,
    required this.icon,
    required this.color,
    required this.page,
  });
}

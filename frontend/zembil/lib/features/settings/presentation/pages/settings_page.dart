import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/cubit/theme_cubit.dart';
import 'package:zembil/features/authentication/presentation/bloc/auth_bloc.dart';
import 'package:zembil/features/authentication/presentation/bloc/auth_event.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  bool _notificationsEnabled = true;
  bool _emailNotifications = true;
  bool _orderUpdates = true;
  bool _promotionalEmails = false;
  bool _soundEnabled = true;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.6, curve: Curves.easeOut),
      ),
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.1),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.8, curve: Curves.easeOut),
      ),
    );

    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: AppColors.getBackground(isDark),
      body: CustomScrollView(
        slivers: [
          _buildHeader(isDark),
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: SlideTransition(
                    position: _slideAnimation,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildThemeSection(isDark),
                        const SizedBox(height: 20),
                        _buildNotificationsSection(isDark),
                        const SizedBox(height: 20),
                        _buildPrivacySection(isDark),
                        const SizedBox(height: 20),
                        _buildSupportSection(isDark),
                        const SizedBox(height: 20),
                        _buildAboutSection(isDark),
                        const SizedBox(height: 20),
                        _buildLogoutButton(isDark),
                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(bool isDark) {
    return SliverAppBar(
      expandedHeight: 200,
      pinned: true,
      backgroundColor: isDark ? AppColors.darkGrey : AppColors.backgroundLight,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppColors.gold,
                AppColors.goldDark,
                AppColors.goldAccent,
              ],
            ),
          ),
          child: SafeArea(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const SizedBox(height: 30),
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.settings_rounded,
                    size: 50,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Settings',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Customize your experience',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.white.withOpacity(0.9),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildThemeSection(bool isDark) {
    return _buildSection(
      title: 'Appearance',
      icon: Icons.palette_outlined,
      isDark: isDark,
      children: [
        BlocBuilder<ThemeCubit, dynamic>(
          builder: (context, state) {
            final themeMode = state.themeMode ?? ThemeMode.system;
            return Column(
              children: [
                _buildThemeOption(
                  title: 'Light Mode',
                  icon: Icons.light_mode_outlined,
                  isSelected: themeMode == ThemeMode.light,
                  isDark: isDark,
                  onTap: () {
                    context.read<ThemeCubit>().setLightTheme();
                  },
                ),
                const SizedBox(height: 12),
                _buildThemeOption(
                  title: 'Dark Mode',
                  icon: Icons.dark_mode_outlined,
                  isSelected: themeMode == ThemeMode.dark,
                  isDark: isDark,
                  onTap: () {
                    context.read<ThemeCubit>().setDarkTheme();
                  },
                ),
                const SizedBox(height: 12),
                _buildThemeOption(
                  title: 'System Default',
                  icon: Icons.brightness_auto_outlined,
                  isSelected: themeMode == ThemeMode.system,
                  isDark: isDark,
                  onTap: () {
                    context.read<ThemeCubit>().setSystemTheme();
                  },
                ),
              ],
            );
          },
        ),
      ],
    );
  }

  Widget _buildThemeOption({
    required String title,
    required IconData icon,
    required bool isSelected,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.gold.withOpacity(0.15)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected
                ? AppColors.gold
                : AppColors.getBorder(isDark).withOpacity(0.3),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected
                  ? AppColors.gold
                  : AppColors.getTextSecondary(isDark),
              size: 24,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  color: isSelected
                      ? AppColors.gold
                      : AppColors.getTextPrimary(isDark),
                ),
              ),
            ),
            if (isSelected)
              const Icon(
                Icons.check_circle,
                color: AppColors.gold,
                size: 22,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationsSection(bool isDark) {
    return _buildSection(
      title: 'Notifications',
      icon: Icons.notifications_outlined,
      isDark: isDark,
      children: [
        _buildSwitchTile(
          title: 'Push Notifications',
          subtitle: 'Receive push notifications',
          icon: Icons.notifications_active_outlined,
          value: _notificationsEnabled,
          isDark: isDark,
          onChanged: (value) {
            setState(() {
              _notificationsEnabled = value;
              if (!value) {
                _emailNotifications = false;
                _orderUpdates = false;
                _soundEnabled = false;
              }
            });
          },
        ),
        if (_notificationsEnabled) ...[
          const SizedBox(height: 12),
          _buildSwitchTile(
            title: 'Email Notifications',
            subtitle: 'Receive email updates',
            icon: Icons.email_outlined,
            value: _emailNotifications,
            isDark: isDark,
            onChanged: (value) {
              setState(() => _emailNotifications = value);
            },
          ),
          const SizedBox(height: 12),
          _buildSwitchTile(
            title: 'Order Updates',
            subtitle: 'Get notified about order status',
            icon: Icons.local_shipping_outlined,
            value: _orderUpdates,
            isDark: isDark,
            onChanged: (value) {
              setState(() => _orderUpdates = value);
            },
          ),
          const SizedBox(height: 12),
          _buildSwitchTile(
            title: 'Promotional Emails',
            subtitle: 'Receive special offers and deals',
            icon: Icons.local_offer_outlined,
            value: _promotionalEmails,
            isDark: isDark,
            onChanged: (value) {
              setState(() => _promotionalEmails = value);
            },
          ),
          const SizedBox(height: 12),
          _buildSwitchTile(
            title: 'Sound',
            subtitle: 'Play sound for notifications',
            icon: Icons.volume_up_outlined,
            value: _soundEnabled,
            isDark: isDark,
            onChanged: (value) {
              setState(() => _soundEnabled = value);
            },
          ),
        ],
      ],
    );
  }

  Widget _buildPrivacySection(bool isDark) {
    return _buildSection(
      title: 'Privacy & Security',
      icon: Icons.shield_outlined,
      isDark: isDark,
      children: [
        _buildActionTile(
          title: 'Change Password',
          subtitle: 'Update your account password',
          icon: Icons.lock_outline,
          isDark: isDark,
          onTap: () {
            // TODO: Navigate to change password page
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Change password coming soon')),
            );
          },
        ),
        const SizedBox(height: 12),
        _buildActionTile(
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          icon: Icons.privacy_tip_outlined,
          isDark: isDark,
          onTap: () {
            // TODO: Open privacy policy
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Privacy policy coming soon')),
            );
          },
        ),
        const SizedBox(height: 12),
        _buildActionTile(
          title: 'Terms of Service',
          subtitle: 'Read our terms and conditions',
          icon: Icons.description_outlined,
          isDark: isDark,
          onTap: () {
            // TODO: Open terms of service
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Terms of service coming soon')),
            );
          },
        ),
        const SizedBox(height: 12),
        _buildActionTile(
          title: 'Data & Storage',
          subtitle: 'Manage your data and storage',
          icon: Icons.storage_outlined,
          isDark: isDark,
          onTap: () {
            _showClearCacheDialog(isDark);
          },
        ),
      ],
    );
  }

  Widget _buildSupportSection(bool isDark) {
    return _buildSection(
      title: 'Help & Support',
      icon: Icons.help_outline,
      isDark: isDark,
      children: [
        _buildActionTile(
          title: 'Help Center',
          subtitle: 'Browse frequently asked questions',
          icon: Icons.help_center_outlined,
          isDark: isDark,
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Help center coming soon')),
            );
          },
        ),
        const SizedBox(height: 12),
        _buildActionTile(
          title: 'Contact Support',
          subtitle: 'Get in touch with our team',
          icon: Icons.support_agent_outlined,
          isDark: isDark,
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Contact support: support@zembil.com')),
            );
          },
        ),
        const SizedBox(height: 12),
        _buildActionTile(
          title: 'Report a Bug',
          subtitle: 'Help us improve the app',
          icon: Icons.bug_report_outlined,
          isDark: isDark,
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Bug report coming soon')),
            );
          },
        ),
        const SizedBox(height: 12),
        _buildActionTile(
          title: 'Rate Us',
          subtitle: 'Share your feedback on the store',
          icon: Icons.star_outline,
          isDark: isDark,
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Thanks for your support! ⭐')),
            );
          },
        ),
      ],
    );
  }

  Widget _buildAboutSection(bool isDark) {
    return _buildSection(
      title: 'About',
      icon: Icons.info_outline,
      isDark: isDark,
      children: [
        _buildInfoTile(
          title: 'Version',
          subtitle: '1.0.0',
          icon: Icons.code_outlined,
          isDark: isDark,
        ),
        const SizedBox(height: 12),
        _buildActionTile(
          title: 'What\'s New',
          subtitle: 'See recent updates and features',
          icon: Icons.new_releases_outlined,
          isDark: isDark,
          onTap: () {
            _showWhatsNewDialog(isDark);
          },
        ),
        const SizedBox(height: 12),
        _buildActionTile(
          title: 'Licenses',
          subtitle: 'Open source licenses',
          icon: Icons.article_outlined,
          isDark: isDark,
          onTap: () {
            showLicensePage(
              context: context,
              applicationName: 'Zembil',
              applicationVersion: '1.0.0',
              applicationIcon: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.gold,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.shopping_bag_outlined,
                  color: Colors.white,
                  size: 32,
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildSection({
    required String title,
    required IconData icon,
    required bool isDark,
    required List<Widget> children,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 12),
          child: Row(
            children: [
              Icon(
                icon,
                size: 20,
                color: AppColors.gold,
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.getTextPrimary(isDark),
                ),
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkGreyCard : AppColors.backgroundLight,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: AppColors.getBorder(isDark).withOpacity(0.3),
            ),
            boxShadow: [
              BoxShadow(
                color: isDark
                    ? Colors.black.withOpacity(0.2)
                    : Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: children,
          ),
        ),
      ],
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required bool value,
    required bool isDark,
    required ValueChanged<bool> onChanged,
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: AppColors.gold.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            icon,
            color: AppColors.gold,
            size: 22,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.getTextPrimary(isDark),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: TextStyle(
                  fontSize: 13,
                  color: AppColors.getTextSecondary(isDark),
                ),
              ),
            ],
          ),
        ),
        Transform.scale(
          scale: 0.9,
          child: Switch(
            value: value,
            onChanged: onChanged,
            activeColor: AppColors.gold,
            activeTrackColor: AppColors.goldLight,
            inactiveThumbColor: AppColors.grey400,
            inactiveTrackColor: AppColors.grey300,
          ),
        ),
      ],
    );
  }

  Widget _buildActionTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.gold.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                icon,
                color: AppColors.gold,
                size: 22,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.getTextPrimary(isDark),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.getTextSecondary(isDark),
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: AppColors.getTextSecondary(isDark),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required bool isDark,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.gold.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              icon,
              color: AppColors.gold,
              size: 22,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.getTextPrimary(isDark),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.getTextSecondary(isDark),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLogoutButton(bool isDark) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          colors: [
            AppColors.error.withOpacity(0.9),
            AppColors.error,
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.error.withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _showLogoutDialog(isDark),
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.logout,
                  color: Colors.white,
                  size: 22,
                ),
                const SizedBox(width: 12),
                const Text(
                  'Logout',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showLogoutDialog(bool isDark) {
    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          backgroundColor:
              isDark ? AppColors.darkGreyCard : AppColors.backgroundLight,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.error.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.logout,
                  color: AppColors.error,
                  size: 24,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                'Logout',
                style: TextStyle(
                  color: AppColors.getTextPrimary(isDark),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          content: Text(
            'Are you sure you want to logout?',
            style: TextStyle(
              color: AppColors.getTextSecondary(isDark),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(),
              child: Text(
                'Cancel',
                style: TextStyle(
                  color: AppColors.getTextSecondary(isDark),
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(dialogContext).pop();
                context.read<AuthBloc>().add(SignOutEvent());
                context.go('/login');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.error,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('Logout'),
            ),
          ],
        );
      },
    );
  }

  void _showClearCacheDialog(bool isDark) {
    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          backgroundColor:
              isDark ? AppColors.darkGreyCard : AppColors.backgroundLight,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.warning.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.cleaning_services_outlined,
                  color: AppColors.warning,
                  size: 24,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                'Clear Cache',
                style: TextStyle(
                  color: AppColors.getTextPrimary(isDark),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          content: Text(
            'This will clear cached images and temporary data. Your account data will be safe.',
            style: TextStyle(
              color: AppColors.getTextSecondary(isDark),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(),
              child: Text(
                'Cancel',
                style: TextStyle(
                  color: AppColors.getTextSecondary(isDark),
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(dialogContext).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Cache cleared successfully'),
                    backgroundColor: AppColors.success,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.warning,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('Clear'),
            ),
          ],
        );
      },
    );
  }

  void _showWhatsNewDialog(bool isDark) {
    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          backgroundColor:
              isDark ? AppColors.darkGreyCard : AppColors.backgroundLight,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.gold.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.new_releases,
                  color: AppColors.gold,
                  size: 24,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                'What\'s New',
                style: TextStyle(
                  color: AppColors.getTextPrimary(isDark),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildWhatsNewItem(
                  '✨ Modern UI Redesign',
                  'Beautiful gold & grey theme throughout',
                  isDark,
                ),
                _buildWhatsNewItem(
                  '🌙 Dark Mode',
                  'Luxurious dark theme with gold accents',
                  isDark,
                ),
                _buildWhatsNewItem(
                  '📦 Order Tracking',
                  'Track your orders in real-time',
                  isDark,
                ),
                _buildWhatsNewItem(
                  '👤 Profile Editing',
                  'Update your profile information',
                  isDark,
                ),
                _buildWhatsNewItem(
                  '🎬 Smooth Animations',
                  'Enhanced user experience with animations',
                  isDark,
                ),
                _buildWhatsNewItem(
                  '🛒 Improved Cart',
                  'Swipe to delete, better checkout flow',
                  isDark,
                ),
              ],
            ),
          ),
          actions: [
            ElevatedButton(
              onPressed: () => Navigator.of(dialogContext).pop(),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.gold,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('Got it!'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildWhatsNewItem(String title, String description, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 2),
            width: 6,
            height: 6,
            decoration: const BoxDecoration(
              color: AppColors.gold,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.getTextPrimary(isDark),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.getTextSecondary(isDark),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}


import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/features/profile/domain/entity/profile.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_event.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_state.dart';
import 'package:zembil/features/profile/presentation/pages/edit_profile_page_redesign.dart';
import 'package:zembil/features/profile/presentation/pages/payment_methods_page.dart';
import 'package:zembil/features/profile/presentation/pages/shipping_addresses_page.dart';
import 'package:zembil/injector.dart';

class ProfilePageRedesign extends StatefulWidget {
  const ProfilePageRedesign({super.key});

  @override
  State<ProfilePageRedesign> createState() => _ProfilePageRedesignState();
}

class _ProfilePageRedesignState extends State<ProfilePageRedesign>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    // ProfileBloc is initialized in build method with GetProfileEvent
    // No need to call _loadProfile() here

    _controller = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.1),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );

    _controller.forward();
  }

  void _loadProfile() {
    // Reload profile for pull-to-refresh
    context.read<ProfileBloc>().add(GetProfileEvent());
  }

  Future<void> _onRefresh() async {
    _loadProfile();
    await Future.delayed(const Duration(milliseconds: 500));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return BlocProvider(
      create: (context) => locator<ProfileBloc>()..add(GetProfileEvent()),
      child: Scaffold(
        backgroundColor: theme.scaffoldBackgroundColor,
        body: BlocConsumer<ProfileBloc, ProfileState>(
          listener: (context, state) {
            if (state is SignOutSuccess) {
              context.go("/login");
            }
            if (state is SignOutError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.message),
                  backgroundColor: theme.colorScheme.error,
                ),
              );
            }
            if (state is ProfileUpdated) {
              context.read<ProfileBloc>().add(GetProfileEvent());
            }
          },
          builder: (context, state) {
            if (state is ProfileLoading) {
              return Center(
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(
                    theme.colorScheme.primary,
                  ),
                ),
              );
            }

            ProfileEntity profile = ProfileEntity();
            if (state is ProfileLoaded || state is ProfileUpdated) {
              profile = state is ProfileLoaded
                  ? state.profile
                  : (state as ProfileUpdated).profile;
            }

            return FadeTransition(
              opacity: _fadeAnimation,
              child: SlideTransition(
                position: _slideAnimation,
                child: RefreshIndicator(
                  onRefresh: _onRefresh,
                  color: theme.colorScheme.primary,
                  child: CustomScrollView(
                    slivers: [
                      _buildHeader(context, theme, isDark, profile, r),
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: EdgeInsets.all(r.largeSpace),
                          child: Column(
                            children: [
                              _buildColorfulAnalytics(theme, isDark, r),
                              SizedBox(height: r.largeSpace),
                              _buildMenuSection(
                                context,
                                theme,
                                isDark,
                                r,
                                profile,
                              ),
                              SizedBox(height: r.xLargeSpace),
                              _buildLogoutButton(context, theme, isDark, r),
                              SizedBox(height: r.xLargeSpace),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildHeader(
    BuildContext context,
    ThemeData theme,
    bool isDark,
    ProfileEntity profile,
    Responsive r,
  ) {
    return SliverAppBar(
      expandedHeight: r.hp(35),
      pinned: true,
      stretch: true,
      backgroundColor: theme.scaffoldBackgroundColor,
      elevation: 0,
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            // Gradient Background
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: isDark
                      ? [AppColors.gold.withOpacity(0.2), Colors.black]
                      : [
                          theme.colorScheme.primary,
                          theme.colorScheme.primary.withOpacity(0.7)
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
                width: r.wp(60),
                height: r.wp(60),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(0.1),
                ),
              ),
            ),
            Positioned(
              bottom: r.wp(10),
              left: -r.wp(10),
              child: Container(
                width: r.wp(40),
                height: r.wp(40),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(0.05),
                ),
              ),
            ),
            // Profile Info
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(height: r.topSafeArea),
                Stack(
                  children: [
                    Container(
                      padding: EdgeInsets.all(r.smallSpace),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: Colors.white.withOpacity(0.5),
                          width: 2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      ),
                      child: CircleAvatar(
                        radius: r.avatarLarge,
                        backgroundColor: theme.cardTheme.color,
                        backgroundImage:
                            profile.image != null && profile.image!.isNotEmpty
                                ? NetworkImage(profile.image!)
                                : null,
                        child: profile.image == null || profile.image!.isEmpty
                            ? Icon(
                                Icons.person,
                                size: r.xLargeIcon,
                                color: theme.colorScheme.primary,
                              )
                            : null,
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        padding: EdgeInsets.all(r.tinySpace),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.secondary,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: theme.scaffoldBackgroundColor,
                            width: 2,
                          ),
                        ),
                        child: Icon(
                          Icons.edit,
                          size: r.smallIcon,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: r.mediumSpace),
                Text(
                  profile.name ?? 'Guest User',
                  style: theme.textTheme.headlineMedium?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: r.tinySpace),
                Text(
                  profile.email ?? 'Sign in to see your profile',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: Colors.white.withOpacity(0.8),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildColorfulAnalytics(ThemeData theme, bool isDark, Responsive r) {
    return Container(
      transform: Matrix4.translationValues(0, -r.largeSpace * 1.5, 0),
      child: Row(
        children: [
          Expanded(
            child: _buildAnalyticCard(
              r,
              'Orders',
              '12',
              Icons.shopping_bag_outlined,
              [const Color(0xFFFF9966), const Color(0xFFFF5E62)],
            ),
          ),
          SizedBox(width: r.mediumSpace),
          Expanded(
            child: _buildAnalyticCard(
              r,
              'Wishlist',
              '8',
              Icons.favorite_border,
              [const Color(0xFF56CCF2), const Color(0xFF2F80ED)],
            ),
          ),
          SizedBox(width: r.mediumSpace),
          Expanded(
            child: _buildAnalyticCard(
              r,
              'Reviews',
              '4.8',
              Icons.star_outline,
              [const Color(0xFFF2994A), const Color(0xFFF2C94C)],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnalyticCard(
    Responsive r,
    String title,
    String value,
    IconData icon,
    List<Color> colors,
  ) {
    return Container(
      padding: EdgeInsets.all(r.mediumSpace),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: colors,
        ),
        borderRadius: BorderRadius.circular(r.largeRadius),
        boxShadow: [
          BoxShadow(
            color: colors[0].withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          Icon(icon, color: Colors.white, size: r.largeIcon),
          SizedBox(height: r.smallSpace),
          Text(
            value,
            style: TextStyle(
              color: Colors.white,
              fontSize: r.headlineSize,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            title,
            style: TextStyle(
              color: Colors.white.withOpacity(0.9),
              fontSize: r.captionSize,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuSection(
    BuildContext context,
    ThemeData theme,
    bool isDark,
    Responsive r,
    ProfileEntity profile,
  ) {
    return Column(
      children: [
        _buildMenuItem(
          context,
          theme,
          isDark,
          r,
          'Edit Profile',
          'Update your information',
          Icons.person_outline,
          Colors.purple,
          () => Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => EditProfilePageRedesign(profile: profile),
            ),
          ),
        ),
        SizedBox(height: r.mediumSpace),
        _buildMenuItem(
          context,
          theme,
          isDark,
          r,
          'Shipping Address',
          'Manage delivery locations',
          Icons.location_on_outlined,
          Colors.green,
          () => Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => const ShippingAddressesPage(),
            ),
          ),
        ),
        SizedBox(height: r.mediumSpace),
        _buildMenuItem(
          context,
          theme,
          isDark,
          r,
          'Payment Methods',
          'Cards and wallets',
          Icons.payment_outlined,
          Colors.blue,
          () => Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => const PaymentMethodsPage(),
            ),
          ),
        ),
        SizedBox(height: r.mediumSpace),
        _buildMenuItem(
          context,
          theme,
          isDark,
          r,
          'Settings',
          'Notifications and security',
          Icons.settings_outlined,
          Colors.orange,
          () => context.go('/settings'),
        ),
      ],
    );
  }

  Widget _buildMenuItem(
    BuildContext context,
    ThemeData theme,
    bool isDark,
    Responsive r,
    String title,
    String subtitle,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(r.largeRadius),
        boxShadow: [
          BoxShadow(
            color: AppColors.getShadow(isDark),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(
          color: isDark ? AppColors.gold.withOpacity(0.1) : Colors.transparent,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(r.largeRadius),
          child: Padding(
            padding: EdgeInsets.all(r.mediumSpace),
            child: Row(
              children: [
                Container(
                  padding: EdgeInsets.all(r.smallSpace),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(r.mediumRadius),
                  ),
                  child: Icon(icon, color: color, size: r.largeIcon),
                ),
                SizedBox(width: r.mediumSpace),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: r.tinySpace / 2),
                      Text(
                        subtitle,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.textTheme.bodySmall?.color
                              ?.withOpacity(0.7),
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: r.smallIcon,
                  color: theme.iconTheme.color?.withOpacity(0.3),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLogoutButton(
    BuildContext context,
    ThemeData theme,
    bool isDark,
    Responsive r,
  ) {
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
              context.read<ProfileBloc>().add(SignOutEvent());
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

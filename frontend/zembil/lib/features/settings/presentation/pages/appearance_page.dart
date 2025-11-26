import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/cubit/theme_cubit.dart';
import 'package:zembil/core/theme/cubit/theme_state.dart';

class AppearancePage extends StatelessWidget {
  const AppearancePage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'Appearance',
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
      body: SingleChildScrollView(
        padding: EdgeInsets.all(r.largeSpace),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Theme Mode',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.primary,
              ),
            ),
            SizedBox(height: r.mediumSpace),
            BlocBuilder<ThemeCubit, ThemeState>(
              builder: (context, state) {
                return Column(
                  children: [
                    _buildThemeOption(
                      context,
                      title: 'Light Mode',
                      description: 'Classic light theme with gold accents',
                      icon: Icons.light_mode_rounded,
                      isSelected: state.mode == AppThemeMode.light,
                      color: Colors.orange,
                      onTap: () => context
                          .read<ThemeCubit>()
                          .setTheme(AppThemeMode.light),
                      r: r,
                      theme: theme,
                    ),
                    SizedBox(height: r.mediumSpace),
                    _buildThemeOption(
                      context,
                      title: 'Dark Mode',
                      description: 'Elegant dark theme with gold accents',
                      icon: Icons.dark_mode_rounded,
                      isSelected: state.mode == AppThemeMode.dark,
                      color: Colors.purple,
                      onTap: () => context
                          .read<ThemeCubit>()
                          .setTheme(AppThemeMode.dark),
                      r: r,
                      theme: theme,
                    ),
                    SizedBox(height: r.mediumSpace),
                    _buildThemeOption(
                      context,
                      title: 'Ocean Blue',
                      description: 'Calming blue tones for a fresh look',
                      icon: Icons.water_drop_rounded,
                      isSelected: state.mode == AppThemeMode.blue,
                      color: AppColors.bluePrimary,
                      onTap: () => context
                          .read<ThemeCubit>()
                          .setTheme(AppThemeMode.blue),
                      r: r,
                      theme: theme,
                    ),
                    SizedBox(height: r.mediumSpace),
                    _buildThemeOption(
                      context,
                      title: 'Crimson Red',
                      description: 'Bold red theme for high energy',
                      icon: Icons.local_fire_department_rounded,
                      isSelected: state.mode == AppThemeMode.red,
                      color: AppColors.redPrimary,
                      onTap: () =>
                          context.read<ThemeCubit>().setTheme(AppThemeMode.red),
                      r: r,
                      theme: theme,
                    ),
                    SizedBox(height: r.mediumSpace),
                    _buildThemeOption(
                      context,
                      title: 'System Default',
                      description: 'Match your device system settings',
                      icon: Icons.settings_system_daydream_rounded,
                      isSelected: state.mode == AppThemeMode.system,
                      color: Colors.grey,
                      onTap: () => context
                          .read<ThemeCubit>()
                          .setTheme(AppThemeMode.system),
                      r: r,
                      theme: theme,
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildThemeOption(
    BuildContext context, {
    required String title,
    required String description,
    required IconData icon,
    required bool isSelected,
    required Color color,
    required VoidCallback onTap,
    required Responsive r,
    required ThemeData theme,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: EdgeInsets.all(r.mediumSpace),
        decoration: BoxDecoration(
          color: theme.cardTheme.color,
          borderRadius: BorderRadius.circular(r.mediumRadius),
          border: Border.all(
            color: isSelected ? color : theme.dividerColor.withOpacity(0.5),
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: color.withOpacity(0.2),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  )
                ]
              : [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  )
                ],
        ),
        child: Row(
          children: [
            Container(
              padding: EdgeInsets.all(r.smallSpace),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
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
                      color: isSelected
                          ? color
                          : theme.textTheme.titleMedium?.color,
                    ),
                  ),
                  SizedBox(height: r.tinySpace / 2),
                  Text(
                    description,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.textTheme.bodySmall?.color?.withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            ),
            if (isSelected)
              Icon(Icons.check_circle_rounded, color: color, size: r.largeIcon),
          ],
        ),
      ),
    );
  }
}

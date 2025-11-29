import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';

class AboutPage extends StatelessWidget {
  const AboutPage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'About',
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
          children: [
            Container(
              padding: EdgeInsets.all(r.largeSpace),
              decoration: BoxDecoration(
                color: theme.cardTheme.color,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: theme.colorScheme.primary.withOpacity(0.2),
                    blurRadius: 30,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: Icon(
                Icons.shopping_bag_rounded,
                size: r.xxLargeIcon * 1.5,
                color: theme.colorScheme.primary,
              ),
            ),
            SizedBox(height: r.largeSpace),
            Text(
              'Zembil',
              style: theme.textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.primary,
              ),
            ),
            SizedBox(height: r.smallSpace),
            Text(
              'Version 1.0.0',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.textTheme.bodySmall?.color,
              ),
            ),
            SizedBox(height: r.xLargeSpace),
            _buildInfoCard(
              'Our Mission',
              'To provide the best shopping experience with a modern, easy-to-use app.',
              Icons.lightbulb_outline_rounded,
              Colors.amber,
              theme,
              r,
            ),
            SizedBox(height: r.mediumSpace),
            _buildInfoCard(
              'Developed By',
              'Toli Gemechu',
              Icons.code_rounded,
              Colors.blue,
              theme,
              r,
            ),
            SizedBox(height: r.xLargeSpace),
            Text(
              '© 2024 Zembil Inc. All rights reserved.',
              style: theme.textTheme.bodySmall?.copyWith(
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(
    String title,
    String content,
    IconData icon,
    Color color,
    ThemeData theme,
    Responsive r,
  ) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(r.largeSpace),
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
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1.5,
        ),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: r.xLargeIcon),
          SizedBox(height: r.mediumSpace),
          Text(
            title,
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: r.smallSpace),
          Text(
            content,
            textAlign: TextAlign.center,
            style: theme.textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';

class HelpSupportPage extends StatelessWidget {
  const HelpSupportPage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'Help & Support',
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
          _buildContactCard(theme, r),
          SizedBox(height: r.largeSpace),
          Text(
            'FAQ',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.primary,
            ),
          ),
          SizedBox(height: r.mediumSpace),
          _buildFaqItem(
            'How do I track my order?',
            'You can track your order in the "Orders" tab. Click on any active order to see detailed tracking information.',
            theme,
            r,
          ),
          _buildFaqItem(
            'How do I return an item?',
            'Go to "Orders", select the item you want to return, and click "Return Item". Follow the instructions provided.',
            theme,
            r,
          ),
          _buildFaqItem(
            'Do you ship internationally?',
            'Yes, we ship to over 100 countries worldwide. Shipping costs vary by location.',
            theme,
            r,
          ),
        ],
      ),
    );
  }

  Widget _buildContactCard(ThemeData theme, Responsive r) {
    return Container(
      padding: EdgeInsets.all(r.largeSpace),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            theme.colorScheme.primary,
            theme.colorScheme.secondary,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(r.mediumRadius),
        boxShadow: [
          BoxShadow(
            color: theme.colorScheme.primary.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        children: [
          Icon(Icons.support_agent_rounded,
              color: Colors.white, size: r.xxLargeIcon),
          SizedBox(height: r.mediumSpace),
          Text(
            'Need help?',
            style: TextStyle(
              color: Colors.white,
              fontSize: r.headlineSize,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: r.smallSpace),
          Text(
            'Our support team is available 24/7 to assist you.',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.white.withOpacity(0.9),
              fontSize: r.bodySize,
            ),
          ),
          SizedBox(height: r.largeSpace),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: theme.colorScheme.primary,
              padding: EdgeInsets.symmetric(
                horizontal: r.xLargeSpace,
                vertical: r.mediumSpace,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(r.largeRadius),
              ),
            ),
            child: const Text('Chat with Us'),
          ),
        ],
      ),
    );
  }

  Widget _buildFaqItem(
    String question,
    String answer,
    ThemeData theme,
    Responsive r,
  ) {
    return Container(
      margin: EdgeInsets.only(bottom: r.mediumSpace),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(r.mediumRadius),
        border: Border.all(
          color: theme.dividerColor.withOpacity(0.5),
        ),
      ),
      child: Theme(
        data: theme.copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          title: Text(
            question,
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          childrenPadding: EdgeInsets.fromLTRB(
            r.mediumSpace,
            0,
            r.mediumSpace,
            r.mediumSpace,
          ),
          children: [
            Text(
              answer,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.textTheme.bodyMedium?.color?.withOpacity(0.8),
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

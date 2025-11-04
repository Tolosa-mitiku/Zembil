/// RESPONSIVE DESIGN - PRACTICAL EXAMPLES
/// This file shows before/after examples of converting hardcoded values to responsive design

import 'package:flutter/material.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';

// ==================== EXAMPLE 1: Simple Card ====================

/// ❌ BAD - Hardcoded values
class ProductCardBad extends StatelessWidget {
  const ProductCardBad({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 180,
      height: 240,
      padding: const EdgeInsets.all(12),
      margin: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey, width: 1),
        boxShadow: const [
          BoxShadow(
            color: Color(0x1A000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            width: 156,
            height: 156,
            color: Colors.grey[200],
          ),
          const SizedBox(height: 8),
          const Text(
            'Product Name',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 4),
          const Text(
            '\$99.99',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}

/// ✅ GOOD - Responsive values
class ProductCardGood extends StatelessWidget {
  const ProductCardGood({super.key});

  @override
  Widget build(BuildContext context) {
    final r = context.r;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      width: r.wp(45), // 45% of screen width
      height: r.hp(30), // 30% of screen height
      padding: r.cardPadding, // Responsive padding
      margin: r.cardMargin, // Responsive margin
      decoration: BoxDecoration(
        color: AppColors.getSurface(isDark),
        borderRadius: r.cardBorderRadius,
        border: Border.all(
          color: AppColors.getBorder(isDark),
          width: r.thinBorder,
        ),
        boxShadow: r.cardShadow(isDark),
      ),
      child: Column(
        children: [
          Container(
            width: r.wp(39), // Image slightly smaller than card
            height: r.wp(39), // Square image
            color: AppColors.grey200,
          ),
          SizedBox(height: r.smallSpace),
          Text(
            'Product Name',
            style: TextStyle(
              fontSize: r.bodySmallSize,
              fontWeight: FontWeight.w600,
              color: AppColors.getTextPrimary(isDark),
            ),
          ),
          SizedBox(height: r.tinySpace),
          Text(
            '\$99.99',
            style: TextStyle(
              fontSize: r.bodySize,
              fontWeight: FontWeight.bold,
              color: AppColors.gold,
            ),
          ),
        ],
      ),
    );
  }
}

// ==================== EXAMPLE 2: Button ====================

/// ❌ BAD - Hardcoded button
class CheckoutButtonBad extends StatelessWidget {
  const CheckoutButtonBad({super.key});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {},
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        minimumSize: const Size(200, 48),
      ),
      child: const Text(
        'Checkout',
        style: TextStyle(fontSize: 16),
      ),
    );
  }
}

/// ✅ GOOD - Responsive button
class CheckoutButtonGood extends StatelessWidget {
  const CheckoutButtonGood({super.key});

  @override
  Widget build(BuildContext context) {
    final r = context.r;

    return ElevatedButton(
      onPressed: () {},
      style: ElevatedButton.styleFrom(
        padding: r.buttonPadding, // Responsive padding
        shape: RoundedRectangleBorder(
          borderRadius: r.buttonBorderRadius,
        ),
        minimumSize: r.fullWidthButtonSize, // Responsive size
      ),
      child: Text(
        'Checkout',
        style: TextStyle(fontSize: r.bodySize),
      ),
    );
  }
}

// ==================== EXAMPLE 3: Header ====================

/// ❌ BAD - Hardcoded header
class PageHeaderBad extends StatelessWidget {
  const PageHeaderBad({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 200,
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFFD4AF37), Color(0xFFB8941E)],
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Colors.white24,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.settings, size: 40, color: Colors.white),
          ),
          const SizedBox(height: 12),
          const Text(
            'Settings',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
          ),
        ],
      ),
    );
  }
}

/// ✅ GOOD - Responsive header
class PageHeaderGood extends StatelessWidget {
  const PageHeaderGood({super.key});

  @override
  Widget build(BuildContext context) {
    final r = context.r;

    return Container(
      height: r.profileHeaderHeight, // 25% of screen height
      width: double.infinity,
      padding: EdgeInsets.all(r.mediumSpace),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.gold, AppColors.goldDark],
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: EdgeInsets.all(r.mediumSpace),
            decoration: const BoxDecoration(
              color: Colors.white24,
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.settings,
              size: r.largeIcon,
              color: Colors.white,
            ),
          ),
          SizedBox(height: r.smallSpace),
          Text(
            'Settings',
            style: TextStyle(
              fontSize: r.headlineSize,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}

// ==================== EXAMPLE 4: Search Bar ====================

/// ❌ BAD - Hardcoded search bar
class SearchBarBad extends StatelessWidget {
  const SearchBarBad({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 360,
      height: 48,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey),
      ),
      child: const Row(
        children: [
          Icon(Icons.search, size: 24, color: Colors.grey),
          SizedBox(width: 12),
          Expanded(
            child: TextField(
              decoration: InputDecoration(
                border: InputBorder.none,
                hintText: 'Search...',
              ),
              style: TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }
}

/// ✅ GOOD - Responsive search bar
class SearchBarGood extends StatelessWidget {
  const SearchBarGood({super.key});

  @override
  Widget build(BuildContext context) {
    final r = context.r;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      width: r.wp(90), // 90% of screen width
      height: r.inputHeight, // Responsive input height
      padding: EdgeInsets.symmetric(horizontal: r.mediumSpace),
      decoration: BoxDecoration(
        color: AppColors.getSurface(isDark),
        borderRadius: BorderRadius.circular(r.xLargeRadius), // Pill shape
        border: Border.all(
          color: AppColors.getBorder(isDark),
          width: r.thinBorder,
        ),
      ),
      child: Row(
        children: [
          Icon(
            Icons.search,
            size: r.mediumIcon,
            color: AppColors.gold,
          ),
          SizedBox(width: r.smallSpace),
          Expanded(
            child: TextField(
              decoration: const InputDecoration(
                border: InputBorder.none,
                hintText: 'Search...',
              ),
              style: TextStyle(
                fontSize: r.bodySize,
                color: AppColors.getTextPrimary(isDark),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ==================== EXAMPLE 5: Grid Layout ====================

/// ❌ BAD - Fixed grid
class ProductGridBad extends StatelessWidget {
  const ProductGridBad({super.key});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2, // Always 2 columns
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.75,
      ),
      itemBuilder: (context, index) => Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}

/// ✅ GOOD - Responsive grid
class ProductGridGood extends StatelessWidget {
  const ProductGridGood({super.key});

  @override
  Widget build(BuildContext context) {
    final r = context.r;

    return GridView.builder(
      padding: r.adaptivePadding, // Different on mobile vs tablet
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: r.gridColumns, // Auto: 2, 3, or 4 based on device
        crossAxisSpacing: r.gridSpacing,
        mainAxisSpacing: r.gridSpacing,
        childAspectRatio: 0.75,
      ),
      itemBuilder: (context, index) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Container(
          decoration: BoxDecoration(
            color: AppColors.getSurface(isDark),
            borderRadius: r.cardBorderRadius,
          ),
        );
      },
    );
  }
}

// ==================== EXAMPLE 6: Adaptive Layout ====================

/// ✅ GOOD - Different layouts for different devices
class AdaptiveLayoutExample extends StatelessWidget {
  const AdaptiveLayoutExample({super.key});

  @override
  Widget build(BuildContext context) {
    final r = context.r;

    // Mobile: Vertical layout
    // Tablet/Desktop: Horizontal layout
    if (r.isMobile) {
      return Column(
        children: [
          _buildImage(r),
          SizedBox(height: r.mediumSpace),
          _buildDetails(r),
        ],
      );
    } else {
      return Row(
        children: [
          Expanded(child: _buildImage(r)),
          SizedBox(width: r.largeSpace),
          Expanded(child: _buildDetails(r)),
        ],
      );
    }
  }

  Widget _buildImage(Responsive r) {
    return Container(
      height: r.hp(30),
      color: AppColors.grey200,
      child: Center(
        child: Icon(
          Icons.image,
          size: r.xLargeIcon,
          color: AppColors.gold,
        ),
      ),
    );
  }

  Widget _buildDetails(Responsive r) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Product Details',
          style: TextStyle(
            fontSize: r.titleSize,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: r.smallSpace),
        Text(
          'Description goes here...',
          style: TextStyle(fontSize: r.bodySize),
        ),
      ],
    );
  }
}

// ==================== EXAMPLE 7: Responsive with Constraints ====================

/// ✅ GOOD - Responsive with min/max constraints
class ResponsiveWithConstraints extends StatelessWidget {
  const ResponsiveWithConstraints({super.key});

  @override
  Widget build(BuildContext context) {
    final r = context.r;

    return Container(
      // Clamp width between 300 and 600 pixels
      width: r.wp(90).clamp(300.0, 600.0),
      padding: r.cardPadding,
      child: Text(
        'This container will be 90% of screen width, but never smaller than 300px or larger than 600px',
        style: TextStyle(
          // Clamp font size between 14 and 20 pixels
          fontSize: r.bodySize.clamp(14.0, 20.0),
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}

// ==================== EXAMPLE 8: Using Typography Scale ====================

/// ✅ GOOD - Using typography scale
class TypographyScaleExample extends StatelessWidget {
  const TypographyScaleExample({super.key});

  @override
  Widget build(BuildContext context) {
    final r = context.r;
    final typo = TypographyScale.fromWidth(r.width);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Display',
          style: TextStyle(
            fontSize: typo.display,
            color: AppColors.getTextPrimary(isDark),
          ),
        ),
        Text(
          'Headline XXL',
          style: TextStyle(
            fontSize: typo.xxxl,
            color: AppColors.getTextPrimary(isDark),
          ),
        ),
        Text(
          'Headline XL',
          style: TextStyle(
            fontSize: typo.xxl,
            color: AppColors.getTextPrimary(isDark),
          ),
        ),
        Text(
          'Headline',
          style: TextStyle(
            fontSize: typo.xl,
            color: AppColors.getTextPrimary(isDark),
          ),
        ),
        Text(
          'Title',
          style: TextStyle(
            fontSize: typo.lg,
            color: AppColors.getTextPrimary(isDark),
          ),
        ),
        Text(
          'Body (base)',
          style: TextStyle(
            fontSize: typo.md,
            color: AppColors.getTextPrimary(isDark),
          ),
        ),
        Text(
          'Body Small',
          style: TextStyle(
            fontSize: typo.sm,
            color: AppColors.getTextSecondary(isDark),
          ),
        ),
        Text(
          'Caption',
          style: TextStyle(
            fontSize: typo.xs,
            color: AppColors.getTextSecondary(isDark),
          ),
        ),
      ],
    );
  }
}

// ==================== EXAMPLE 9: Using Spacing Scale ====================

/// ✅ GOOD - Using spacing scale
class SpacingScaleExample extends StatelessWidget {
  const SpacingScaleExample({super.key});

  @override
  Widget build(BuildContext context) {
    final r = context.r;
    final spacing = SpacingScale.fromWidth(r.width);

    return Column(
      children: [
        Container(height: 50, color: AppColors.gold),
        SizedBox(height: spacing.xs), // 0.25x spacing
        Container(height: 50, color: AppColors.goldLight),
        SizedBox(height: spacing.sm), // 0.5x spacing
        Container(height: 50, color: AppColors.gold),
        SizedBox(height: spacing.md), // 1x spacing (base)
        Container(height: 50, color: AppColors.goldLight),
        SizedBox(height: spacing.lg), // 1.5x spacing
        Container(height: 50, color: AppColors.gold),
        SizedBox(height: spacing.xl), // 2x spacing
        Container(height: 50, color: AppColors.goldLight),
      ],
    );
  }
}

// ==================== EXAMPLE 10: Golden Ratio ====================

/// ✅ GOOD - Using golden ratio for aesthetics
class GoldenRatioExample extends StatelessWidget {
  const GoldenRatioExample({super.key});

  @override
  Widget build(BuildContext context) {
    final r = context.r;
    final cardWidth = r.wp(80);
    final cardHeight = GoldenRatio.heightFromWidth(cardWidth);

    return Container(
      width: cardWidth,
      height: cardHeight, // Automatically calculated using golden ratio
      padding: GoldenRatio.getPadding(r.mediumSpace), // Golden ratio padding
      decoration: BoxDecoration(
        color: AppColors.gold,
        borderRadius: BorderRadius.circular(r.mediumRadius),
      ),
      child: const Center(
        child: Text(
          'This card uses the golden ratio (1.618) for perfect proportions',
          style: TextStyle(color: Colors.white),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}

// ==================== EXAMPLE 11: Device-Specific Values ====================

/// ✅ GOOD - Different values per device type
class DeviceSpecificExample extends StatelessWidget {
  const DeviceSpecificExample({super.key});

  @override
  Widget build(BuildContext context) {
    final r = context.r;

    final fontSize = r.responsiveValue(
      mobile: r.bodySize,
      tablet: r.titleSize,
      desktop: r.headlineSize,
    );

    final padding = r.responsiveValue<EdgeInsets>(
      mobile: EdgeInsets.all(r.mediumSpace),
      tablet: EdgeInsets.all(r.largeSpace),
      desktop: EdgeInsets.all(r.xLargeSpace),
    );

    return Container(
      padding: padding, // Different padding per device
      child: Text(
        'This text size and padding adapts to device type',
        style: TextStyle(fontSize: fontSize), // Different size per device
      ),
    );
  }
}

// ==================== QUICK REFERENCE ====================

/// Copy this template for new widgets:
class ResponsiveWidgetTemplate extends StatelessWidget {
  const ResponsiveWidgetTemplate({super.key});

  @override
  Widget build(BuildContext context) {
    // 1. Get responsive helper
    final r = context.r; // Short form
    // OR: final r = Responsive(context);

    // 2. Get theme info
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    // 3. Use responsive values
    return Container(
      // Dimensions
      width: r.wp(90), // 90% width
      height: r.hp(30), // 30% height

      // Spacing
      padding: EdgeInsets.all(r.mediumSpace),
      margin: EdgeInsets.symmetric(
        horizontal: r.largeSpace,
        vertical: r.smallSpace,
      ),

      // Styling
      decoration: BoxDecoration(
        color: AppColors.getSurface(isDark),
        borderRadius: BorderRadius.circular(r.mediumRadius),
        border: Border.all(
          color: AppColors.getBorder(isDark),
          width: r.thinBorder,
        ),
        boxShadow: r.cardShadow(isDark),
      ),

      child: Column(
        children: [
          // Icon
          Icon(
            Icons.star,
            size: r.largeIcon,
            color: AppColors.gold,
          ),
          SizedBox(height: r.smallSpace),

          // Text
          Text(
            'Title',
            style: TextStyle(
              fontSize: r.titleSize,
              fontWeight: FontWeight.bold,
              color: AppColors.getTextPrimary(isDark),
            ),
          ),
          SizedBox(height: r.tinySpace),
          Text(
            'Description',
            style: TextStyle(
              fontSize: r.bodySize,
              color: AppColors.getTextSecondary(isDark),
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}

// ==================== SIZE REFERENCE CHART ====================

/// Quick reference for common responsive sizes
/// 
/// Based on 400px width screen:
/// 
/// SPACING:
/// - r.tinySpace      = ~4px   (1%)
/// - r.smallSpace     = ~8px   (2%)
/// - r.mediumSpace    = ~16px  (4%) ⭐ Most common
/// - r.largeSpace     = ~24px  (6%)
/// - r.xLargeSpace    = ~32px  (8%)
/// - r.xxLargeSpace   = ~48px  (12%)
/// 
/// ICONS:
/// - r.tinyIcon       = ~16px  (4%)
/// - r.smallIcon      = ~20px  (5%)
/// - r.mediumIcon     = ~24px  (6%) ⭐ Most common
/// - r.largeIcon      = ~32px  (8%)
/// - r.xLargeIcon     = ~48px  (12%)
/// - r.xxLargeIcon    = ~80px  (20%)
/// 
/// FONTS:
/// - r.captionSize    = ~12px  (3%)
/// - r.bodySmallSize  = ~14px  (3.5%)
/// - r.bodySize       = ~16px  (4%) ⭐ Most common
/// - r.titleSize      = ~18px  (4.5%)
/// - r.headlineSize   = ~22px  (5.5%)
/// - r.displaySize    = ~28px  (7%)
/// 
/// RADIUS:
/// - r.smallRadius    = ~8px   (2%)
/// - r.mediumRadius   = ~12px  (3%) ⭐ Most common
/// - r.largeRadius    = ~16px  (4%)
/// - r.xLargeRadius   = ~24px  (6%)
/// 
/// BORDERS:
/// - r.thinBorder     = ~1px   (0.25%) ⭐ Most common
/// - r.mediumBorder   = ~2px   (0.5%)
/// - r.thickBorder    = ~3px   (0.75%)
/// 
/// PERCENTAGE HELPERS:
/// - r.wp(50)         = 50% of screen width
/// - r.hp(30)         = 30% of screen height
/// - r.sp(10)         = 10% of shortest side
/// - r.lp(80)         = 80% of longest side
/// 
/// DEVICE CHECKS:
/// - r.isMobile       = width < 600px
/// - r.isTablet       = width 600-1024px
/// - r.isDesktop      = width > 1024px
/// - r.gridColumns    = Auto: 2, 3, or 4 columns
/// 
/// PRE-MADE HELPERS:
/// - r.cardPadding           = EdgeInsets.all(~16px)
/// - r.cardMargin            = EdgeInsets.all(~8px)
/// - r.cardBorderRadius      = BorderRadius.circular(~12px)
/// - r.buttonPadding         = EdgeInsets.symmetric(...)
/// - r.buttonBorderRadius    = BorderRadius.circular(~12px)
/// - r.buttonMinSize         = Size(~120px, ~48px)
/// - r.fullWidthButtonSize   = Size(90% width, ~48px)
/// - r.dialogBorderRadius    = BorderRadius.circular(~20px)
/// - r.cardShadow(isDark)    = [BoxShadow(...)]
/// - r.goldGlowShadow()      = [BoxShadow(gold)]


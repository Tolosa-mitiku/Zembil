import 'package:flutter/material.dart';

/// Responsive - Helper class for responsive design across all devices
///
/// Usage:
/// ```dart
/// final r = Responsive(context);
/// Icon(Icons.home, size: r.mediumIcon)
/// SizedBox(height: r.mediumSpace)
/// Text('Title', style: TextStyle(fontSize: r.titleSize))
/// Container(width: r.wp(90)) // 90% of width
/// ```
class Responsive {
  final BuildContext context;
  late final double width;
  late final double height;
  late final Orientation orientation;
  late final double shortestSide;
  late final double longestSide;

  Responsive(this.context) {
    final size = MediaQuery.of(context).size;
    width = size.width;
    height = size.height;
    orientation = MediaQuery.of(context).orientation;
    shortestSide = size.shortestSide;
    longestSide = size.longestSide;
  }

  // ==================== SPACING ====================

  /// Tiny spacing - ~4px on 400px screen
  double get tinySpace => width * 0.01;

  /// Small spacing - ~8px on 400px screen
  double get smallSpace => width * 0.02;

  /// Medium spacing - ~16px on 400px screen (most common)
  double get mediumSpace => width * 0.04;

  /// Large spacing - ~24px on 400px screen
  double get largeSpace => width * 0.06;

  /// Extra large spacing - ~32px on 400px screen
  double get xLargeSpace => width * 0.08;

  /// Extra extra large spacing - ~48px on 400px screen
  double get xxLargeSpace => width * 0.12;

  // ==================== ICON SIZES ====================

  /// Tiny icon - ~16px on 400px screen
  double get tinyIcon => width * 0.04;

  /// Small icon - ~20px on 400px screen
  double get smallIcon => width * 0.05;

  /// Medium icon - ~24px on 400px screen (standard)
  double get mediumIcon => width * 0.06;

  /// Large icon - ~32px on 400px screen
  double get largeIcon => width * 0.08;

  /// Extra large icon - ~48px on 400px screen
  double get xLargeIcon => width * 0.12;

  /// Extra extra large icon - ~80px on 400px screen (splash, empty state)
  double get xxLargeIcon => width * 0.2;

  // ==================== FONT SIZES ====================

  /// Caption size - ~12px on 400px screen
  double get captionSize => width * 0.03;

  /// Body small size - ~14px on 400px screen
  double get bodySmallSize => width * 0.035;

  /// Body size - ~16px on 400px screen (standard)
  double get bodySize => width * 0.04;

  /// Title size - ~18px on 400px screen
  double get titleSize => width * 0.045;

  /// Headline size - ~22px on 400px screen
  double get headlineSize => width * 0.055;

  /// Display size - ~28px on 400px screen
  double get displaySize => width * 0.07;

  /// Large display size - ~36px on 400px screen
  double get largeDisplaySize => width * 0.09;

  // ==================== BORDER RADIUS ====================

  /// Tiny radius - ~4px on 400px screen
  double get tinyRadius => width * 0.01;

  /// Small radius - ~8px on 400px screen
  double get smallRadius => width * 0.02;

  /// Medium radius - ~12px on 400px screen (standard)
  double get mediumRadius => width * 0.03;

  /// Large radius - ~16px on 400px screen
  double get largeRadius => width * 0.04;

  /// Extra large radius - ~24px on 400px screen
  double get xLargeRadius => width * 0.06;

  /// Circular radius - 50% (for circles)
  double get circularRadius => width * 0.5;

  // ==================== BORDER WIDTH ====================

  /// Thin border - ~1px
  double get thinBorder => width * 0.0025;

  /// Medium border - ~2px
  double get mediumBorder => width * 0.005;

  /// Thick border - ~3px
  double get thickBorder => width * 0.0075;

  // ==================== DEVICE TYPE ====================

  /// Check if device is mobile (<600px width)
  bool get isMobile => width < 600;

  /// Check if device is tablet (600-1024px width)
  bool get isTablet => width >= 600 && width < 1024;

  /// Check if device is desktop (>1024px width)
  bool get isDesktop => width >= 1024;

  /// Check if device is in portrait orientation
  bool get isPortrait => orientation == Orientation.portrait;

  /// Check if device is in landscape orientation
  bool get isLandscape => orientation == Orientation.landscape;

  // ==================== GRID COLUMNS ====================

  /// Get appropriate number of grid columns based on device type
  int get gridColumns => isMobile
      ? 2
      : isTablet
          ? 3
          : 4;

  /// Get grid columns with custom values
  int gridColumnsCustom({
    int mobile = 2,
    int tablet = 3,
    int desktop = 4,
  }) {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  }

  // ==================== HELPER METHODS ====================

  /// Width percentage - wp(50) = 50% of screen width
  double wp(double percentage) => width * (percentage / 100);

  /// Height percentage - hp(30) = 30% of screen height
  double hp(double percentage) => height * (percentage / 100);

  /// Shortest side percentage - for maintaining aspect ratios
  double sp(double percentage) => shortestSide * (percentage / 100);

  /// Longest side percentage
  double lp(double percentage) => longestSide * (percentage / 100);

  /// Clamp value between min and max (for extreme screen sizes)
  double clamp(double value, double min, double max) {
    return value.clamp(min, max);
  }

  /// Responsive value based on device type
  T responsiveValue<T>({
    required T mobile,
    T? tablet,
    T? desktop,
  }) {
    if (isDesktop && desktop != null) return desktop;
    if (isTablet && tablet != null) return tablet;
    return mobile;
  }

  // ==================== COMMON SIZES ====================

  /// Standard button height - ~48px on 400px screen
  double get buttonHeight => height * 0.06;

  /// Standard button min width - ~120px on 400px screen
  double get buttonMinWidth => width * 0.3;

  /// Standard app bar height - ~56px
  double get appBarHeight => height * 0.07;

  /// Expanded app bar height - ~200px
  double get expandedAppBarHeight => height * 0.25;

  /// Bottom navigation bar height - ~56px
  double get bottomNavBarHeight => height * 0.07;

  /// Input field height - ~48px on 400px screen
  double get inputHeight => height * 0.06;

  /// Profile avatar radius - ~48px diameter on 400px screen
  double get profileAvatarRadius => width * 0.12;

  /// Card elevation shadow blur - ~8px on 400px screen
  double get cardShadowBlur => width * 0.02;

  /// Card elevation shadow spread - ~4px on 400px screen
  double get cardShadowSpread => width * 0.01;

  // ==================== SAFE AREA ====================

  /// Top safe area padding (notch/status bar)
  double get topSafeArea => MediaQuery.of(context).padding.top;

  /// Bottom safe area padding (home indicator)
  double get bottomSafeArea => MediaQuery.of(context).padding.bottom;

  /// Left safe area padding
  double get leftSafeArea => MediaQuery.of(context).padding.left;

  /// Right safe area padding
  double get rightSafeArea => MediaQuery.of(context).padding.right;

  // ==================== SCREEN METRICS ====================

  /// Get safe screen height (excluding system UI)
  double get safeHeight => height - topSafeArea - bottomSafeArea;

  /// Get safe screen width (excluding system UI)
  double get safeWidth => width - leftSafeArea - rightSafeArea;

  /// Get device pixel ratio
  double get pixelRatio => MediaQuery.of(context).devicePixelRatio;

  /// Check if device is small (width < 360px)
  bool get isSmallDevice => width < 360;

  /// Check if device is large (width > 600px)
  bool get isLargeDevice => width > 600;

  // ==================== ADAPTIVE HELPERS ====================

  /// Get adaptive padding based on device type
  EdgeInsets get adaptivePadding => EdgeInsets.symmetric(
        horizontal: isMobile ? width * 0.04 : width * 0.08,
        vertical: isMobile ? height * 0.02 : height * 0.03,
      );

  /// Get adaptive margin based on device type
  EdgeInsets get adaptiveMargin => EdgeInsets.all(
        isMobile ? width * 0.04 : width * 0.06,
      );

  /// Get adaptive border radius based on device type
  double get adaptiveRadius => isMobile ? width * 0.03 : width * 0.04;

  /// Get adaptive font size based on device type
  double adaptiveFontSize(double mobileSize) {
    if (isMobile) return width * mobileSize;
    if (isTablet)
      return width * (mobileSize * 0.8); // Slightly smaller on tablet
    return width * (mobileSize * 0.6); // Even smaller on desktop
  }

  // ==================== GRID HELPERS ====================

  /// Get grid item width based on columns and spacing
  double getGridItemWidth({
    required int columns,
    double spacing = 0.02,
  }) {
    final totalSpacing = (columns - 1) * (width * spacing);
    return (width - totalSpacing) / columns;
  }

  /// Get responsive grid spacing
  double get gridSpacing => width * 0.02;

  // ==================== CARD HELPERS ====================

  /// Standard card padding
  EdgeInsets get cardPadding => EdgeInsets.all(width * 0.04);

  /// Standard card margin
  EdgeInsets get cardMargin => EdgeInsets.all(width * 0.02);

  /// Standard card border radius
  BorderRadius get cardBorderRadius => BorderRadius.circular(width * 0.04);

  /// Circular card border radius (for top or bottom)
  BorderRadius get cardTopRadius => BorderRadius.vertical(
        top: Radius.circular(width * 0.04),
      );

  BorderRadius get cardBottomRadius => BorderRadius.vertical(
        bottom: Radius.circular(width * 0.04),
      );

  // ==================== BUTTON HELPERS ====================

  /// Standard button padding
  EdgeInsets get buttonPadding => EdgeInsets.symmetric(
        horizontal: width * 0.08,
        vertical: height * 0.018,
      );

  /// Standard button border radius
  BorderRadius get buttonBorderRadius => BorderRadius.circular(width * 0.03);

  /// Standard button minimum size
  Size get buttonMinSize => Size(width * 0.4, height * 0.06);

  /// Full width button size
  Size get fullWidthButtonSize => Size(width * 0.9, height * 0.06);

  // ==================== IMAGE HELPERS ====================

  /// Product card image size (square)
  double get productImageSize => width * 0.45;

  /// Product detail image height
  double get productDetailImageHeight => height * 0.35;

  /// Profile header height
  double get profileHeaderHeight => height * 0.25;

  /// Avatar small size
  double get avatarSmall => width * 0.08;

  /// Avatar medium size
  double get avatarMedium => width * 0.12;

  /// Avatar large size
  double get avatarLarge => width * 0.2;

  // ==================== DIALOG HELPERS ====================

  /// Standard dialog border radius
  BorderRadius get dialogBorderRadius => BorderRadius.circular(width * 0.05);

  /// Bottom sheet top radius
  BorderRadius get bottomSheetRadius => BorderRadius.vertical(
        top: Radius.circular(width * 0.06),
      );

  /// Dialog padding
  EdgeInsets get dialogPadding => EdgeInsets.all(width * 0.05);

  // ==================== SHADOW HELPERS ====================

  /// Get card shadow
  List<BoxShadow> cardShadow(bool isDark) => [
        BoxShadow(
          color: isDark
              ? Colors.black.withOpacity(0.2)
              : Colors.black.withOpacity(0.05),
          blurRadius: cardShadowBlur,
          spreadRadius: cardShadowSpread,
          offset: Offset(0, height * 0.005),
        ),
      ];

  /// Get elevated shadow (stronger)
  List<BoxShadow> elevatedShadow(bool isDark) => [
        BoxShadow(
          color: isDark
              ? Colors.black.withOpacity(0.3)
              : Colors.black.withOpacity(0.1),
          blurRadius: width * 0.04,
          spreadRadius: width * 0.01,
          offset: Offset(0, height * 0.01),
        ),
      ];

  /// Get gold glow shadow
  List<BoxShadow> goldGlowShadow({double opacity = 0.3}) => [
        BoxShadow(
          color: const Color(0xFFD4AF37).withOpacity(opacity),
          blurRadius: width * 0.04,
          spreadRadius: width * 0.01,
        ),
      ];
}

/// Extension on BuildContext for easy access to Responsive
extension ResponsiveExtension on BuildContext {
  Responsive get responsive => Responsive(this);
  Responsive get r => Responsive(this); // Short form
}

/// Device Type Helper
class DeviceType {
  static const double mobileMaxWidth = 600;
  static const double tabletMaxWidth = 1024;

  static bool isMobile(double width) => width < mobileMaxWidth;
  static bool isTablet(double width) =>
      width >= mobileMaxWidth && width < tabletMaxWidth;
  static bool isDesktop(double width) => width >= tabletMaxWidth;

  /// Get number of columns for grid based on width
  static int getGridColumns(double width) {
    if (width < 600) return 2; // Mobile: 2 columns
    if (width < 900) return 3; // Tablet: 3 columns
    if (width < 1200) return 4; // Small desktop: 4 columns
    return 5; // Large desktop: 5 columns
  }

  /// Get card width percentage based on device
  static double getCardWidthPercentage(double width) {
    if (isMobile(width)) return 0.45; // 45% for 2 columns
    if (isTablet(width)) return 0.30; // 30% for 3 columns
    return 0.22; // 22% for 4+ columns
  }
}

/// Golden Ratio Helper (1.618) for aesthetically pleasing proportions
class GoldenRatio {
  static const double ratio = 1.618;

  /// Get height from width using golden ratio
  static double heightFromWidth(double width) => width / ratio;

  /// Get width from height using golden ratio
  static double widthFromHeight(double height) => height * ratio;

  /// Get responsive padding with golden ratio
  static EdgeInsets getPadding(double baseSize) => EdgeInsets.symmetric(
        horizontal: baseSize,
        vertical: baseSize / ratio,
      );
}

/// Breakpoints for different screen sizes
class Breakpoints {
  // Mobile
  static const double mobileSmall = 320; // iPhone SE
  static const double mobileMedium = 375; // iPhone 8
  static const double mobileLarge = 414; // iPhone 11

  // Tablet
  static const double tabletSmall = 600; // Small tablets
  static const double tabletMedium = 768; // iPad
  static const double tabletLarge = 1024; // iPad Pro

  // Desktop
  static const double desktopSmall = 1280; // HD
  static const double desktopMedium = 1920; // Full HD
  static const double desktopLarge = 2560; // 2K

  /// Get breakpoint category
  static String getBreakpoint(double width) {
    if (width < mobileSmall) return 'xs';
    if (width < mobileMedium) return 'sm';
    if (width < mobileLarge) return 'md';
    if (width < tabletSmall) return 'lg';
    if (width < tabletMedium) return 'xl';
    if (width < tabletLarge) return 'xxl';
    return 'xxxl';
  }
}

/// Spacing Scale Helper
class SpacingScale {
  final double baseUnit;

  SpacingScale(this.baseUnit);

  double get xs => baseUnit * 0.25; // 0.25x
  double get sm => baseUnit * 0.5; // 0.5x
  double get md => baseUnit; // 1x (base)
  double get lg => baseUnit * 1.5; // 1.5x
  double get xl => baseUnit * 2; // 2x
  double get xxl => baseUnit * 3; // 3x
  double get xxxl => baseUnit * 4; // 4x

  /// Create from screen width (4% base)
  factory SpacingScale.fromWidth(double width) {
    return SpacingScale(width * 0.04);
  }
}

/// Typography Scale Helper
class TypographyScale {
  final double baseSize;

  TypographyScale(this.baseSize);

  double get xs => baseSize * 0.75; // 12px if base is 16px
  double get sm => baseSize * 0.875; // 14px
  double get md => baseSize; // 16px (base)
  double get lg => baseSize * 1.125; // 18px
  double get xl => baseSize * 1.25; // 20px
  double get xxl => baseSize * 1.5; // 24px
  double get xxxl => baseSize * 2; // 32px
  double get display => baseSize * 2.5; // 40px

  /// Create from screen width (4% base = 16px on 400px screen)
  factory TypographyScale.fromWidth(double width) {
    return TypographyScale(width * 0.04);
  }
}

/// Example Usage in a Widget
/// 
/// ```dart
/// @override
/// Widget build(BuildContext context) {
///   final r = context.r; // Using extension
///   // OR
///   final responsive = Responsive(context);
///   
///   return Container(
///     width: r.wp(90), // 90% width
///     height: r.hp(30), // 30% height
///     padding: EdgeInsets.all(r.mediumSpace),
///     margin: EdgeInsets.symmetric(
///       horizontal: r.largeSpace,
///       vertical: r.smallSpace,
///     ),
///     decoration: BoxDecoration(
///       borderRadius: BorderRadius.circular(r.mediumRadius),
///       border: Border.all(width: r.thinBorder),
///       boxShadow: r.cardShadow(isDark),
///     ),
///     child: Column(
///       children: [
///         Icon(Icons.home, size: r.largeIcon),
///         SizedBox(height: r.smallSpace),
///         Text(
///           'Title',
///           style: TextStyle(fontSize: r.titleSize),
///         ),
///         SizedBox(height: r.tinySpace),
///         Text(
///           'Description',
///           style: TextStyle(fontSize: r.bodySize),
///         ),
///       ],
///     ),
///   );
/// }
/// ```


import 'package:flutter/material.dart';

/// AppColors - Centralized color palette for the Zembil app
/// Gold and White for light mode, Gold and Dark Grey for dark mode
class AppColors {
  // Prevent instantiation
  AppColors._();

  // ==================== Gold Color Palette ====================
  static const Color gold = Color(0xFFD4AF37); // Pure Gold
  static const Color goldLight = Color(0xFFFFD700); // Bright Gold
  static const Color goldDark = Color(0xFFB8941E); // Dark Gold
  static const Color goldPale = Color(0xFFFFF8DC); // Pale Gold/Cornsilk
  static const Color goldAccent = Color(0xFFFFE55C); // Accent Gold

  // ==================== Ocean Blue Palette ====================
  static const Color bluePrimary = Color(0xFF0077B6);
  static const Color blueDark = Color(0xFF023E8A);
  static const Color blueLight = Color(0xFF48CAE4);
  static const Color blueAccent = Color(0xFF90E0EF);
  static const Color blueBackground = Color(0xFFCAF0F8);

  // ==================== Crimson Red Palette ====================
  static const Color redPrimary = Color(0xFFD90429);
  static const Color redDark = Color(0xFF8D0801);
  static const Color redLight = Color(0xFFEF233C);
  static const Color redAccent = Color(0xFFFF8FA3);
  static const Color redBackground = Color(0xFFFFF0F3);

  // ==================== Grey Color Palette ====================
  static const Color grey50 = Color(0xFFFAFAFA);
  static const Color grey100 = Color(0xFFF5F5F5);
  static const Color grey200 = Color(0xFFEEEEEE);
  static const Color grey300 = Color(0xFFE0E0E0);
  static const Color grey400 = Color(0xFFBDBDBD);
  static const Color grey500 = Color(0xFF9E9E9E);
  static const Color grey600 = Color(0xFF757575);
  static const Color grey700 = Color(0xFF616161);
  static const Color grey800 = Color(0xFF424242);
  static const Color grey900 = Color(0xFF212121);

  // ==================== Dark Grey Palette (for Dark Mode) ====================
  static const Color darkGrey = Color(0xFF1E1E1E); // Main dark background
  static const Color darkGreyLight = Color(0xFF2D2D2D); // Elevated surfaces
  static const Color darkGreyDark = Color(0xFF121212); // Deepest background
  static const Color darkGreyCard = Color(0xFF2C2C2C); // Card surfaces
  static const Color darkGreyBorder = Color(0xFF3A3A3A); // Borders

  // ==================== Primary Brand Colors ====================
  static const Color primary = gold;
  static const Color primaryDark = goldDark;
  static const Color primaryLight = goldPale;
  static const Color primaryAccent = goldAccent;

  // ==================== Neutral Colors (Light Theme - White + Gold) ====================
  static const Color backgroundLight = Color(0xFFFFFFFF); // Pure White
  static const Color surfaceLight = grey50;
  static const Color surfaceVariantLight = grey100;
  static const Color cardLight = Color(0xFFFFFFFF);

  static const Color textPrimaryLight = grey900;
  static const Color textSecondaryLight = grey700;
  static const Color textTertiaryLight = grey500;

  // ==================== Neutral Colors (Dark Theme - Dark Grey + Gold) ====================
  static const Color backgroundDark = darkGreyDark;
  static const Color surfaceDark = darkGrey;
  static const Color surfaceVariantDark = darkGreyLight;
  static const Color cardDark = darkGreyCard;

  static const Color textPrimaryDark = Color(0xFFFFFFFF); // Pure White text
  static const Color textSecondaryDark = grey300;
  static const Color textTertiaryDark = grey500;

  // ==================== Semantic Colors ====================
  static const Color success = Color(0xFF4CAF50); // Green
  static const Color error = Color(0xFFE53935); // Red
  static const Color warning = goldAccent; // Gold accent
  static const Color info = Color(0xFF2196F3); // Blue

  // ==================== Component Colors ====================
  static const Color dividerLight = grey200;
  static const Color dividerDark = darkGreyBorder;

  static const Color borderLight = grey300;
  static const Color borderDark = darkGreyBorder;

  static const Color shadowLight = Color(0x1A000000); // 10% black
  static const Color shadowDark = Color(0x40000000); // 25% black

  // ==================== Special Colors ====================
  // Shimmer effect for loading states
  static const Color shimmerBaseLight = grey200;
  static const Color shimmerHighlightLight = grey50;
  static const Color shimmerBaseDark = darkGreyLight;
  static const Color shimmerHighlightDark = darkGreyCard;

  // UI accents
  static const Color favorite = Color(0xFFE53935); // Red heart
  static const Color rating = goldLight; // Gold stars

  // ==================== Gradient Colors ====================
  static const LinearGradient goldGradient = LinearGradient(
    colors: [goldLight, gold, goldDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient lightGradient = LinearGradient(
    colors: [Color(0xFFFFFFFF), grey50],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient darkGradient = LinearGradient(
    colors: [darkGreyDark, darkGrey],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  // ==================== Helper Methods ====================

  /// Get text color based on theme mode
  static Color getTextPrimary(bool isDark) =>
      isDark ? textPrimaryDark : textPrimaryLight;

  static Color getTextSecondary(bool isDark) =>
      isDark ? textSecondaryDark : textSecondaryLight;

  static Color getTextTertiary(bool isDark) =>
      isDark ? textTertiaryDark : textTertiaryLight;

  /// Get background color based on theme mode
  static Color getBackground(bool isDark) =>
      isDark ? backgroundDark : backgroundLight;

  static Color getSurface(bool isDark) => isDark ? surfaceDark : surfaceLight;

  static Color getSurfaceVariant(bool isDark) =>
      isDark ? surfaceVariantDark : surfaceVariantLight;

  static Color getCard(bool isDark) => isDark ? cardDark : cardLight;

  /// Get divider color based on theme mode
  static Color getDivider(bool isDark) => isDark ? dividerDark : dividerLight;

  /// Get border color based on theme mode
  static Color getBorder(bool isDark) => isDark ? borderDark : borderLight;

  /// Get shadow color based on theme mode
  static Color getShadow(bool isDark) => isDark ? shadowDark : shadowLight;

  /// Get shimmer colors based on theme mode
  static Color getShimmerBase(bool isDark) =>
      isDark ? shimmerBaseDark : shimmerBaseLight;

  static Color getShimmerHighlight(bool isDark) =>
      isDark ? shimmerHighlightDark : shimmerHighlightLight;

  /// Get gradient based on theme mode
  static LinearGradient getBackgroundGradient(bool isDark) =>
      isDark ? darkGradient : lightGradient;
}

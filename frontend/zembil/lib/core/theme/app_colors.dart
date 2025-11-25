import 'package:flutter/material.dart';

/// AppColors - Centralized color palette for the Zembil app
/// Supports light and dark themes with semantic naming
class AppColors {
  // Prevent instantiation
  AppColors._();

  // ==================== Primary Brand Colors ====================
  static const Color primary = Color(0xFFFDD32A); // Yellow
  static const Color primaryDark = Color(0xFFEFAC1A);
  static const Color primaryLight = Color(0xFFFFF6E2);

  // ==================== Secondary Colors ====================
  static const Color secondary = Color(0xFF204428); // Dark Green
  static const Color secondaryLight = Color(0xFF7EC28D); // Light Green
  static const Color accent = Color(0xFFFF776F); // Coral/Red

  // ==================== Neutral Colors (Light Theme) ====================
  static const Color backgroundLight = Color(0xFFFFFFFF);
  static const Color surfaceLight = Color(0xFFF6F6F6);
  static const Color surfaceVariantLight = Color(0xFFF3F8F8);
  
  static const Color textPrimaryLight = Color(0xFF000000);
  static const Color textSecondaryLight = Color(0xFF5B5B5B);
  static const Color textTertiaryLight = Color(0xFF869EA0);

  // ==================== Neutral Colors (Dark Theme) ====================
  static const Color backgroundDark = Color(0xFF1A1A1A);
  static const Color surfaceDark = Color(0xFF242424);
  static const Color surfaceVariantDark = Color(0xFF2C2C2C);
  
  static const Color textPrimaryDark = Color(0xFFFFFFFF);
  static const Color textSecondaryDark = Color(0xFFB8B8B8);
  static const Color textTertiaryDark = Color(0xFF8A8A8A);

  // ==================== Semantic Colors ====================
  static const Color success = Color(0xFF7EC28D);
  static const Color error = Color(0xFFF35253);
  static const Color warning = Color(0xFFFDD32A);
  static const Color info = Color(0xFF4977FF);

  // ==================== Component Colors ====================
  static const Color divider = Color(0xFFD9D9D9);
  static const Color dividerDark = Color(0xFF3A3A3A);
  
  static const Color border = Color(0xFFE0E0E0);
  static const Color borderDark = Color(0xFF404040);

  static const Color shadow = Color(0x1A000000); // 10% opacity
  static const Color shadowDark = Color(0x33000000); // 20% opacity

  // ==================== Special Colors ====================
  static const Color shimmerBase = Color(0xFFD9D9D9);
  static const Color shimmerHighlight = Color(0xFFF1F1F1);

  static const Color favorite = Color(0xFFFF776F);
  static const Color rating = Color(0xFFFDD32A);

  // ==================== Gradient Colors ====================
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, primaryDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient successGradient = LinearGradient(
    colors: [secondaryLight, secondary],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
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

  /// Get divider color based on theme mode
  static Color getDivider(bool isDark) => isDark ? dividerDark : divider;

  /// Get border color based on theme mode
  static Color getBorder(bool isDark) => isDark ? borderDark : border;

  /// Get shadow color based on theme mode
  static Color getShadow(bool isDark) => isDark ? shadowDark : shadow;
}


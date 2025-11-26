import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/app_text_styles.dart';

/// AppTheme - Centralized theme configuration for the Zembil app
/// Provides light and dark theme with consistent styling
class AppTheme {
  // Prevent instantiation
  AppTheme._();

  // ==================== Light Theme (White + Gold) ====================
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      fontFamily: 'Poppins',

      // Color scheme - White backgrounds with Gold accents
      colorScheme: ColorScheme.light(
        primary: AppColors.gold,
        primaryContainer: AppColors.goldPale,
        secondary: AppColors.goldDark,
        secondaryContainer: AppColors.goldLight,
        tertiary: AppColors.goldAccent,
        surface: AppColors.backgroundLight,
        surfaceContainerHighest: AppColors.surfaceLight,
        error: AppColors.error,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AppColors.textPrimaryLight,
        onError: Colors.white,
        outline: AppColors.borderLight,
        shadow: AppColors.shadowLight,
      ),

      // Scaffold - Pure white background
      scaffoldBackgroundColor: AppColors.backgroundLight,

      // App Bar
      appBarTheme: AppBarTheme(
        elevation: 0,
        centerTitle: false,
        backgroundColor: AppColors.backgroundLight,
        foregroundColor: AppColors.textPrimaryLight,
        surfaceTintColor: Colors.transparent,
        systemOverlayStyle: SystemUiOverlayStyle.dark,
        titleTextStyle: AppTextStyles.titleLarge.copyWith(
          color: AppColors.textPrimaryLight,
        ),
        iconTheme: const IconThemeData(
          color: AppColors.textPrimaryLight,
          size: 24,
        ),
      ),

      // Text Theme
      textTheme: TextTheme(
        displayLarge: AppTextStyles.displayLarge.copyWith(
          color: AppColors.textPrimaryLight,
        ),
        displayMedium: AppTextStyles.displayMedium.copyWith(
          color: AppColors.textPrimaryLight,
        ),
        displaySmall: AppTextStyles.displaySmall.copyWith(
          color: AppColors.textPrimaryLight,
        ),
        headlineLarge: AppTextStyles.headlineLarge.copyWith(
          color: AppColors.textPrimaryLight,
        ),
        headlineMedium: AppTextStyles.headlineMedium.copyWith(
          color: AppColors.textPrimaryLight,
        ),
        headlineSmall: AppTextStyles.headlineSmall.copyWith(
          color: AppColors.textPrimaryLight,
        ),
        titleLarge: AppTextStyles.titleLarge.copyWith(
          color: AppColors.textPrimaryLight,
        ),
        titleMedium: AppTextStyles.titleMedium.copyWith(
          color: AppColors.textPrimaryLight,
        ),
        titleSmall: AppTextStyles.titleSmall.copyWith(
          color: AppColors.textPrimaryLight,
        ),
        bodyLarge: AppTextStyles.bodyLarge.copyWith(
          color: AppColors.textPrimaryLight,
        ),
        bodyMedium: AppTextStyles.bodyMedium.copyWith(
          color: AppColors.textSecondaryLight,
        ),
        bodySmall: AppTextStyles.bodySmall.copyWith(
          color: AppColors.textTertiaryLight,
        ),
        labelLarge: AppTextStyles.labelLarge.copyWith(
          color: AppColors.textPrimaryLight,
        ),
        labelMedium: AppTextStyles.labelMedium.copyWith(
          color: AppColors.textSecondaryLight,
        ),
        labelSmall: AppTextStyles.labelSmall.copyWith(
          color: AppColors.textTertiaryLight,
        ),
      ),

      // Elevated Button
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: AppColors.textPrimaryLight,
          elevation: 0,
          shadowColor: Colors.transparent,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: AppTextStyles.button,
        ),
      ),

      // Outlined Button
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          side: const BorderSide(color: AppColors.primary, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: AppTextStyles.button,
        ),
      ),

      // Text Button
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          textStyle: AppTextStyles.button,
        ),
      ),

      // Input Decoration - White background, gold focus
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.grey300),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.grey300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.gold, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.error, width: 2),
        ),
        hintStyle: AppTextStyles.bodyMedium.copyWith(
          color: AppColors.grey500,
        ),
        labelStyle: AppTextStyles.bodyMedium.copyWith(
          color: AppColors.grey700,
        ),
      ),

      // Card - White with subtle shadow
      cardTheme: CardTheme(
        elevation: 2,
        shadowColor: AppColors.shadowLight,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        color: Colors.white,
      ),

      // Divider
      dividerTheme: DividerThemeData(
        color: AppColors.dividerLight,
        thickness: 1,
        space: 1,
      ),

      // Icon
      iconTheme: const IconThemeData(
        color: AppColors.textPrimaryLight,
        size: 24,
      ),

      // Bottom Navigation Bar - White background, gold selected
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.gold,
        unselectedItemColor: AppColors.grey600,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
        selectedLabelStyle: AppTextStyles.labelSmall.copyWith(
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: AppTextStyles.labelSmall,
      ),

      // Chip
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.grey100,
        selectedColor: AppColors.goldPale,
        labelStyle: AppTextStyles.labelMedium,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),

      // Dialog - White background
      dialogTheme: DialogTheme(
        backgroundColor: Colors.white,
        elevation: 8,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
      ),

      // Snackbar - Gold background
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.gold,
        contentTextStyle: AppTextStyles.bodyMedium.copyWith(
          color: Colors.white,
          fontWeight: FontWeight.w500,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  // ==================== Dark Theme (Dark Grey + Gold) ====================
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      fontFamily: 'Poppins',

      // Color scheme - Dark grey backgrounds with Gold accents
      colorScheme: ColorScheme.dark(
        primary: AppColors.gold,
        primaryContainer: AppColors.goldDark,
        secondary: AppColors.goldLight,
        secondaryContainer: AppColors.goldAccent,
        tertiary: AppColors.goldPale,
        surface: AppColors.surfaceDark,
        surfaceContainerHighest: AppColors.surfaceVariantDark,
        error: AppColors.error,
        onPrimary: AppColors.darkGreyDark,
        onSecondary: AppColors.darkGreyDark,
        onSurface: AppColors.textPrimaryDark,
        onError: Colors.white,
        outline: AppColors.borderDark,
        shadow: AppColors.shadowDark,
      ),

      // Scaffold - Dark grey background
      scaffoldBackgroundColor: AppColors.backgroundDark,

      // App Bar - Dark background with gold text
      appBarTheme: AppBarTheme(
        elevation: 0,
        centerTitle: false,
        backgroundColor: AppColors.backgroundDark,
        foregroundColor: AppColors.gold,
        surfaceTintColor: Colors.transparent,
        systemOverlayStyle: SystemUiOverlayStyle.light,
        titleTextStyle: AppTextStyles.titleLarge.copyWith(
          color: AppColors.goldLight,
          fontWeight: FontWeight.w600,
        ),
        iconTheme: IconThemeData(
          color: AppColors.gold.withOpacity(0.9),
          size: 24,
        ),
      ),

      // Text Theme - Gold tinted text for dark mode
      textTheme: TextTheme(
        displayLarge: AppTextStyles.displayLarge.copyWith(
          color: AppColors.goldLight,
        ),
        displayMedium: AppTextStyles.displayMedium.copyWith(
          color: AppColors.goldLight,
        ),
        displaySmall: AppTextStyles.displaySmall.copyWith(
          color: AppColors.gold,
        ),
        headlineLarge: AppTextStyles.headlineLarge.copyWith(
          color: AppColors.gold,
        ),
        headlineMedium: AppTextStyles.headlineMedium.copyWith(
          color: AppColors.gold,
        ),
        headlineSmall: AppTextStyles.headlineSmall.copyWith(
          color: AppColors.gold,
        ),
        titleLarge: AppTextStyles.titleLarge.copyWith(
          color: AppColors.goldLight,
        ),
        titleMedium: AppTextStyles.titleMedium.copyWith(
          color: AppColors.goldAccent,
        ),
        titleSmall: AppTextStyles.titleSmall.copyWith(
          color: AppColors.goldAccent,
        ),
        bodyLarge: AppTextStyles.bodyLarge.copyWith(
          color: AppColors.grey300,
        ),
        bodyMedium: AppTextStyles.bodyMedium.copyWith(
          color: AppColors.grey400,
        ),
        bodySmall: AppTextStyles.bodySmall.copyWith(
          color: AppColors.grey500,
        ),
        labelLarge: AppTextStyles.labelLarge.copyWith(
          color: AppColors.goldAccent,
        ),
        labelMedium: AppTextStyles.labelMedium.copyWith(
          color: AppColors.grey400,
        ),
        labelSmall: AppTextStyles.labelSmall.copyWith(
          color: AppColors.grey500,
        ),
      ),

      // Elevated Button - Gold background, dark grey text
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.gold,
          foregroundColor: AppColors.darkGreyDark,
          elevation: 4,
          shadowColor: AppColors.gold.withOpacity(0.4),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: AppTextStyles.button.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      // Outlined Button - Gold border and text
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.gold,
          side: const BorderSide(color: AppColors.gold, width: 2),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: AppTextStyles.button,
        ),
      ),

      // Text Button
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.gold,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          textStyle: AppTextStyles.button,
        ),
      ),

      // Input Decoration - Dark grey background, gold focus
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.darkGreyCard,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.darkGreyBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.darkGreyBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.gold, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.error, width: 2),
        ),
        hintStyle: AppTextStyles.bodyMedium.copyWith(
          color: AppColors.grey600,
        ),
        labelStyle: AppTextStyles.bodyMedium.copyWith(
          color: AppColors.grey400,
        ),
      ),

      // Card - Dark grey card with subtle gold border
      cardTheme: CardTheme(
        elevation: 4,
        shadowColor: AppColors.shadowDark,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: AppColors.gold.withOpacity(0.1), width: 1),
        ),
        color: AppColors.cardDark,
      ),

      // Divider - Gold tinted
      dividerTheme: DividerThemeData(
        color: AppColors.gold.withOpacity(0.2),
        thickness: 1,
        space: 1,
      ),

      // Icon - Gold tinted
      iconTheme: IconThemeData(
        color: AppColors.gold.withOpacity(0.9),
        size: 24,
      ),

      // Bottom Navigation Bar - Dark grey background, gold selected
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.darkGreyCard,
        selectedItemColor: AppColors.goldLight,
        unselectedItemColor: AppColors.gold.withOpacity(0.4),
        type: BottomNavigationBarType.fixed,
        elevation: 8,
        selectedLabelStyle: AppTextStyles.labelSmall.copyWith(
          fontWeight: FontWeight.w600,
          color: AppColors.goldLight,
        ),
        unselectedLabelStyle: AppTextStyles.labelSmall.copyWith(
          color: AppColors.gold.withOpacity(0.4),
        ),
      ),

      // Chip - Gold borders and text
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.darkGreyCard,
        selectedColor: AppColors.goldDark.withOpacity(0.3),
        side: BorderSide(color: AppColors.gold.withOpacity(0.3)),
        labelStyle: AppTextStyles.labelMedium.copyWith(
          color: AppColors.goldAccent,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: BorderSide(color: AppColors.gold.withOpacity(0.3)),
        ),
      ),

      // Dialog - Dark grey background with gold border
      dialogTheme: DialogTheme(
        backgroundColor: AppColors.darkGreyLight,
        elevation: 8,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(color: AppColors.gold.withOpacity(0.2)),
        ),
      ),

      // Snackbar - Gold background
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.gold,
        contentTextStyle: AppTextStyles.bodyMedium.copyWith(
          color: AppColors.darkGreyDark,
          fontWeight: FontWeight.w600,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  // ==================== Blue Theme (Ocean) ====================
  static ThemeData get blueTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      fontFamily: 'Poppins',
      colorScheme: ColorScheme.light(
        primary: AppColors.bluePrimary,
        secondary: AppColors.blueDark,
        tertiary: AppColors.blueAccent,
        surface: AppColors.blueBackground,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
      ),
      scaffoldBackgroundColor: AppColors.blueBackground,
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.blueBackground,
        foregroundColor: AppColors.blueDark,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.bluePrimary,
          foregroundColor: Colors.white,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }

  // ==================== Red Theme (Crimson) ====================
  static ThemeData get redTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      fontFamily: 'Poppins',
      colorScheme: ColorScheme.light(
        primary: AppColors.redPrimary,
        secondary: AppColors.redDark,
        tertiary: AppColors.redAccent,
        surface: AppColors.redBackground,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
      ),
      scaffoldBackgroundColor: AppColors.redBackground,
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.redBackground,
        foregroundColor: AppColors.redDark,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.redPrimary,
          foregroundColor: Colors.white,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }
}

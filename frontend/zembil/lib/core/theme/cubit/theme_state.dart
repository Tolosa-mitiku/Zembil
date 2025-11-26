import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

enum AppThemeMode {
  light,
  dark,
  blue,
  red,
  system,
}

/// ThemeState - Represents the current theme mode of the app
class ThemeState extends Equatable {
  final AppThemeMode mode;

  // Helper to get Flutter's ThemeMode
  ThemeMode get themeMode {
    switch (mode) {
      case AppThemeMode.light:
      case AppThemeMode.blue:
      case AppThemeMode.red:
        return ThemeMode.light;
      case AppThemeMode.dark:
        return ThemeMode.dark;
      case AppThemeMode.system:
        return ThemeMode.system;
    }
  }

  const ThemeState({
    required this.mode,
  });

  /// Initial state with system theme
  factory ThemeState.initial() {
    return const ThemeState(mode: AppThemeMode.system);
  }

  /// Light theme state
  factory ThemeState.light() {
    return const ThemeState(mode: AppThemeMode.light);
  }

  /// Dark theme state
  factory ThemeState.dark() {
    return const ThemeState(mode: AppThemeMode.dark);
  }

  /// Blue theme state
  factory ThemeState.blue() {
    return const ThemeState(mode: AppThemeMode.blue);
  }

  /// Red theme state
  factory ThemeState.red() {
    return const ThemeState(mode: AppThemeMode.red);
  }

  /// System theme state
  factory ThemeState.system() {
    return const ThemeState(mode: AppThemeMode.system);
  }

  @override
  List<Object?> get props => [mode];

  @override
  String toString() => 'ThemeState(mode: $mode)';
}

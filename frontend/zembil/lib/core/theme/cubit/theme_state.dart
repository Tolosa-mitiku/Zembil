import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

/// ThemeState - Represents the current theme mode of the app
class ThemeState extends Equatable {
  final ThemeMode themeMode;
  final bool isDarkMode;

  const ThemeState({
    required this.themeMode,
    required this.isDarkMode,
  });

  /// Initial state with system theme
  factory ThemeState.initial() {
    return const ThemeState(
      themeMode: ThemeMode.system,
      isDarkMode: false, // Will be determined by system
    );
  }

  /// Light theme state
  factory ThemeState.light() {
    return const ThemeState(
      themeMode: ThemeMode.light,
      isDarkMode: false,
    );
  }

  /// Dark theme state
  factory ThemeState.dark() {
    return const ThemeState(
      themeMode: ThemeMode.dark,
      isDarkMode: true,
    );
  }

  /// System theme state
  factory ThemeState.system() {
    return const ThemeState(
      themeMode: ThemeMode.system,
      isDarkMode: false, // Will be determined by system
    );
  }

  /// Copy with method
  ThemeState copyWith({
    ThemeMode? themeMode,
    bool? isDarkMode,
  }) {
    return ThemeState(
      themeMode: themeMode ?? this.themeMode,
      isDarkMode: isDarkMode ?? this.isDarkMode,
    );
  }

  @override
  List<Object?> get props => [themeMode, isDarkMode];

  @override
  String toString() =>
      'ThemeState(themeMode: $themeMode, isDarkMode: $isDarkMode)';
}


import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/hive.dart';
import 'package:zembil/core/theme/cubit/theme_state.dart';

/// ThemeCubit - Manages theme state and persistence
class ThemeCubit extends Cubit<ThemeState> {
  final HiveService _hiveService;
  static const String _themeKey = 'theme_mode';

  ThemeCubit(this._hiveService) : super(ThemeState.initial()) {
    _loadTheme();
  }

  /// Load saved theme from storage
  Future<void> _loadTheme() async {
    try {
      final savedThemeIndex = _hiveService.getData(_themeKey);
      if (savedThemeIndex != null) {
        final themeMode = ThemeMode.values[savedThemeIndex as int];
        _updateTheme(themeMode);
      }
    } catch (e) {
      // If loading fails, use system theme
      emit(ThemeState.system());
    }
  }

  /// Set light theme
  Future<void> setLightTheme() async {
    await _saveTheme(ThemeMode.light);
    emit(ThemeState.light());
  }

  /// Set dark theme
  Future<void> setDarkTheme() async {
    await _saveTheme(ThemeMode.dark);
    emit(ThemeState.dark());
  }

  /// Set system theme
  Future<void> setSystemTheme() async {
    await _saveTheme(ThemeMode.system);
    emit(ThemeState.system());
  }

  /// Toggle between light and dark theme
  Future<void> toggleTheme() async {
    if (state.themeMode == ThemeMode.light) {
      await setDarkTheme();
    } else {
      await setLightTheme();
    }
  }

  /// Save theme to storage
  Future<void> _saveTheme(ThemeMode themeMode) async {
    try {
      await _hiveService.saveData(_themeKey, themeMode.index);
    } catch (e) {
      debugPrint('Failed to save theme: $e');
    }
  }

  /// Update theme without saving (for system theme)
  void _updateTheme(ThemeMode themeMode) {
    switch (themeMode) {
      case ThemeMode.light:
        emit(ThemeState.light());
        break;
      case ThemeMode.dark:
        emit(ThemeState.dark());
        break;
      case ThemeMode.system:
        emit(ThemeState.system());
        break;
    }
  }

  /// Check if current theme is dark (considering system theme)
  bool isDarkMode(BuildContext context) {
    if (state.themeMode == ThemeMode.system) {
      return MediaQuery.of(context).platformBrightness == Brightness.dark;
    }
    return state.isDarkMode;
  }
}


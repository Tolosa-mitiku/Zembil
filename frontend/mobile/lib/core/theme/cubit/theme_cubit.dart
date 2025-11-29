import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/hive.dart';
import 'package:zembil/core/theme/cubit/theme_state.dart';

/// ThemeCubit - Manages theme state and persistence
class ThemeCubit extends Cubit<ThemeState> {
  final HiveService _hiveService;
  static const String _themeKey = 'app_theme_mode';

  ThemeCubit(this._hiveService) : super(ThemeState.initial()) {
    _loadTheme();
  }

  /// Load saved theme from storage
  Future<void> _loadTheme() async {
    try {
      final savedThemeIndex = _hiveService.getData(_themeKey);
      if (savedThemeIndex != null) {
        final mode = AppThemeMode.values[savedThemeIndex as int];
        emit(ThemeState(mode: mode));
      }
    } catch (e) {
      emit(ThemeState.system());
    }
  }

  /// Set theme mode
  Future<void> setTheme(AppThemeMode mode) async {
    await _saveTheme(mode);
    emit(ThemeState(mode: mode));
  }

  Future<void> toggleTheme() async {
    if (state.mode == AppThemeMode.light) {
      await setTheme(AppThemeMode.dark);
    } else {
      await setTheme(AppThemeMode.light);
    }
  }

  /// Save theme to storage
  Future<void> _saveTheme(AppThemeMode mode) async {
    try {
      await _hiveService.saveData(_themeKey, mode.index);
    } catch (e) {
      debugPrint('Failed to save theme: $e');
    }
  }

  /// Check if current theme is dark
  bool isDarkMode(BuildContext context) {
    if (state.mode == AppThemeMode.system) {
      return MediaQuery.of(context).platformBrightness == Brightness.dark;
    }
    return state.mode == AppThemeMode.dark;
  }
}

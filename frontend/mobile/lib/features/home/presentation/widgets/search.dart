import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_bloc.dart';
import 'package:zembil/features/home/presentation/bloc/product_by_category_bloc/products_by_category_event.dart';

class Search extends StatefulWidget {
  final ValueChanged<String>? onChanged;
  final ValueChanged<bool>? onFocusChange;
  final VoidCallback? onFilterTap;

  const Search({
    super.key,
    this.onChanged,
    this.onFocusChange,
    this.onFilterTap,
  });

  @override
  State<Search> createState() => _SearchState();
}

class _SearchState extends State<Search> with SingleTickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  bool _isFocused = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.01).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  void _handleFocusChange(bool hasFocus) {
    setState(() => _isFocused = hasFocus);
    if (hasFocus) {
      _animationController.forward();
    } else {
      _animationController.reverse();
    }
    widget.onFocusChange?.call(hasFocus);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return ScaleTransition(
      scale: _scaleAnimation,
      child: Container(
        height: 48, // Slimmer height
        decoration: BoxDecoration(
          color: theme.cardTheme.color,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: _isFocused
                ? theme.colorScheme.primary
                : (isDark
                    ? AppColors.gold.withOpacity(0.2)
                    : AppColors.grey300),
            width: _isFocused ? 1.5 : 1,
          ),
          boxShadow: _isFocused
              ? [
                  BoxShadow(
                    color: theme.colorScheme.primary.withOpacity(0.15),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: TextField(
          controller: _searchController,
          style: theme.textTheme.bodyMedium,
          onTap: () => _handleFocusChange(true),
          onTapOutside: (_) {
            FocusScope.of(context).unfocus();
            _handleFocusChange(false);
          },
          decoration: InputDecoration(
            hintText: 'Search products...',
            hintStyle: theme.textTheme.bodyMedium?.copyWith(
              color: theme.textTheme.bodyMedium?.color?.withOpacity(0.5),
            ),
            prefixIcon: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(
                  icon: Icon(
                    Icons.tune_rounded,
                    color: theme.colorScheme.primary,
                    size: 20,
                  ),
                  onPressed: widget.onFilterTap,
                ),
                Container(
                  width: 1,
                  height: 24,
                  color: theme.dividerColor,
                ),
                SizedBox(width: 12),
                Icon(
                  Icons.search,
                  color: isDark ? AppColors.gold : AppColors.grey600,
                  size: 20,
                ),
                SizedBox(width: 8),
              ],
            ),
            suffixIcon: _searchController.text.isNotEmpty
                ? IconButton(
                    icon: Icon(
                      Icons.clear,
                      color: theme.iconTheme.color,
                      size: 18,
                    ),
                    onPressed: () {
                      _searchController.clear();
                      widget.onChanged?.call('');
                      setState(() {});
                    },
                  )
                : null,
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
          ),
          onChanged: (value) {
            setState(() {});
            widget.onChanged?.call(value);
          },
        ),
      ),
    );
  }
}

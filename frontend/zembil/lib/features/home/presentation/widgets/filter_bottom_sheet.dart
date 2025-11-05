import 'package:flutter/material.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/app_text_styles.dart';

class FilterBottomSheet extends StatefulWidget {
  final Function(Map<String, dynamic>) onApply;
  final Map<String, dynamic> currentFilters;

  const FilterBottomSheet({
    super.key,
    required this.onApply,
    required this.currentFilters,
  });

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  late RangeValues _priceRange;
  late String _selectedCategory;
  late double _minDiscount;
  late bool _isFeatured;
  late String _sortBy;

  final List<String> _categories = [
    "All",
    "Sports and Outdoors",
    "Electronics",
    "Home and Kitchen",
    "Fashion",
    "Furniture",
    "Musical Instruments"
  ];

  final List<String> _sortOptions = [
    "Newest",
    "Price: Low to High",
    "Price: High to Low",
    "Most Popular"
  ];

  @override
  void initState() {
    super.initState();
    _priceRange = RangeValues(
      widget.currentFilters['minPrice'] ?? 0,
      widget.currentFilters['maxPrice'] ?? 5000,
    );
    _selectedCategory = widget.currentFilters['category'] ?? "All";
    _minDiscount = widget.currentFilters['minDiscount'] ?? 0;
    _isFeatured = widget.currentFilters['isFeatured'] == 'true';
    _sortBy = widget.currentFilters['sortBy'] ?? "Newest";
  }

  void _resetFilters() {
    setState(() {
      _priceRange = const RangeValues(0, 5000);
      _selectedCategory = "All";
      _minDiscount = 0;
      _isFeatured = false;
      _sortBy = "Newest";
    });
  }

  void _applyFilters() {
    final filters = {
      'minPrice': _priceRange.start,
      'maxPrice': _priceRange.end,
      'category': _selectedCategory == "All" ? null : _selectedCategory,
      'minDiscount': _minDiscount > 0 ? _minDiscount : null,
      'isFeatured': _isFeatured ? 'true' : null,
      'sortBy': _sortBy,
    };
    // Remove null values
    filters.removeWhere((key, value) => value == null);
    
    widget.onApply(filters);
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return Container(
      height: r.hp(85),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: Column(
        children: [
          // Header
          Container(
            padding: EdgeInsets.all(r.mediumSpace),
            decoration: BoxDecoration(
              border: Border(
                bottom: BorderSide(color: theme.dividerColor),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextButton(
                  onPressed: _resetFilters,
                  child: Text(
                    'Reset',
                    style: TextStyle(
                      color: theme.colorScheme.error,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                Text(
                  'Filters',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close),
                ),
              ],
            ),
          ),

          // Content
          Expanded(
            child: ListView(
              padding: EdgeInsets.all(r.largeSpace),
              children: [
                _buildSectionTitle('Category', theme),
                SizedBox(height: r.smallSpace),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _categories.map((category) {
                    final isSelected = _selectedCategory == category;
                    return FilterChip(
                      label: Text(category),
                      selected: isSelected,
                      onSelected: (selected) {
                        setState(() => _selectedCategory = category);
                      },
                      selectedColor: theme.colorScheme.primary.withOpacity(0.2),
                      checkmarkColor: theme.colorScheme.primary,
                      labelStyle: TextStyle(
                        color: isSelected
                            ? theme.colorScheme.primary
                            : theme.textTheme.bodyMedium?.color,
                        fontWeight:
                            isSelected ? FontWeight.bold : FontWeight.normal,
                      ),
                      backgroundColor: theme.cardTheme.color,
                      side: BorderSide(
                        color: isSelected
                            ? theme.colorScheme.primary
                            : theme.dividerColor,
                      ),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 8),
                    );
                  }).toList(),
                ),

                SizedBox(height: r.largeSpace),
                _buildSectionTitle('Price Range', theme),
                SizedBox(height: r.smallSpace),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('\$${_priceRange.start.round()}'),
                    Text('\$${_priceRange.end.round()}'),
                  ],
                ),
                RangeSlider(
                  values: _priceRange,
                  min: 0,
                  max: 5000,
                  divisions: 100,
                  activeColor: theme.colorScheme.primary,
                  inactiveColor: theme.colorScheme.primary.withOpacity(0.2),
                  onChanged: (values) => setState(() => _priceRange = values),
                ),

                SizedBox(height: r.largeSpace),
                _buildSectionTitle('Discount', theme),
                SizedBox(height: r.smallSpace),
                Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Minimum Discount'),
                        Text('${_minDiscount.round()}%+'),
                      ],
                    ),
                    Slider(
                      value: _minDiscount,
                      min: 0,
                      max: 90,
                      divisions: 9,
                      label: '${_minDiscount.round()}%',
                      activeColor: theme.colorScheme.primary,
                      inactiveColor: theme.colorScheme.primary.withOpacity(0.2),
                      onChanged: (value) => setState(() => _minDiscount = value),
                    ),
                  ],
                ),

                SizedBox(height: r.largeSpace),
                _buildSectionTitle('Sort By', theme),
                SizedBox(height: r.smallSpace),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _sortOptions.map((option) {
                    final isSelected = _sortBy == option;
                    return ChoiceChip(
                      label: Text(option),
                      selected: isSelected,
                      onSelected: (selected) {
                        if (selected) setState(() => _sortBy = option);
                      },
                      selectedColor: theme.colorScheme.primary.withOpacity(0.2),
                      labelStyle: TextStyle(
                        color: isSelected
                            ? theme.colorScheme.primary
                            : theme.textTheme.bodyMedium?.color,
                        fontWeight:
                            isSelected ? FontWeight.bold : FontWeight.normal,
                      ),
                      backgroundColor: theme.cardTheme.color,
                      side: BorderSide(
                        color: isSelected
                            ? theme.colorScheme.primary
                            : theme.dividerColor,
                      ),
                    );
                  }).toList(),
                ),

                SizedBox(height: r.largeSpace),
                SwitchListTile(
                  title: const Text('Show Featured Only'),
                  value: _isFeatured,
                  onChanged: (value) => setState(() => _isFeatured = value),
                  activeColor: theme.colorScheme.primary,
                  contentPadding: EdgeInsets.zero,
                ),
              ],
            ),
          ),

          // Apply Button
          Padding(
            padding: EdgeInsets.all(r.largeSpace),
            child: SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _applyFilters,
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.primary,
                  foregroundColor: isDark ? AppColors.darkGreyDark : Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 4,
                ),
                child: const Text(
                  'Apply Filters',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title, ThemeData theme) {
    return Text(
      title,
      style: theme.textTheme.titleMedium?.copyWith(
        fontWeight: FontWeight.bold,
      ),
    );
  }
}


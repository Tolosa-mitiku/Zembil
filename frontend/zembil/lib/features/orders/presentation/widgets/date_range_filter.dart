import 'package:flutter/material.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';

class DateRangeFilter extends StatefulWidget {
  final DateTime? startDate;
  final DateTime? endDate;
  final Function(DateTime?, DateTime?) onApply;

  const DateRangeFilter({
    super.key,
    this.startDate,
    this.endDate,
    required this.onApply,
  });

  @override
  State<DateRangeFilter> createState() => _DateRangeFilterState();
}

class _DateRangeFilterState extends State<DateRangeFilter> {
  DateTime? _startDate;
  DateTime? _endDate;

  @override
  void initState() {
    super.initState();
    _startDate = widget.startDate;
    _endDate = widget.endDate;
  }

  Future<void> _selectDate(BuildContext context, bool isStart) async {
    final initialDate = isStart
        ? (_startDate ?? DateTime.now())
        : (_endDate ?? DateTime.now());
    final firstDate = DateTime(2020);
    final lastDate = DateTime.now();

    final picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: firstDate,
      lastDate: lastDate,
      builder: (context, child) {
        final theme = Theme.of(context);
        return Theme(
          data: theme.copyWith(
            colorScheme: theme.colorScheme.copyWith(
              primary: theme.colorScheme.primary,
              onPrimary: Colors.white,
              surface: theme.cardTheme.color,
              onSurface: theme.textTheme.bodyLarge?.color,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        if (isStart) {
          _startDate = picked;
          if (_endDate != null && _endDate!.isBefore(_startDate!)) {
            _endDate = null;
          }
        } else {
          _endDate = picked;
          if (_startDate != null && _startDate!.isAfter(_endDate!)) {
            _startDate = null;
          }
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return Container(
      padding: EdgeInsets.all(r.largeSpace),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        borderRadius: BorderRadius.vertical(top: Radius.circular(r.largeRadius)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Filter by Date',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (_startDate != null || _endDate != null)
                TextButton(
                  onPressed: () {
                    setState(() {
                      _startDate = null;
                      _endDate = null;
                    });
                  },
                  child: Text(
                    'Reset',
                    style: TextStyle(color: theme.colorScheme.error),
                  ),
                ),
            ],
          ),
          SizedBox(height: r.largeSpace),

          // Date Inputs
          Row(
            children: [
              Expanded(
                child: _buildDateInput(
                  context,
                  'Start Date',
                  _startDate,
                  () => _selectDate(context, true),
                  theme,
                  isDark,
                  r,
                ),
              ),
              SizedBox(width: r.mediumSpace),
              Icon(Icons.arrow_forward, color: theme.disabledColor),
              SizedBox(width: r.mediumSpace),
              Expanded(
                child: _buildDateInput(
                  context,
                  'End Date',
                  _endDate,
                  () => _selectDate(context, false),
                  theme,
                  isDark,
                  r,
                ),
              ),
            ],
          ),

          SizedBox(height: r.xLargeSpace),

          // Apply Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                widget.onApply(_startDate, _endDate);
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.colorScheme.primary,
                foregroundColor: isDark ? AppColors.darkGreyDark : Colors.white,
                padding: EdgeInsets.symmetric(vertical: r.mediumSpace),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(r.mediumRadius),
                ),
              ),
              child: const Text(
                'Apply Filter',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ),
          SizedBox(height: r.mediumSpace),
        ],
      ),
    );
  }

  Widget _buildDateInput(
    BuildContext context,
    String label,
    DateTime? date,
    VoidCallback onTap,
    ThemeData theme,
    bool isDark,
    Responsive r,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: theme.textTheme.bodySmall?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          SizedBox(height: r.smallSpace),
          Container(
            padding: EdgeInsets.all(r.mediumSpace),
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              borderRadius: BorderRadius.circular(r.mediumRadius),
              border: Border.all(
                color: isDark ? AppColors.gold.withOpacity(0.2) : AppColors.grey300,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.calendar_today_outlined,
                  size: 18,
                  color: theme.colorScheme.primary,
                ),
                SizedBox(width: r.smallSpace),
                Text(
                  date != null
                      ? '${date.day}/${date.month}/${date.year}'
                      : 'Select',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: date != null
                        ? theme.textTheme.bodyMedium?.color
                        : theme.disabledColor,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}


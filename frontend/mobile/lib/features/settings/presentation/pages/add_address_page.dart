import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/app_text_styles.dart';

class AddAddressPage extends StatefulWidget {
  const AddAddressPage({super.key});

  @override
  State<AddAddressPage> createState() => _AddAddressPageState();
}

class _AddAddressPageState extends State<AddAddressPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  final _phoneController = TextEditingController();
  bool _isDefault = false;

  @override
  void dispose() {
    _nameController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _saveAddress() {
    if (_formKey.currentState!.validate()) {
      final newAddress = {
        'id': DateTime.now().toString(),
        'name': _nameController.text,
        'address': _addressController.text,
        'city': _cityController.text,
        'phone': _phoneController.text,
        'isDefault': _isDefault,
        'icon': Icons.location_on_rounded, // Default icon
        'color': Colors.blue, // Default color
      };
      context.pop(newAddress);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final r = context.r;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'Add New Address',
          style:
              theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: Container(
            padding: EdgeInsets.all(r.tinySpace),
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              shape: BoxShape.circle,
              border: Border.all(
                color: isDark
                    ? AppColors.gold.withOpacity(0.2)
                    : AppColors.grey200,
              ),
            ),
            child: Icon(Icons.arrow_back_ios_new,
                size: 18, color: theme.iconTheme.color),
          ),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(r.largeSpace),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildTextField(
                controller: _nameController,
                label: 'Address Name (e.g., Home, Office)',
                icon: Icons.label_outline,
                theme: theme,
                isDark: isDark,
                r: r,
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter a name'
                    : null,
              ),
              SizedBox(height: r.mediumSpace),
              _buildTextField(
                controller: _addressController,
                label: 'Street Address',
                icon: Icons.home_outlined,
                theme: theme,
                isDark: isDark,
                r: r,
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter address'
                    : null,
              ),
              SizedBox(height: r.mediumSpace),
              Row(
                children: [
                  Expanded(
                    child: _buildTextField(
                      controller: _cityController,
                      label: 'City',
                      icon: Icons.location_city_outlined,
                      theme: theme,
                      isDark: isDark,
                      r: r,
                      validator: (value) =>
                          value == null || value.isEmpty ? 'Required' : null,
                    ),
                  ),
                  SizedBox(width: r.mediumSpace),
                  Expanded(
                    child: _buildTextField(
                      controller: _phoneController,
                      label: 'Phone',
                      icon: Icons.phone_outlined,
                      theme: theme,
                      isDark: isDark,
                      r: r,
                      keyboardType: TextInputType.phone,
                      validator: (value) =>
                          value == null || value.isEmpty ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              SizedBox(height: r.largeSpace),

              // Default Address Switch
              Container(
                padding: EdgeInsets.all(r.mediumSpace),
                decoration: BoxDecoration(
                  color: theme.cardTheme.color,
                  borderRadius: BorderRadius.circular(r.mediumRadius),
                  border: Border.all(
                    color: isDark
                        ? AppColors.gold.withOpacity(0.1)
                        : AppColors.grey200,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.getShadow(isDark),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: EdgeInsets.all(r.smallSpace),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.primary.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.check_circle_outline,
                            color: theme.colorScheme.primary,
                            size: r.largeIcon,
                          ),
                        ),
                        SizedBox(width: r.mediumSpace),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Set as Default',
                              style: theme.textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              'Use as primary shipping address',
                              style: theme.textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ],
                    ),
                    Switch(
                      value: _isDefault,
                      onChanged: (value) => setState(() => _isDefault = value),
                      activeColor: theme.colorScheme.primary,
                    ),
                  ],
                ),
              ),

              SizedBox(height: r.xLargeSpace),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _saveAddress,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.colorScheme.primary,
                    foregroundColor:
                        isDark ? AppColors.darkGreyDark : Colors.white,
                    padding: EdgeInsets.symmetric(vertical: r.mediumSpace),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(r.largeRadius),
                    ),
                    elevation: 4,
                    shadowColor: theme.colorScheme.primary.withOpacity(0.4),
                  ),
                  child: Text(
                    'Save Address',
                    style: AppTextStyles.button.copyWith(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isDark ? AppColors.darkGreyDark : Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required ThemeData theme,
    required bool isDark,
    required Responsive r,
    String? Function(String?)? validator,
    TextInputType? keyboardType,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style:
              theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
        ),
        SizedBox(height: r.smallSpace),
        TextFormField(
          controller: controller,
          validator: validator,
          keyboardType: keyboardType,
          style: theme.textTheme.bodyLarge,
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: theme.colorScheme.primary),
            filled: true,
            fillColor: theme.cardTheme.color,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(r.mediumRadius),
              borderSide: BorderSide.none,
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(r.mediumRadius),
              borderSide: BorderSide.none,
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(r.mediumRadius),
              borderSide: BorderSide(
                color: theme.colorScheme.primary,
                width: 1.5,
              ),
            ),
            contentPadding: EdgeInsets.symmetric(
              horizontal: r.mediumSpace,
              vertical: r.mediumSpace,
            ),
          ),
        ),
      ],
    );
  }
}

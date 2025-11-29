import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/core/responsive.dart';
import 'package:zembil/core/theme/app_colors.dart';
import 'package:zembil/core/theme/app_text_styles.dart';
import 'package:zembil/features/profile/domain/entity/profile.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_event.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_state.dart';

class EditProfilePageRedesign extends StatefulWidget {
  final ProfileEntity profile;

  const EditProfilePageRedesign({super.key, required this.profile});

  @override
  State<EditProfilePageRedesign> createState() =>
      _EditProfilePageRedesignState();
}

class _EditProfilePageRedesignState extends State<EditProfilePageRedesign> {
  late TextEditingController _nameController;
  late TextEditingController _imageUrlController;
  bool _hasChanges = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.profile.name ?? '');
    _imageUrlController =
        TextEditingController(text: widget.profile.image ?? '');

    _nameController.addListener(_checkChanges);
    _imageUrlController.addListener(_checkChanges);
  }

  void _checkChanges() {
    setState(() {
      _hasChanges = _nameController.text != (widget.profile.name ?? '') ||
          _imageUrlController.text != (widget.profile.image ?? '');
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _imageUrlController.dispose();
    super.dispose();
  }

  void _saveChanges(BuildContext context) {
    final updatedProfile = ProfileEntity(
      email: widget.profile.email,
      name: _nameController.text.trim(),
      image: _imageUrlController.text.trim(),
    );

    context.read<ProfileBloc>().add(UpdateProfileEvent(updatedProfile));
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
          'Edit Profile',
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
        actions: [
          BlocListener<ProfileBloc, ProfileState>(
            listener: (context, state) {
              if (state is ProfileUpdated) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text('Profile updated successfully!'),
                    backgroundColor: AppColors.success,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
                context.pop();
              } else if (state is ProfileError) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(state.message),
                    backgroundColor: theme.colorScheme.error,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
            child: BlocBuilder<ProfileBloc, ProfileState>(
              builder: (context, state) {
                if (state is ProfileUpdating) {
                  return Padding(
                    padding: EdgeInsets.all(r.mediumSpace),
                    child: SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: theme.colorScheme.primary),
                    ),
                  );
                }

                return TextButton(
                  onPressed: _hasChanges ? () => _saveChanges(context) : null,
                  child: Text(
                    'Save',
                    style: AppTextStyles.button.copyWith(
                      color: _hasChanges
                          ? theme.colorScheme.primary
                          : theme.disabledColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(r.largeSpace),
          child: Column(
            children: [
              // Glowing Avatar Uploader
              Center(
                child: Stack(
                  children: [
                    Container(
                      padding: EdgeInsets.all(r.tinySpace),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          colors: [
                            theme.colorScheme.primary,
                            theme.colorScheme.secondary,
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: theme.colorScheme.primary.withOpacity(0.3),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      ),
                      child: Container(
                        padding: EdgeInsets.all(r.tinySpace / 2),
                        decoration: BoxDecoration(
                          color: theme.scaffoldBackgroundColor,
                          shape: BoxShape.circle,
                        ),
                        child: CircleAvatar(
                          radius: r.avatarLarge,
                          backgroundColor: isDark
                              ? AppColors.darkGreyCard
                              : AppColors.grey100,
                          backgroundImage: _imageUrlController.text.isNotEmpty
                              ? NetworkImage(_imageUrlController.text)
                              : null,
                          child: _imageUrlController.text.isEmpty
                              ? Icon(
                                  Icons.person,
                                  size: r.xLargeIcon,
                                  color: theme.colorScheme.primary,
                                )
                              : null,
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      right: r.smallSpace,
                      child: Container(
                        padding: EdgeInsets.all(r.smallSpace),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              theme.colorScheme.secondary,
                              theme.colorScheme.primary,
                            ],
                          ),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 8,
                            ),
                          ],
                          border: Border.all(
                            color: theme.scaffoldBackgroundColor,
                            width: 3,
                          ),
                        ),
                        child: Icon(
                          Icons.camera_alt_rounded,
                          size: r.smallIcon,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              SizedBox(height: r.xLargeSpace),

              // Modern Floating Labels Form
              _buildModernTextField(
                controller: _nameController,
                label: 'Full Name',
                icon: Icons.person_outline_rounded,
                theme: theme,
                isDark: isDark,
                r: r,
              ),

              SizedBox(height: r.largeSpace),

              _buildModernTextField(
                controller: _imageUrlController,
                label: 'Profile Image URL',
                icon: Icons.link_rounded,
                theme: theme,
                isDark: isDark,
                r: r,
                hintText: 'https://example.com/image.jpg',
              ),

              SizedBox(height: r.largeSpace),

              // Read-only Email
              Opacity(
                opacity: 0.7,
                child: _buildModernTextField(
                  controller: TextEditingController(text: widget.profile.email),
                  label: 'Email Address',
                  icon: Icons.email_outlined,
                  theme: theme,
                  isDark: isDark,
                  r: r,
                  readOnly: true,
                  suffixIcon: Icons.lock_outline_rounded,
                ),
              ),

              SizedBox(height: r.xLargeSpace),

              // Info Card
              Container(
                padding: EdgeInsets.all(r.mediumSpace),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(r.mediumRadius),
                  border: Border.all(
                    color: theme.colorScheme.primary.withOpacity(0.1),
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      Icons.info_outline_rounded,
                      color: theme.colorScheme.primary,
                      size: r.mediumIcon,
                    ),
                    SizedBox(width: r.mediumSpace),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Account Information',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.primary,
                            ),
                          ),
                          SizedBox(height: r.tinySpace),
                          Text(
                            'Your email address is linked to your account and cannot be changed. Contact support for help.',
                            style: theme.textTheme.bodySmall?.copyWith(
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildModernTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required ThemeData theme,
    required bool isDark,
    required Responsive r,
    String? hintText,
    bool readOnly = false,
    IconData? suffixIcon,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(r.mediumRadius),
        boxShadow: [
          BoxShadow(
            color: AppColors.getShadow(isDark),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: TextField(
        controller: controller,
        readOnly: readOnly,
        style: theme.textTheme.bodyLarge,
        decoration: InputDecoration(
          labelText: label,
          hintText: hintText,
          prefixIcon: Icon(icon, color: theme.colorScheme.primary),
          suffixIcon: suffixIcon != null
              ? Icon(suffixIcon, color: theme.disabledColor)
              : null,
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
          filled: true,
          fillColor: readOnly
              ? (isDark ? Colors.black12 : Colors.grey.shade50)
              : theme.cardTheme.color,
          contentPadding: EdgeInsets.symmetric(
            horizontal: r.mediumSpace,
            vertical: r.mediumSpace,
          ),
        ),
      ),
    );
  }
}

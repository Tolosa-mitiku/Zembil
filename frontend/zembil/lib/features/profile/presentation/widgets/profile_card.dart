import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/profile/domain/entity/profile.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_event.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_state.dart';

class ProfileCard extends StatelessWidget {
  final ProfileEntity profile;
  const ProfileCard(this.profile, {super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Card(
        elevation: 4,
        color: theme.cardTheme.color,
        margin: const EdgeInsets.all(0),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: Icon(
                    Icons.settings_outlined,
                    color: theme.iconTheme.color,
                  ),
                  onPressed: () {
                    // Add functionality for settings icon
                  },
                ),
                IconButton(
                  icon: Icon(
                    Icons.edit_outlined,
                    color: theme.iconTheme.color,
                  ),
                  onPressed: () {
                    // Add functionality for edit icon
                  },
                ),
              ],
            ),
            const SizedBox(height: 50.0),
            Divider(
              color: theme.dividerTheme.color,
              height: 1.0,
            ),
            ListTile(
              leading: Icon(
                Icons.home_outlined,
                color: theme.iconTheme.color,
              ),
              title: Text(
                'My Address',
                style: theme.textTheme.labelMedium,
              ),
              trailing: Icon(
                Icons.navigate_next_rounded,
                color: theme.iconTheme.color,
              ),
            ),
            ListTile(
              leading: Icon(
                Icons.history_outlined,
                color: theme.iconTheme.color,
              ),
              title: Text(
                'Order History',
                style: theme.textTheme.labelMedium,
              ),
              trailing: Icon(
                Icons.navigate_next_rounded,
                color: theme.iconTheme.color,
              ),
            ),
            ListTile(
              leading: Icon(
                Icons.lock_outline,
                color: theme.iconTheme.color,
              ),
              title: Text(
                'Change Password',
                style: theme.textTheme.labelMedium,
              ),
              trailing: Icon(
                Icons.navigate_next_rounded,
                color: theme.iconTheme.color,
              ),
            ),
            ListTile(
              leading: Icon(
                Icons.settings_outlined,
                color: theme.iconTheme.color,
              ),
              title: Text(
                'Settings',
                style: theme.textTheme.labelMedium,
              ),
              trailing: Icon(
                Icons.navigate_next_rounded,
                color: theme.iconTheme.color,
              ),
            ),
            ListTile(
              leading: Icon(
                Icons.help_outline,
                color: theme.iconTheme.color,
              ),
              title: Text(
                'FAQs',
                style: theme.textTheme.labelMedium,
              ),
              trailing: Icon(
                Icons.navigate_next_rounded,
                color: theme.iconTheme.color,
              ),
            ),
            Divider(
              color: theme.dividerTheme.color,
            ),
            BlocBuilder<ProfileBloc, ProfileState>(builder: (context, state) {
              return state is SignOutLoading
                  ? CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(
                        theme.colorScheme.primary,
                      ),
                    )
                  : ListTile(
                      leading: Icon(
                        Icons.logout,
                        color: theme.colorScheme.error,
                      ),
                      title: Text(
                        'Log Out',
                        style: theme.textTheme.labelMedium?.copyWith(
                          color: theme.colorScheme.error,
                        ),
                      ),
                      onTap: () {
                        context.read<ProfileBloc>().add(SignOutEvent());
                      },
                    );
            })
          ],
        ),
      ),
    );
  }
}

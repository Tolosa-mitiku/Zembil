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
    return Container(
      decoration: BoxDecoration(
        color: Colors.black,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Card(
        elevation: 10,
        color: Theme.of(context).primaryColor,
        margin: EdgeInsets.all(0),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: Icon(Icons.settings, color: Colors.black),
                  onPressed: () {
                    // Add functionality for settings icon
                  },
                ),
                IconButton(
                  icon: Icon(Icons.edit, color: Colors.black),
                  onPressed: () {
                    // Add functionality for edit icon
                  },
                ),
              ],
            ),
            SizedBox(height: 50.0),
            Container(
              color: Colors.black,
              height: 1.0,
              margin: EdgeInsets.symmetric(vertical: 10.0),
            ),
            ListTile(
              // tileColor: Colors.black,
              leading: Icon(Icons.home, color: Colors.black),
              title: Text(
                'My Address',
                style: Theme.of(context).textTheme.labelMedium,
              ),
              trailing: Icon(Icons.navigate_next_rounded, color: Colors.black),
            ),
            ListTile(
              leading: Icon(Icons.history, color: Colors.black),
              title: Text(
                'Order History',
                style: Theme.of(context).textTheme.labelMedium,
              ),
              trailing: Icon(Icons.navigate_next_rounded, color: Colors.black),
            ),
            ListTile(
              leading: Icon(Icons.password, color: Colors.black),
              title: Text(
                'Change Password',
                style: Theme.of(context).textTheme.labelMedium,
              ),
              trailing: Icon(Icons.navigate_next_rounded, color: Colors.black),
            ),
            ListTile(
              leading: Icon(Icons.settings, color: Colors.black),
              title: Text(
                'Settings',
                style: Theme.of(context).textTheme.labelMedium,
              ),
              trailing: Icon(Icons.navigate_next_rounded, color: Colors.black),
            ),
            ListTile(
              leading: Icon(Icons.question_answer, color: Colors.black),
              title: Text(
                'FAQs',
                style: Theme.of(context).textTheme.labelMedium,
              ),
              trailing: Icon(Icons.navigate_next_rounded, color: Colors.black),
            ),
            Divider(
              color: Colors.black,
            ),
            BlocBuilder<ProfileBloc, ProfileState>(builder: (context, state) {
              return state is SignOutLoading
                  ? CircularProgressIndicator()
                  : ListTile(
                      leading: Icon(
                        Icons.logout,
                        color: Colors.redAccent,
                      ),
                      title: Text(
                        'Log Out',
                        style: TextStyle(color: Colors.redAccent),
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

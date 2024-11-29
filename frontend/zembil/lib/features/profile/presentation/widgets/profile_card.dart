import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/authentication/presentation/pages/login.dart';
import 'package:zembil/features/profile/domain/entity/profile.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_event.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_state.dart';

class ProfileCard extends StatelessWidget {
  const ProfileCard({super.key});

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height;

    return BlocConsumer<ProfileBloc, ProfileState>(
      listener: (context, state) {
        if (state is SignOutSuccess) {
          Navigator.push(
              context, MaterialPageRoute(builder: (context) => Login()));
        }
        if (state is SignOutError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.message)),
          );
        }
      },
      builder: (context, state) {
        ProfileEntity profile = ProfileEntity();
        if (state is ProfileLoaded) profile = state.profile;
        return SizedBox(
          // color: Colors.red,
          height: height * 0.65,
          child: Stack(
            alignment: Alignment.topCenter,
            children: [
              Column(
                children: [
                  SizedBox(
                    // color: Colors.blue,
                    height: 80.0,
                  ),
                  Card(
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            IconButton(
                              icon: Icon(Icons.settings),
                              onPressed: () {
                                // Add functionality for settings icon
                              },
                            ),
                            IconButton(
                              icon: Icon(Icons.edit),
                              onPressed: () {
                                // Add functionality for edit icon
                              },
                            ),
                          ],
                        ),
                        SizedBox(height: 50.0),
                        Container(
                          color: Colors.grey,
                          height: 1.0,
                          margin: EdgeInsets.symmetric(vertical: 10.0),
                        ),
                        ListTile(
                          leading: Icon(Icons.home),
                          title: Text('My Address'),
                          trailing: Icon(Icons.navigate_next_rounded),
                        ),
                        ListTile(
                          leading: Icon(Icons.history),
                          title: Text('Order History'),
                          trailing: Icon(Icons.navigate_next_rounded),
                        ),
                        ListTile(
                          leading: Icon(Icons.password),
                          title: Text('Change Password'),
                          trailing: Icon(Icons.navigate_next_rounded),
                        ),
                        ListTile(
                          leading: Icon(Icons.settings),
                          title: Text('Settings'),
                          trailing: Icon(Icons.navigate_next_rounded),
                        ),
                        ListTile(
                          leading: Icon(Icons.question_answer),
                          title: Text('FAQs'),
                          trailing: Icon(Icons.navigate_next_rounded),
                        ),
                        Divider(),
                        state is SignOutLoading
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
                                  context
                                      .read<ProfileBloc>()
                                      .add(SignOutEvent());
                                },
                              ),
                      ],
                    ),
                  ),
                ],
              ),
              Column(
                children: [
                  CircleAvatar(
                    radius: 60.0,
                    backgroundColor: Colors.white,
                    backgroundImage: profile.image != null
                        ? NetworkImage(profile.image ?? '')
                        : AssetImage('assets/images/profile.jpg'),
                  ),
                  SizedBox(height: 10.0),
                  state is ProfileLoading
                      ? CircularProgressIndicator()
                      : Text(
                          profile.name ?? 'John Doe',
                          style: TextStyle(
                              fontSize: 20.0, fontWeight: FontWeight.bold),
                        ),
                  state is ProfileLoading
                      ? CircularProgressIndicator()
                      : Text(
                          profile.email ?? 'johndoe@example.com',
                          style: TextStyle(fontSize: 16.0),
                        )
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}

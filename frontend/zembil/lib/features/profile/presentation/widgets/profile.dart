import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/profile/domain/entity/profile.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_state.dart';

class Profile extends StatelessWidget {
  final ProfileEntity profile;
  const Profile(this.profile, {super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CircleAvatar(
          radius: 60.0,
          backgroundColor: Colors.white,
          backgroundImage: profile.image != null
              ? NetworkImage(profile.image ?? '')
              : AssetImage('assets/images/profile.jpg'),
        ),
        SizedBox(height: 10.0),
        BlocBuilder<ProfileBloc, ProfileState>(builder: (context, state) {
          return Column(
            children: [
              state is ProfileLoading
                  ? CircularProgressIndicator()
                  : Text(
                      profile.name ?? 'John Doe',
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
              state is ProfileLoading
                  ? CircularProgressIndicator()
                  : Text(
                      profile.email ?? 'johndoe@example.com',
                      style: Theme.of(context).textTheme.bodyLarge,
                    )
            ],
          );
        }),
      ],
    );
  }
}

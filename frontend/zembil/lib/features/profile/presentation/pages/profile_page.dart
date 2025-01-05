import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:zembil/features/profile/domain/entity/profile.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_event.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_state.dart';
import 'package:zembil/features/profile/presentation/widgets/profile.dart';
import 'package:zembil/features/profile/presentation/widgets/profile_card.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  @override
  void initState() {
    context.read<ProfileBloc>().add(GetProfileEvent());
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height;
    return Scaffold(
        backgroundColor: Theme.of(context).primaryColor,
        body: BlocConsumer<ProfileBloc, ProfileState>(
          listener: (context, state) {
            if (state is SignOutSuccess) {
              context.go("/login");
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
            return Container(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 30),
              child: Center(
                child: SizedBox(
                  height: height * 0.65,
                  child: Stack(
                    alignment: Alignment.topCenter,
                    children: [
                      Column(
                        children: [
                          SizedBox(
                            height: 80.0,
                          ),
                          ProfileCard(
                            profile,
                          )
                        ],
                      ),
                      Profile(
                        profile,
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ));

    //
  }
}

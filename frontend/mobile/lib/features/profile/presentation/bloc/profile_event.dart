import 'package:equatable/equatable.dart';
import 'package:zembil/features/profile/domain/entity/profile.dart';

abstract class ProfileEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class GetProfileEvent extends ProfileEvent {}

class UpdateProfileEvent extends ProfileEvent {
  final ProfileEntity profileEntity;

  UpdateProfileEvent(this.profileEntity);

  @override
  List<Object> get props => [profileEntity];
}

class SignOutEvent extends ProfileEvent {}

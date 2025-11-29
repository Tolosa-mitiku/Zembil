import 'package:equatable/equatable.dart';
import 'package:zembil/features/profile/domain/entity/profile.dart';

abstract class ProfileState extends Equatable {
  @override
  List<Object> get props => [];
}

class ProfileInitial extends ProfileState {}

class ProfileLoading extends ProfileState {}

class ProfileLoaded extends ProfileState {
  final ProfileEntity profile;

  ProfileLoaded(this.profile);

  @override
  List<Object> get props => [profile];
}

class ProfileError extends ProfileState {
  final String message;

  ProfileError(this.message);

  @override
  List<Object> get props => [message];
}

class SignOutLoading extends ProfileState {}

class SignOutSuccess extends ProfileState {}

class SignOutError extends ProfileState {
  final String message;

  SignOutError(this.message);

  @override
  List<Object> get props => [message];
}

class ProfileUpdating extends ProfileState {}

class ProfileUpdated extends ProfileState {
  final ProfileEntity profile;

  ProfileUpdated(this.profile);

  @override
  List<Object> get props => [profile];
}

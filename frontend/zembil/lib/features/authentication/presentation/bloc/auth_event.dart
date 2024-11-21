import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class CheckAuthStatusEvent extends AuthEvent {}

class SignOutEvent extends AuthEvent {}

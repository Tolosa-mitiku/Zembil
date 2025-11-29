import 'package:equatable/equatable.dart';
import 'package:zembil/features/authentication/domain/entity/auth.dart';

abstract class AuthState extends Equatable {
  @override
  List<Object> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthAuthenticated extends AuthState {
  final AuthUser? user;

  AuthAuthenticated(this.user);

  @override
  List<Object> get props => [user!];
}

class AuthError extends AuthState {
  final String message;

  AuthError(this.message);

  @override
  List<Object> get props => [message];
}

class AuthLoggedOut extends AuthState {}

class AuthUnauthenticated extends AuthState {}

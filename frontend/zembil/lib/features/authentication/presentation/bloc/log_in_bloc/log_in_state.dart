import 'package:equatable/equatable.dart';
import 'package:zembil/features/authentication/domain/entity/auth.dart';

abstract class LogInState extends Equatable {
  @override
  List<Object?> get props => [];
}

class LogInInitial extends LogInState {}

class LogInWithGoogleLoading extends LogInState {}

class LogInWithEmailAndPasswordLoading extends LogInState {}

class LogInFormValidationError extends LogInState {
  final String? emailError;
  final String? passwordError;

  LogInFormValidationError({
    this.emailError,
    this.passwordError,
  });

  @override
  List<Object?> get props => [emailError, passwordError];
}

class LogInAuthenticated extends LogInState {
  final AuthUser? user;

  LogInAuthenticated(this.user);

  @override
  List<Object> get props => [user!];
}

class LogInError extends LogInState {
  final String message;

  LogInError(this.message);

  @override
  List<Object> get props => [message];
}

import 'package:equatable/equatable.dart';
import 'package:zembil/features/authentication/domain/entity/auth.dart';

abstract class SignUpState extends Equatable {
  @override
  List<Object?> get props => [];
}

class SignUpInitial extends SignUpState {}

class SignUpWithGoogleLoading extends SignUpState {}

class SignUpWithEmailAndPasswordLoading extends SignUpState {}

class SignUpFormValidationError extends SignUpState {
  final String? emailError;
  final String? passwordError;
  final String? confirmPasswordError;

  SignUpFormValidationError({
    this.emailError,
    this.passwordError,
    this.confirmPasswordError,
  });

  @override
  List<Object?> get props => [emailError, passwordError, confirmPasswordError];
}

class SignUpAuthenticated extends SignUpState {
  final AuthUser? user;

  SignUpAuthenticated(this.user);

  @override
  List<Object> get props => [user!];
}

class SignUpError extends SignUpState {
  final String message;

  SignUpError(this.message);

  @override
  List<Object> get props => [message];
}

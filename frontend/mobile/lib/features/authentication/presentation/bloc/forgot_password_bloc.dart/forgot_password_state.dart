import 'package:equatable/equatable.dart';

abstract class ForgotPasswordState extends Equatable {
  @override
  List<Object?> get props => [];
}

class ForgotPasswordInitial extends ForgotPasswordState {}

class ResetPasswordLoading extends ForgotPasswordState {}

class ResetPasswordSentSuccess extends ForgotPasswordState {
  final String message;
  ResetPasswordSentSuccess(this.message);
  @override
  List<Object?> get props => [message];
}

class ForgotPasswordError extends ForgotPasswordState {
  final String message;

  ForgotPasswordError(this.message);

  @override
  List<Object> get props => [message];
}

class ForgotPasswordFormValidationError extends ForgotPasswordState {
  final String? emailError;

  ForgotPasswordFormValidationError({
    this.emailError,
  });

  @override
  List<Object?> get props => [emailError];
}

import 'package:equatable/equatable.dart';

abstract class ForgotPasswordEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class ForgotPasswordEmailChanged extends ForgotPasswordEvent {
  final String? email;
  ForgotPasswordEmailChanged(this.email);
  @override
  List<Object> get props => [];
}

class ResetPasswordEvent extends ForgotPasswordEvent {
  final String email;

  ResetPasswordEvent(this.email);

  @override
  List<Object> get props => [email];
}

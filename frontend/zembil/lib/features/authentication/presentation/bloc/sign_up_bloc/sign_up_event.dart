import 'package:equatable/equatable.dart';

abstract class SignUpEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class EmailChanged extends SignUpEvent {
  final String? email;
  EmailChanged(this.email);

  @override
  List<Object> get props => [email!];
}

class PasswordChanged extends SignUpEvent {
  final String? password;
  PasswordChanged(this.password);

  @override
  List<Object> get props => [password!];
}

class ConfirmPasswordChanged extends SignUpEvent {
  final String? confirmPassword;
  ConfirmPasswordChanged(this.confirmPassword);

  @override
  List<Object> get props => [confirmPassword!];
}

class SignUpWithEmailEvent extends SignUpEvent {
  final String email;
  final String password;

  SignUpWithEmailEvent(this.email, this.password);

  @override
  List<Object> get props => [email, password];
}

class SignInWithGoogleEvent extends SignUpEvent {}

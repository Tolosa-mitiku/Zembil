import 'package:equatable/equatable.dart';

abstract class LogInEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class LogInEmailChanged extends LogInEvent {
  final String? email;
  LogInEmailChanged(this.email);

  @override
  List<Object> get props => [email!];
}

class LogInPasswordChanged extends LogInEvent {
  final String? password;
  LogInPasswordChanged(this.password);

  @override
  List<Object> get props => [password!];
}

class LogInWithEmailEvent extends LogInEvent {
  final String email;
  final String password;

  LogInWithEmailEvent(this.email, this.password);

  @override
  List<Object> get props => [email, password];
}

class SignInWithGoogleEvent extends LogInEvent {}

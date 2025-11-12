import 'package:equatable/equatable.dart';

abstract class LogInEvent extends Equatable {
  @override
  List<Object> get props => [];
}

// form events
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

// Firebase login event
class FirebaseSignInWithGoogleEvent extends LogInEvent {}

class FirebaseLogInWithEmailEvent extends LogInEvent {
  final String email;
  final String password;

  FirebaseLogInWithEmailEvent(this.email, this.password);

  @override
  List<Object> get props => [email, password];
}

class CheckVerificationEmailEvent extends LogInEvent {}

// Zembil login event

class ZembilLogInEvent extends LogInEvent {}

import 'package:equatable/equatable.dart';
import 'package:zembil/features/authentication/domain/entity/auth.dart';

abstract class EmailVerificationState extends Equatable {
  @override
  List<Object?> get props => [];
}

class EmailVerificationInitial extends EmailVerificationState {}

// firebase send email verification state

class SendEmailVerificationLoading extends EmailVerificationState {}

class SendEmailVerificationSuccess extends EmailVerificationState {}

// firebase check email verification state
class CheckEmailVerificationLoading extends EmailVerificationState {}

class EmailVerified extends EmailVerificationState {}

// zembil log in state

class ZembilLogInAuthenticated extends EmailVerificationState {
  final AuthUser? user;

  ZembilLogInAuthenticated(this.user);

  @override
  List<Object> get props => [user!];
}

// firebase email verification error
class EmailVerificationError extends EmailVerificationState {
  final String message;

  EmailVerificationError(this.message);

  @override
  List<Object> get props => [message];
}

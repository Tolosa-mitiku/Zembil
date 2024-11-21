import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/authentication/domain/usecase/login_with_email.dart';
import 'package:zembil/features/authentication/domain/usecase/sign_in_with_google.dart';
import 'package:zembil/features/authentication/domain/usecase/validate_email.dart';
import 'package:zembil/features/authentication/domain/usecase/validate_password.dart';

import 'log_in_event.dart';
import 'log_in_state.dart';

class LogInBloc extends Bloc<LogInEvent, LogInState> {
  final LogInWithEmail loginWithEmail;
  final SignInWithGoogle signInWithGoogle;

  final ValidateEmail validateEmail;
  final ValidatePassword validatePassword;

  String? email = '';
  String? password = '';

  LogInBloc({
    required this.loginWithEmail,
    required this.signInWithGoogle,
    required this.validateEmail,
    required this.validatePassword,
  }) : super(LogInInitial()) {
    on<LogInEmailChanged>((event, emit) {
      email = event.email;
      _validateForm(emit);
    });

    on<LogInPasswordChanged>((event, emit) {
      password = event.password;
      _validateForm(emit);
    });
    on<LogInWithEmailEvent>((event, emit) async {
      emit(LogInWithEmailAndPasswordLoading());

      final emailError = validateEmail(email);
      final passwordError = validatePassword(password);

      if (emailError != null || passwordError != null) {
        emit(LogInFormValidationError(
          emailError: emailError,
          passwordError: passwordError,
        ));
        return;
      }

      final result = await loginWithEmail(event.email, event.password);

      result.fold(
        (failure) => emit(LogInError(_mapFailureToMessage(failure))),
        (user) => emit(LogInAuthenticated(user)),
      );
    });

    on<SignInWithGoogleEvent>((event, emit) async {
      emit(LogInWithGoogleLoading());
      final result = await signInWithGoogle();
      result.fold(
        (failure) => emit(LogInError(_mapFailureToMessage(failure))),
        (user) => emit(LogInAuthenticated(user)),
      );
    });
  }

  void _validateForm(Emitter<LogInState> emit) {
    final emailError = validateEmail(email);
    final passwordError = validatePassword(password);

    emit(LogInFormValidationError(
      emailError: emailError,
      passwordError: passwordError,
    ));
  }

  String _mapFailureToMessage(Failure failure) {
    switch (failure.runtimeType) {
      case ServerFailure:
        return 'A server error occurred. Please try again later.';
      case NetworkFailure:
        return 'Please check your internet connection.';
      case AuthFailure:
        return "Authentication Failed Please Try Again"; // Custom message for Firebase auth errors
      default:
        return 'An unexpected error occurred.';
    }
  }
}
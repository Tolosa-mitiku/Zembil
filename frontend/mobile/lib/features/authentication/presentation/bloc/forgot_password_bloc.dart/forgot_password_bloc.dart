import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/authentication/domain/usecase/reset_password.dart';
import 'package:zembil/features/authentication/domain/usecase/validate_email.dart';
import 'package:zembil/features/authentication/presentation/bloc/forgot_password_bloc.dart/forgot_password_event.dart';
import 'package:zembil/features/authentication/presentation/bloc/forgot_password_bloc.dart/forgot_password_state.dart';

class ForgotPasswordBloc
    extends Bloc<ForgotPasswordEvent, ForgotPasswordState> {
  final ValidateEmail validateEmail;
  final ResetPassword resetPassword;

  String? email = '';

  ForgotPasswordBloc({required this.validateEmail, required this.resetPassword})
      : super(ForgotPasswordInitial()) {
    on<ForgotPasswordEmailChanged>((event, emit) {
      email = event.email;
      _validateForm(emit);
    });

    on<ResetPasswordEvent>((event, emit) async {
      emit(ResetPasswordLoading());

      final emailError = validateEmail(email);

      if (emailError != null) {
        emit(ForgotPasswordFormValidationError(
          emailError: emailError,
        ));
        return;
      }

      final result = await resetPassword.call(event.email);
      result.fold(
          (failure) => emit(ForgotPasswordError(_mapFailureToMessage(failure))),
          (_) => emit(
              ResetPasswordSentSuccess("Reset Password Sent to Your email.")));
    });
  }
  void _validateForm(Emitter<ForgotPasswordState> emit) {
    final emailError = validateEmail(email);

    emit(ForgotPasswordFormValidationError(
      emailError: emailError,
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

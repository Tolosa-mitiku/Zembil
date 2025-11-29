import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/authentication/domain/usecase/login_zembil.dart';
import 'package:zembil/features/authentication/domain/usecase/sign_in_with_google.dart';
import 'package:zembil/features/authentication/domain/usecase/sign_up_with_email.dart';
import 'package:zembil/features/authentication/domain/usecase/validate_confirm_password.dart';
import 'package:zembil/features/authentication/domain/usecase/validate_email.dart';
import 'package:zembil/features/authentication/domain/usecase/validate_password.dart';

import 'sign_up_event.dart';
import 'sign_up_state.dart';

class SignUpBloc extends Bloc<SignUpEvent, SignUpState> {
  final SignUpWithEmail signUpWithEmail;
  final SignInWithGoogle signInWithGoogle;
  final ZembilLogIn zembilLogIn;
  final ValidateEmail validateEmail;
  final ValidatePassword validatePassword;
  final ValidateConfirmPassword validateConfirmPassword;

  String? email = '';
  String? password = '';
  String? confirmPassword = '';

  SignUpBloc({
    required this.signUpWithEmail,
    required this.signInWithGoogle,
    required this.zembilLogIn,
    required this.validateEmail,
    required this.validatePassword,
    required this.validateConfirmPassword,
  }) : super(SignUpInitial()) {
    on<EmailChanged>((event, emit) {
      email = event.email;
      _validateForm(emit);
    });

    on<PasswordChanged>((event, emit) {
      password = event.password;
      _validateForm(emit);
    });

    on<ConfirmPasswordChanged>((event, emit) {
      confirmPassword = event.confirmPassword;
      _validateForm(emit);
    });

// Firebase sign up with email and password bloc

    on<FirebaseSignUpWithEmailEvent>((event, emit) async {
      emit(SignUpWithEmailAndPasswordLoading());

      final emailError = validateEmail(email);
      final passwordError = validatePassword(password);
      final confirmPasswordError =
          validateConfirmPassword(password, confirmPassword);

      if (emailError != null ||
          passwordError != null ||
          confirmPasswordError != null) {
        emit(SignUpFormValidationError(
          emailError: emailError,
          passwordError: passwordError,
          confirmPasswordError: confirmPasswordError,
        ));
        return;
      }

      final result = await signUpWithEmail(event.email, event.password);
      result.fold(
        (failure) => emit(SignUpError(_mapFailureToMessage(failure))),
        (_) => emit(FirebaseEmailVerificationRequired()),
      );
    });

// firebase sign up with google bloc

    on<FirebaseSignUpWithGoogleEvent>((event, emit) async {
      emit(SignUpWithGoogleLoading());
      final result = await signInWithGoogle.call();
      result.fold(
        (failure) => emit(SignUpError(_mapFailureToMessage(failure))),
        (_) => emit(FirebaseSignUpAuthenticated()),
      );
    });

// zembil log in bloc
    on<ZembilLogInEvent>((event, emit) async {
      final result = await zembilLogIn.call();
      result.fold((failure) => emit(SignUpError(_mapFailureToMessage(failure))),
          (user) => emit(ZembilLogInAuthenticated(user)));
    });
  }

  void _validateForm(Emitter<SignUpState> emit) {
    final emailError = validateEmail(email);
    final passwordError = validatePassword(password);
    final confirmPasswordError =
        validateConfirmPassword(password, confirmPassword);

    emit(SignUpFormValidationError(
      emailError: emailError,
      passwordError: passwordError,
      confirmPasswordError: confirmPasswordError,
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

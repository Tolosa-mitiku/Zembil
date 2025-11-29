import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/authentication/domain/usecase/check_verification_email.dart';
import 'package:zembil/features/authentication/domain/usecase/login_zembil.dart';
import 'package:zembil/features/authentication/domain/usecase/send_verification_email.dart';
import 'package:zembil/features/authentication/presentation/bloc/email_verification_bloc/email_verification_event.dart';
import 'package:zembil/features/authentication/presentation/bloc/email_verification_bloc/email_verification_state.dart';

class EmailVerificationBloc
    extends Bloc<EmailVerificationEvent, EmailVerificationState> {
  final SendVerificationEmail sendVerificationEmail;
  final CheckVerificationEmail checkVerificationEmail;
  final ZembilLogIn zembilLogIn;

  EmailVerificationBloc(
      {required this.sendVerificationEmail,
      required this.checkVerificationEmail,
      required this.zembilLogIn})
      : super(EmailVerificationInitial()) {
    // firebase send email verification bloc
    on<SendEmailVerificationEvent>((event, emit) async {
      emit(SendEmailVerificationLoading());
      final result = await sendVerificationEmail.call();

      result.fold(
        (failure) =>
            emit(EmailVerificationError(_mapFailureToMessage(failure))),
        (_) => emit(SendEmailVerificationSuccess()),
      );
    });
// firebase check email verification bloc
    on<CheckEmailVerificationEvent>((event, emit) async {
      emit(CheckEmailVerificationLoading());
      final result = await checkVerificationEmail.call();

      result.fold(
        (failure) =>
            emit(EmailVerificationError(_mapFailureToMessage(failure))),
        (status) async {
          if (status == true) {
            emit(EmailVerified());
            return;
          }
          emit(EmailVerificationError(
              'Your email has not been verified. Try again.'));
        },
      );
    });

// firebase zembil login bloc
    on<ZembilLogInEvent>((event, emit) async {
      final result = await zembilLogIn.call();
      result.fold(
          (failure) =>
              emit(EmailVerificationError(_mapFailureToMessage(failure))),
          (user) => emit(ZembilLogInAuthenticated(user)));
    });
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

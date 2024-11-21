import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/secure_storage.dart';
import 'package:zembil/features/authentication/domain/usecase/sign_out.dart';

import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final SecureStorageHelper secureStorageHelper;
  final SignOut signOut;

  AuthBloc({
    required this.secureStorageHelper,
    required this.signOut,
  }) : super(AuthInitial()) {
    on<CheckAuthStatusEvent>((event, emit) async {
      // Check if there is a valid token
      final hasToken = await secureStorageHelper.hasValidToken();
      if (!hasToken) {
        emit(AuthUnauthenticated());
      }
    });
    on<SignOutEvent>((event, emit) async {
      emit(AuthLoading());
      final result = await signOut();
      result.fold(
        (failure) => emit(AuthError(failure.message)),
        (_) => emit(AuthLoggedOut()),
      );
    });
  }
}

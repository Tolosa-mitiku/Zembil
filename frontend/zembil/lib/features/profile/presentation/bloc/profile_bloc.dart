import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/core/failures.dart';
import 'package:zembil/features/authentication/domain/usecase/sign_out.dart';
import 'package:zembil/features/profile/domain/usecase/get_profile.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_event.dart';
import 'package:zembil/features/profile/presentation/bloc/profile_state.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  final GetProfile getProfile;
  final SignOut signOut;

  ProfileBloc({required this.getProfile, required this.signOut})
      : super(ProfileInitial()) {
    on<GetProfileEvent>((event, emit) async {
      emit(ProfileLoading());

      final result = await getProfile.call();

      result.fold((failure) => emit(ProfileError(mapFailureToMessage(failure))),
          (profile) => emit(ProfileLoaded(profile)));
    });

    on<SignOutEvent>((event, emit) async {
      emit(SignOutLoading());

      final result = await signOut.call();

      result.fold((failure) => emit(SignOutError(mapFailureToMessage(failure))),
          (profile) => emit(SignOutSuccess()));
    });
  }

  String mapFailureToMessage(Failure failure) {
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

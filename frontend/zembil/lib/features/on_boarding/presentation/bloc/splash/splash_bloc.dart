import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/on_boarding/domain/usecase/check_authenticated.dart';
import 'package:zembil/features/on_boarding/domain/usecase/check_onboarding.dart';
import 'package:zembil/features/on_boarding/presentation/bloc/splash/splash_event.dart';
import 'package:zembil/features/on_boarding/presentation/bloc/splash/splash_state.dart';

class SplashBloc extends Bloc<SplashEvent, SplashState> {
  final CheckOnboardingUseCase checkOnboardingUseCase;
  final CheckAuthenticatedUseCase checkAuthenticatedUseCase;

  SplashBloc(
      {required this.checkOnboardingUseCase,
      required this.checkAuthenticatedUseCase})
      : super(SplashInitial()) {
    on<CheckOnboardingStatus>((event, emit) async {
      final isOnboarded = checkOnboardingUseCase.call();
      if (isOnboarded) {
        final isAuthenticated = await checkAuthenticatedUseCase.call();
        if (isAuthenticated) {
          emit(SplashAuthenticated());
        } else {
          emit(SplashUnAuthenticated());
        }
      } else {
        emit(SplashOnboarding());
      }
    });
  }
}

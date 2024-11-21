import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zembil/features/on_boarding/domain/usecase/complete_onboarding.dart';
import 'package:zembil/features/on_boarding/presentation/bloc/onboarding/onboarding_event.dart';
import 'package:zembil/features/on_boarding/presentation/bloc/onboarding/onboarding_state.dart';

class OnboardingBloc extends Bloc<OnboardingEvent, OnboardingState> {
  final CompleteOnboardingUseCase completeOnboardingUseCase;

  OnboardingBloc({required this.completeOnboardingUseCase})
      : super(OnboardingInitial()) {
    on<CompleteOnboardingEvent>((event, emit) async {
      await completeOnboardingUseCase.call();
      emit(OnboardingCompleted());
    });
  }
}

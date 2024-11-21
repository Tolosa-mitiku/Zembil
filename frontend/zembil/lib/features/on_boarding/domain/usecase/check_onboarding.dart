import 'package:zembil/features/on_boarding/domain/repository/onboarding.dart';

class CheckOnboardingUseCase {
  final OnboardingRepository repository;

  CheckOnboardingUseCase(this.repository);

  bool call() {
    return repository.hasSeenOnboarding();
  }
}

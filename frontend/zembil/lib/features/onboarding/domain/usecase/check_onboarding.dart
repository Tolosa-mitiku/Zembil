import 'package:zembil/features/onboarding/domain/repository/onboarding_repository.dart';

class CheckOnboardingUseCase {
  final OnboardingRepository repository;

  CheckOnboardingUseCase(this.repository);

  bool call() {
    return repository.hasSeenOnboarding();
  }
}

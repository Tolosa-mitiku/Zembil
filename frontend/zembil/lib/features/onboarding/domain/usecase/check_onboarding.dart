import 'package:zembil/features/onboarding/domain/repository/onboarding.dart';

class CheckOnboardingUseCase {
  final OnboardingRepository repository;

  CheckOnboardingUseCase(this.repository);

  bool call() {
    return repository.hasSeenOnboarding();
  }
}

import 'package:zembil/features/onboarding/domain/repository/onboarding_repository.dart';

class CompleteOnboardingUseCase {
  final OnboardingRepository repository;

  CompleteOnboardingUseCase(this.repository);

  Future<void> call() async {
    await repository.completeOnboarding();
  }
}

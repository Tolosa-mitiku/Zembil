import 'package:zembil/features/on_boarding/domain/repository/onboarding.dart';

class CompleteOnboardingUseCase {
  final OnboardingRepository repository;

  CompleteOnboardingUseCase(this.repository);

  Future<void> call() async {
    await repository.completeOnboarding();
  }
}

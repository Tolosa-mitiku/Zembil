import 'package:zembil/features/on_boarding/domain/repository/onboarding.dart';

class CheckAuthenticatedUseCase {
  final OnboardingRepository repository;

  CheckAuthenticatedUseCase(this.repository);

  Future<bool> call() {
    return repository.isAuthenticated();
  }
}

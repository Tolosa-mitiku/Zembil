import 'package:zembil/features/onboarding/data/data_sources/onboarding_data_source.dart';
import 'package:zembil/features/onboarding/domain/repository/onboarding_repository.dart';

class OnboardingRepositoryImpl extends OnboardingRepository {
  final OnboardingDataSource onboardingDataSource;

  OnboardingRepositoryImpl(this.onboardingDataSource);

  @override
  bool hasSeenOnboarding() {
    return onboardingDataSource.hasSeenOnboarding();
  }

  @override
  Future<bool> isAuthenticated() {
    return onboardingDataSource.isAuthenticated();
  }

  @override
  Future<void> completeOnboarding() async {
    await onboardingDataSource.completeOnboarding();
  }
}
